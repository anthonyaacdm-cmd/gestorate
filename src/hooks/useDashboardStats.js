
import { useCallback } from 'react';
import { supabase } from '@/lib/customSupabaseClient';
import { startOfMonth, subMonths, format, parseISO, startOfDay, endOfDay, subDays, isAfter, isBefore } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export const useDashboardStats = () => {
  
  // USER STATS
  const getUserStats = useCallback(async (userId) => {
    const { data, error } = await supabase
      .from('appointments')
      .select('status')
      .eq('user_id', userId);

    if (error) throw error;

    const stats = {
      total: data.length,
      pending: data.filter(a => a.status === 'pending').length,
      confirmed: data.filter(a => a.status === 'confirmed').length,
      canceled: data.filter(a => a.status === 'canceled').length
    };
    return stats;
  }, []);

  const getAppointmentsByMonth = useCallback(async (userId) => {
    const startDate = subMonths(new Date(), 5); // Last 6 months including current
    const { data, error } = await supabase
      .from('appointments')
      .select('date')
      .eq('user_id', userId)
      .gte('date', startOfMonth(startDate).toISOString());

    if (error) throw error;

    const months = {};
    // Initialize last 6 months
    for (let i = 5; i >= 0; i--) {
        const d = subMonths(new Date(), i);
        const key = format(d, 'MMM', { locale: ptBR });
        months[key] = 0;
    }

    data.forEach(app => {
        const month = format(parseISO(app.date), 'MMM', { locale: ptBR });
        if (months[month] !== undefined) {
            months[month]++;
        }
    });

    return Object.entries(months).map(([name, count]) => ({ name, count }));
  }, []);

  const getAppointmentsByDay = useCallback(async (userId) => {
    const { data, error } = await supabase
      .from('appointments')
      .select('date')
      .eq('user_id', userId);

    if (error) throw error;

    const days = {
        'domingo': 0, 'segunda-feira': 0, 'terça-feira': 0, 
        'quarta-feira': 0, 'quinta-feira': 0, 'sexta-feira': 0, 'sábado': 0
    };

    data.forEach(app => {
        const day = format(parseISO(app.date), 'eeee', { locale: ptBR }).toLowerCase();
        if (days[day] !== undefined) days[day]++;
    });

    // Map to array for Recharts, capitalizing names
    return Object.entries(days).map(([name, count]) => ({
        name: name.charAt(0).toUpperCase() + name.slice(1),
        count
    }));
  }, []);

  // ADMIN STATS
  const getAdminStats = useCallback(async () => {
    // We run parallel queries for performance
    const [usersRes, apptsRes, notifsRes, activeUsersRes] = await Promise.all([
        supabase.from('users').select('id', { count: 'exact', head: true }),
        supabase.from('appointments').select('id', { count: 'exact', head: true }),
        supabase.from('notifications').select('id', { count: 'exact', head: true }),
        supabase.from('users').select('id', { count: 'exact', head: true }).eq('active', true)
    ]);

    if (usersRes.error) throw usersRes.error;

    return {
        totalUsers: usersRes.count || 0,
        totalAppointments: apptsRes.count || 0,
        totalNotifications: notifsRes.count || 0,
        activeUsers: activeUsersRes.count || 0
    };
  }, []);

  const getSystemAppointmentsByMonth = useCallback(async () => {
    const startDate = subMonths(new Date(), 5);
    const { data, error } = await supabase
      .from('appointments')
      .select('date')
      .gte('date', startOfMonth(startDate).toISOString());

    if (error) throw error;

    const months = {};
    for (let i = 5; i >= 0; i--) {
        const d = subMonths(new Date(), i);
        const key = format(d, 'MMM', { locale: ptBR });
        months[key] = 0;
    }

    data.forEach(app => {
        const month = format(parseISO(app.date), 'MMM', { locale: ptBR });
        if (months[month] !== undefined) months[month]++;
    });

    return Object.entries(months).map(([name, count]) => ({ name, count }));
  }, []);

  const getNewUsersByMonth = useCallback(async () => {
    const startDate = subMonths(new Date(), 5);
    // created_at is timestampz
    const { data, error } = await supabase
      .from('users')
      .select('created_at')
      .gte('created_at', startOfMonth(startDate).toISOString());

    if (error) throw error;

    const months = {};
    for (let i = 5; i >= 0; i--) {
        const d = subMonths(new Date(), i);
        const key = format(d, 'MMM', { locale: ptBR });
        months[key] = 0;
    }

    data.forEach(user => {
        if (!user.created_at) return;
        const month = format(parseISO(user.created_at), 'MMM', { locale: ptBR });
        if (months[month] !== undefined) months[month]++;
    });

    return Object.entries(months).map(([name, count]) => ({ name, count }));
  }, []);

  const getTopActiveUsers = useCallback(async () => {
    // Requires aggregation. Since we can't do complex GROUP BY in client easily without pulling all data,
    // we will fetch appointments and aggregate in JS. 
    // WARNING: This is heavy if appointments table is huge. In production, use RPC.
    
    // Optimizing: fetch last 6 months or year to limit data size if needed, but for now fetching all.
    const { data: appointments, error } = await supabase
      .from('appointments')
      .select('user_id, date, users (name, email)');

    if (error) throw error;

    const userCounts = {};
    
    appointments.forEach(app => {
        if (!app.users) return; // Skip if user deleted or not found
        const uid = app.user_id;
        if (!userCounts[uid]) {
            userCounts[uid] = {
                name: app.users.name,
                email: app.users.email,
                count: 0,
                lastAppointment: app.date
            };
        }
        userCounts[uid].count++;
        if (new Date(app.date) > new Date(userCounts[uid].lastAppointment)) {
            userCounts[uid].lastAppointment = app.date;
        }
    });

    return Object.values(userCounts)
        .sort((a, b) => b.count - a.count)
        .slice(0, 5);
  }, []);

  const getUserActiveRatio = useCallback(async () => {
      const { data, error } = await supabase.from('users').select('active');
      if (error) throw error;

      const active = data.filter(u => u.active).length;
      const inactive = data.length - active;

      return [
          { name: 'Ativos', value: active },
          { name: 'Inativos', value: inactive }
      ];
  }, []);

  return {
    getUserStats,
    getAppointmentsByMonth,
    getAppointmentsByDay,
    getAdminStats,
    getSystemAppointmentsByMonth,
    getNewUsersByMonth,
    getTopActiveUsers,
    getUserActiveRatio
  };
};
