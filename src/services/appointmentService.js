
import { supabase } from '@/lib/customSupabaseClient';
import { createNotificationForAppointment } from '@/services/notificationService';
import { logWebhookAttempt } from '@/utils/webhookLogger';
import { validatePhone as isValidPhone } from '@/utils/validation';

/**
 * Triggers the n8n webhook for appointment processing.
 * 
 * This function constructs a standardized payload and sends it to the configured n8n endpoint.
 * It uses a fire-and-forget pattern in the main flow but waits here for the HTTP response
 * to log the result.
 * 
 * @param {object} appointmentData - Complete appointment object with related user/admin info.
 * @returns {Promise<{success: boolean, error?: string}>}
 */
export const triggerN8nWebhook = async (appointmentData) => {
  const webhookUrl = import.meta.env.VITE_N8N_WEBHOOK_BASE_URL 
    ? `${import.meta.env.VITE_N8N_WEBHOOK_BASE_URL}/webhook/appointments`
    : null;

  if (!webhookUrl) {
    const msg = 'N8N_WEBHOOK_BASE_URL is not configured in environment variables.';
    console.warn(msg);
    logWebhookAttempt(appointmentData?.id, 'warning', { message: msg });
    return { success: false, error: msg };
  }

  // 1. Validation
  if (!appointmentData?.id || !appointmentData?.date) {
    const msg = 'Invalid appointment data: Missing ID or Date.';
    console.error(msg);
    return { success: false, error: msg };
  }

  try {
    // 2. Construct Payload
    // Determine client details (could be a registered user or a guest)
    const client = appointmentData.user_id 
      ? {
          id: appointmentData.user_id,
          name: appointmentData.users?.name || 'Registered User',
          email: appointmentData.users?.email,
          phone: appointmentData.users?.phone
        }
      : {
          id: 'guest',
          name: appointmentData.guest_name,
          email: appointmentData.guest_email,
          phone: appointmentData.guest_phone
        };

    // Determine admin details (fetched or passed)
    const admin = appointmentData.admin_id && appointmentData.admin_user
      ? {
          id: appointmentData.admin_id,
          name: appointmentData.admin_user?.name,
          email: appointmentData.admin_user?.email,
          phone: appointmentData.admin_user?.phone
        }
      : { id: null, name: 'System', email: null };

    // Sanitize strings
    const sanitize = (str) => str ? str.replace(/[<>]/g, '').trim() : '';

    const payload = {
      appointment_id: appointmentData.id,
      date: appointmentData.date,
      time: appointmentData.time,
      service: sanitize(appointmentData.service || appointmentData.exam_type),
      notes: sanitize(appointmentData.notes),
      status: appointmentData.status || 'pending',
      client: {
        id: client.id,
        name: sanitize(client.name),
        email: sanitize(client.email),
        phone: client.phone // Assuming phone is already formatted/validated elsewhere or raw
      },
      admin: {
        id: admin.id,
        name: sanitize(admin.name),
        email: sanitize(admin.email),
        phone: admin.phone
      },
      timestamp: new Date().toISOString(),
      meta: {
        source: 'web-app',
        type: appointmentData.is_guest ? 'guest_booking' : 'user_booking'
      }
    };

    // Validate specific fields before sending
    if (client.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(client.email)) {
        throw new Error(`Invalid client email format: ${client.email}`);
    }

    // 3. Send Request with Timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout

    console.log('[Webhook] Sending payload to n8n:', payload);
    
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'AppointmentSystem/1.0',
        // Add secret if configured
        ...(import.meta.env.VITE_SUPABASE_WEBHOOK_SECRET ? { 'X-Webhook-Secret': import.meta.env.VITE_SUPABASE_WEBHOOK_SECRET } : {})
      },
      body: JSON.stringify(payload),
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`Webhook failed with status: ${response.status} ${response.statusText}`);
    }

    // Log success
    logWebhookAttempt(appointmentData.id, 'success', { url: webhookUrl });
    console.log('[Webhook] Successfully triggered n8n workflow.');
    
    return { success: true };

  } catch (error) {
    // 5. Error Handling
    const errorMessage = error.name === 'AbortError' ? 'Webhook request timed out' : error.message;
    console.error('[Webhook] Error triggering n8n:', errorMessage);
    
    // Log error for audit
    logWebhookAttempt(appointmentData?.id, 'error', { error: errorMessage });
    
    return { success: false, error: errorMessage };
  }
};

