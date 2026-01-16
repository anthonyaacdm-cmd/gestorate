
import { supabase } from '@/lib/customSupabaseClient';

/**
 * Fetch Appointments Report Data
 */
export const fetchAppointmentsReport = async (filters) => {
  try {
    let query = supabase
      .from('appointments')
      .select(`
        *,
        users (id, name, email, phone),
        admin_user:admin_id (id, name, email)
      `)
      .order('date', { ascending: false })
      .order('time', { ascending: true });

    if (filters.start_date) {
      query = query.gte('date', filters.start_date.toISOString().split('T')[0]);
    }
    if (filters.end_date) {
      query = query.lte('date', filters.end_date.toISOString().split('T')[0]);
    }
    if (filters.status && filters.status !== 'all') {
      query = query.eq('status', filters.status);
    }
    if (filters.admin_id && filters.admin_id !== 'all') {
      query = query.eq('admin_id', filters.admin_id);
    }

    const { data, error } = await query;

    if (error) throw error;
    
    // Normalize data structure for reporting
    return data.map(apt => ({
      id: apt.id,
      date: apt.date,
      time: apt.time,
      status: apt.status,
      service: apt.exam_type || apt.service || '-',
      client_name: apt.is_guest ? (apt.guest_name || 'Convidado') : (apt.users?.name || 'Usuário'),
      client_email: apt.is_guest ? apt.guest_email : apt.users?.email,
      client_phone: apt.is_guest ? apt.guest_phone : apt.users?.phone,
      admin_name: apt.admin_user?.name || 'Não atribuído',
      created_at: apt.created_at
    }));

  } catch (error) {
    console.error('Error fetching appointments report:', error);
    throw error;
  }
};

/**
 * Fetch Clients Report Data
 * Aggregates appointments by user/guest
 */
export const fetchClientsReport = async (filters) => {
  try {
    // Re-use appointment fetching logic to get base data
    const appointments = await fetchAppointmentsReport(filters);

    // Group by client
    const clientMap = {};

    appointments.forEach(apt => {
      const key = apt.client_email || apt.client_name || 'Desconhecido';
      
      if (!clientMap[key]) {
        clientMap[key] = {
          client_name: apt.client_name,
          client_email: apt.client_email,
          client_phone: apt.client_phone,
          total_appointments: 0,
          confirmed_appointments: 0,
          canceled_appointments: 0,
          last_appointment: apt.date,
          services: new Set()
        };
      }

      clientMap[key].total_appointments += 1;
      clientMap[key].services.add(apt.service);
      
      if (apt.status === 'confirmed') clientMap[key].confirmed_appointments += 1;
      if (apt.status === 'canceled') clientMap[key].canceled_appointments += 1;
      
      // Update last appointment if this one is more recent
      if (new Date(apt.date) > new Date(clientMap[key].last_appointment)) {
        clientMap[key].last_appointment = apt.date;
      }
    });

    return Object.values(clientMap).map(client => ({
      ...client,
      services: Array.from(client.services).join(', ')
    }));

  } catch (error) {
    console.error('Error fetching clients report:', error);
    throw error;
  }
};

/**
 * Fetch Revenue/Summary Report Data
 * Note: Since we don't have explicit prices in the DB schema provided,
 * we will focus on volume metrics.
 */
export const fetchRevenueReport = async (filters) => {
  try {
     const appointments = await fetchAppointmentsReport(filters);
     
     // Group by Month or Admin for Summary
     const summaryByAdmin = {};
     
     appointments.forEach(apt => {
        const adminName = apt.admin_name;
        if (!summaryByAdmin[adminName]) {
            summaryByAdmin[adminName] = {
                admin_name: adminName,
                total: 0,
                confirmed: 0,
                canceled: 0
            };
        }
        summaryByAdmin[adminName].total += 1;
        if (apt.status === 'confirmed') summaryByAdmin[adminName].confirmed += 1;
        if (apt.status === 'canceled') summaryByAdmin[adminName].canceled += 1;
     });
     
     return Object.values(summaryByAdmin);

  } catch (error) {
    console.error('Error fetching revenue report:', error);
    throw error;
  }
};

/**
 * Fetch Availabilities Report
 * Allows admins to see coverage
 */
export const fetchAvailabilitiesReport = async (filters) => {
  try {
    let query = supabase
      .from('availabilities')
      .select('*, users:admin_id(name)')
      .order('date', { ascending: true });

    if (filters.start_date) {
      query = query.gte('date', filters.start_date.toISOString().split('T')[0]);
    }
    if (filters.end_date) {
      query = query.lte('date', filters.end_date.toISOString().split('T')[0]);
    }
    if (filters.admin_id && filters.admin_id !== 'all') {
      query = query.eq('admin_id', filters.admin_id);
    }

    const { data, error } = await query;
    if (error) throw error;

    return data.map(slot => ({
        id: slot.id,
        date: slot.date,
        time: slot.time,
        admin_name: slot.users?.name || 'Desconhecido',
        is_available: slot.available ? 'Sim' : 'Não'
    }));
  } catch (error) {
      console.error(error);
      throw error;
  }
};
