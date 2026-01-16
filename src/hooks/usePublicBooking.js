
import { useState, useCallback } from 'react';
import { supabase } from '@/lib/customSupabaseClient';
import { checkRateLimit, recordAttempt } from '@/utils/rateLimit';

export const usePublicBooking = () => {
  const [admin, setAdmin] = useState(null);
  const [availabilities, setAvailabilities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const fetchAdminData = useCallback(async (adminId) => {
    try {
      setLoading(true);
      setError(null);
      
      const { data, error: fetchError } = await supabase
        .from('users')
        .select('*')
        .eq('id', adminId)
        .eq('role', 'admin') // Assuming we only book 'admin' role
        .eq('active', true)
        .single();

      if (fetchError) throw fetchError;
      setAdmin(data);
    } catch (err) {
      console.error('Error fetching admin:', err);
      setError('Profissional não encontrado ou indisponível.');
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchAvailabilities = useCallback(async (adminId) => {
    try {
      const today = new Date().toISOString().split('T')[0];
      
      const { data, error: fetchError } = await supabase
        .from('availabilities')
        .select('*')
        .eq('admin_id', adminId)
        .eq('available', true)
        .gte('date', today)
        .order('date')
        .order('time');

      if (fetchError) throw fetchError;
      setAvailabilities(data);
    } catch (err) {
      console.error('Error fetching availabilities:', err);
      // Don't block UI, just empty availabilities
      setAvailabilities([]);
    }
  }, []);

  const validateEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const validatePhone = (phone) => {
    // Basic validation, allow common formats
    return phone && phone.length >= 10; 
  };

  const createGuestAppointment = async (appointmentData) => {
    setLoading(true);
    setError(null);

    try {
      // 1. Check rate limit
      const { allowed, error: rateError, ip } = await checkRateLimit();
      if (!allowed) {
        throw new Error(rateError);
      }

      // 2. Validate availability again to prevent double booking race condition
      const { data: availabilityCheck } = await supabase
        .from('availabilities')
        .select('*')
        .eq('admin_id', appointmentData.admin_id)
        .eq('date', appointmentData.date)
        .eq('time', appointmentData.time)
        .eq('available', true)
        .single();

      if (!availabilityCheck) {
        throw new Error('Este horário não está mais disponível. Por favor, escolha outro.');
      }

      // 3. Create Appointment
      const { data: newAppointment, error: insertError } = await supabase
        .from('appointments')
        .insert({
          date: appointmentData.date,
          time: appointmentData.time,
          exam_type: appointmentData.exam_type,
          status: 'pending',
          guest_name: appointmentData.guest_name,
          guest_email: appointmentData.guest_email,
          guest_phone: appointmentData.guest_phone,
          is_guest: true,
          admin_id: appointmentData.admin_id,
          client_ip: ip,
          // user_id is null for guests
        })
        .select()
        .single();

      if (insertError) throw insertError;

      // 4. Mark availability as taken
      await supabase
        .from('availabilities')
        .update({ available: false })
        .eq('id', availabilityCheck.id);

      // 5. Send confirmation email (Edge Function)
      // Don't fail the booking if email fails, just log it
      try {
        await supabase.functions.invoke('send-booking-confirmation', {
          body: {
            guest_email: appointmentData.guest_email,
            guest_name: appointmentData.guest_name,
            appointment_date: appointmentData.date,
            appointment_time: appointmentData.time,
            admin_name: admin?.name || 'Profissional',
            confirmation_number: newAppointment.id.slice(0, 8).toUpperCase()
          }
        });
      } catch (emailErr) {
        console.warn('Failed to send confirmation email:', emailErr);
      }

      // 6. Record attempt for rate limiting
      recordAttempt();
      
      setSuccess(true);
      return newAppointment;

    } catch (err) {
      console.error('Booking error:', err);
      setError(err.message || 'Erro ao realizar agendamento.');
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    admin,
    availabilities,
    loading,
    error,
    success,
    fetchAdminData,
    fetchAvailabilities,
    createGuestAppointment,
    validateEmail,
    validatePhone
  };
};