export const createAppointment = async (appointmentData) => {
  try {
    let userId = appointmentData.user_id;
    // Handle authenticated user check if not a guest booking
    if (!userId && !appointmentData.is_guest) {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User must be logged in to book an appointment');
      userId = user.id;
    }

    // 1. Insert into Supabase
    const { data, error } = await supabase
      .from('appointments')
      .insert([{
        user_id: userId || null,
        date: appointmentData.date,
        time: appointmentData.time,
        exam_type: appointmentData.exam_type,
        service: appointmentData.exam_type, // Map exam_type to service for consistency
        phone: appointmentData.phone || appointmentData.guest_phone,
        status: 'pending',
        
        // New fields
        guest_name: appointmentData.guest_name,
        guest_email: appointmentData.guest_email,
        guest_phone: appointmentData.guest_phone,
        is_guest: !!appointmentData.is_guest,
        admin_id: appointmentData.admin_id,
        notes: appointmentData.notes,
        client_ip: appointmentData.client_ip
      }])
      .select()
      .single();
    
    if (error) throw error;
    
    // 2. Notification (Internal)
    if (userId) {
        await createNotificationForAppointment(
            userId, 
            'appointment_created', 
            data.id, 
            `Data: ${appointmentData.date} às ${appointmentData.time}`
        );
    }

    // 3. Fetch enriched data for Webhook
    // We need to fetch the admin details to send to n8n
    const enrichAndTrigger = async () => {
        try {
            let adminUser = null;
            if (data.admin_id) {
                const { data: adminData } = await supabase
                    .from('users')
                    .select('name, email, phone')
                    .eq('id', data.admin_id)
                    .single();
                adminUser = adminData;
            }

            let userData = null;
            if (data.user_id) {
                 const { data: uData } = await supabase
                    .from('users')
                    .select('name, email, phone')
                    .eq('id', data.user_id)
                    .single();
                 userData = uData;
            }

            const completeData = {
                ...data,
                admin_user: adminUser,
                users: userData
            };

            // 4. Trigger Webhook (Fire and Forget)
            console.log(`[AppointmentService] Triggering webhook for appointment ${data.id}`);
            triggerN8nWebhook(completeData);
            
        } catch (enrichError) {
            console.error('[AppointmentService] Failed to prepare data for webhook:', enrichError);
        }
    };
    
    // Start webhook process without awaiting it to keep UI snappy
    enrichAndTrigger();
    
    // 5. Return success immediately
    return { data, error: null };

  } catch (error) {
    return { data: null, error: error.message };
  }
};

export const updateAppointment = async (id, updates) => {
  try {
    const { data, error } = await supabase
      .from('appointments')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    // Determine notification type
    if (updates.status === 'confirmed') {
      if(data.user_id) await createNotificationForAppointment(
        data.user_id,
        'appointment_confirmed',
        data.id,
        `Seu agendamento para ${data.date} foi confirmado.`
      );
    } 
    else if (updates.status === 'canceled') {
       if(data.user_id) await createNotificationForAppointment(
        data.user_id,
        'appointment_canceled',
        data.id,
        `Agendamento em ${data.date} foi cancelado.`
      );
    }
    else {
      if(data.user_id) await createNotificationForAppointment(
        data.user_id,
        'appointment_edited',
        data.id,
        `Alterações realizadas no agendamento de ${data.date}.`
      );
    }

    // Trigger webhook on updates as well (optional, but good for sync)
    // We need to fetch relations again
    const enrichAndTrigger = async () => {
        try {
            const { data: adminData } = data.admin_id ? await supabase.from('users').select('name, email, phone').eq('id', data.admin_id).single() : { data: null };
            const { data: userData } = data.user_id ? await supabase.from('users').select('name, email, phone').eq('id', data.user_id).single() : { data: null };
             
            const completeData = {
                ...data,
                admin_user: adminData,
                users: userData
            };
            triggerN8nWebhook(completeData);
        } catch (e) { console.error('Update webhook fail', e); }
    };
    enrichAndTrigger();

    return { data, error: null };
  } catch (error) {
    return { data: null, error: error.message };
  }
};

export const getUserAppointments = async (userId) => {
  try {
    const { data, error } = await supabase
      .from('appointments')
      .select('*')
      .eq('user_id', userId)
      .order('date', { ascending: true });
    
    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    return { data: null, error: error.message };
  }
};

export const cancelAppointment = async (appointmentId) => {
  try {
    const { data, error } = await supabase
      .from('appointments')
      .update({
        status: 'canceled',
        updated_at: new Date().toISOString()
      })
      .eq('id', appointmentId)
      .select()
      .single();
    
    if (error) throw error;

    if(data.user_id) {
        await createNotificationForAppointment(
        data.user_id, 
        'appointment_canceled', 
        data.id, 
        `O agendamento para ${data.date} foi cancelado.`
        );
    }
    
    // Trigger webhook for cancellation
    const enrichAndTrigger = async () => {
        try {
             const { data: adminData } = data.admin_id ? await supabase.from('users').select('name, email, phone').eq('id', data.admin_id).single() : { data: null };
            const { data: userData } = data.user_id ? await supabase.from('users').select('name, email, phone').eq('id', data.user_id).single() : { data: null };
            const completeData = { ...data, admin_user: adminData, users: userData };
            triggerN8nWebhook(completeData);
        } catch(e) { console.error(e); }
    };
    enrichAndTrigger();

    return { data, error: null };
  } catch (error) {
    return { data: null, error: error.message };
  }
};

export const getAvailability = async (date) => {
  try {
    const dateStr = typeof date === 'string' ? date : date.toISOString().split('T')[0];
    const { data, error } = await supabase
      .from('availabilities')
      .select('*')
      .eq('date', dateStr);
    
    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    return { data: [], error: error.message };
  }
};

// New functions for Admin

export const setAvailability = async (date, isAvailable, maxAppointments) => {
  try {
    // 1. Delete existing slots for this date
    const { error: deleteError } = await supabase
      .from('availabilities')
      .delete()
      .eq('date', date);
    
    if (deleteError) throw deleteError;

    // 2. If available, create new slots
    if (isAvailable) {
      const slots = [];
      // Create slots starting from 9:00 AM
      for (let i = 0; i < maxAppointments; i++) {
        const hour = 9 + i;
        const timeStr = `${hour.toString().padStart(2, '0')}:00:00`;
        slots.push({
          date: date,
          time: timeStr,
          available: true
        });
      }
      
      const { error: insertError } = await supabase
        .from('availabilities')
        .insert(slots);
        
      if (insertError) throw insertError;
    }
    
    return { error: null };
  } catch (error) {
    return { error: error.message };
  }
};

export const getPendingAppointments = async () => {
  try {
    const { data, error } = await supabase
      .from('appointments')
      .select('*, users(name, phone, email)')
      .eq('status', 'pending')
      .order('date', { ascending: true });
    
    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    return { data: null, error: error.message };
  }
};

export const confirmAppointment = async (appointmentId) => {
  return updateAppointment(appointmentId, { status: 'confirmed' });
};

export const getAppointmentsByDate = async (date) => {
  try {
    const { data, error } = await supabase
      .from('appointments')
      .select('*')
      .eq('date', date);
    
    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    return { data: [], error: error.message };
  }
};
