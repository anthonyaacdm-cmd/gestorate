
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { useAuth } from '@/context/AuthContext';
import MainLayout from '@/layouts/MainLayout';
import { supabase } from '@/lib/customSupabaseClient';
import { useDashboardStats } from '@/hooks/useDashboardStats';
import { Calendar, CheckCircle2, XCircle, Clock, Loader2 } from 'lucide-react';

// Components
import StatCard from '@/components/dashboard/StatCard';
import AppointmentsByMonthChart from '@/components/dashboard/AppointmentsByMonthChart';
import AppointmentsByDayChart from '@/components/dashboard/AppointmentsByDayChart';
import RecentAppointmentsTable from '@/components/dashboard/RecentAppointmentsTable';
import UpcomingAppointmentsTable from '@/components/dashboard/UpcomingAppointmentsTable';

const UserDashboard = () => {
  const { user } = useAuth();
  const { getUserStats, getAppointmentsByMonth, getAppointmentsByDay } = useDashboardStats();
  
  const [stats, setStats] = useState({ total: 0, pending: 0, confirmed: 0, canceled: 0 });
  const [monthlyData, setMonthlyData] = useState([]);
  const [dailyData, setDailyData] = useState([]);
  const [recentAppointments, setRecentAppointments] = useState([]);
  const [upcomingAppointments, setUpcomingAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.id) {
      fetchData();
      
      const channel = supabase
        .channel('public:appointments:user')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'appointments', filter: `user_id=eq.${user.id}` }, () => {
          fetchData();
        })
        .subscribe();
        
      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [user]);

  const fetchData = async () => {
    try {
      // Parallelize for speed
      const [
        statsData, 
        monthly, 
        daily, 
        { data: recent }, 
        { data: upcoming }
      ] = await Promise.all([
        getUserStats(user.id),
        getAppointmentsByMonth(user.id),
        getAppointmentsByDay(user.id),
        supabase.from('appointments').select('*').eq('user_id', user.id).order('created_at', { ascending: false }).limit(5),
        supabase.from('appointments').select('*').eq('user_id', user.id).gte('date', new Date().toISOString().split('T')[0]).order('date', { ascending: true }).limit(5)
      ]);

      setStats(statsData);
      setMonthlyData(monthly);
      setDailyData(daily);
      setRecentAppointments(recent || []);
      setUpcomingAppointments(upcoming || []);
    } catch (error) {
      console.error("Dashboard fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
      return (
          <MainLayout>
              <div className="flex h-[80vh] items-center justify-center">
                  <Loader2 className="w-12 h-12 text-[#C94B6D] animate-spin" />
              </div>
          </MainLayout>
      );
  }

  return (
    <>
      <Helmet>
        <title>Meu Dashboard - Gestorate</title>
        <meta name="description" content="Visualize seu resumo de agendamentos e atividades no Gestorate." />
      </Helmet>
      
      <MainLayout>
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="mb-6">
              <h1 className="text-3xl font-bold text-gray-900">Olá, {user?.name?.split(' ')[0]}!</h1>
              <p className="text-gray-600 mt-1">Aqui está um resumo das suas atividades no Gestorate.</p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard icon={Calendar} label="Total de Agendamentos" value={stats.total} color="bg-blue-500" delay={0.0} />
            <StatCard icon={Clock} label="Pendentes" value={stats.pending} color="bg-yellow-500" delay={0.1} />
            <StatCard icon={CheckCircle2} label="Confirmados" value={stats.confirmed} color="bg-green-500" delay={0.2} />
            <StatCard icon={XCircle} label="Cancelados" value={stats.canceled} color="bg-red-500" delay={0.3} />
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <AppointmentsByMonthChart data={monthlyData} />
            <AppointmentsByDayChart data={dailyData} />
          </div>

          {/* Tables Row */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <RecentAppointmentsTable appointments={recentAppointments} />
            <UpcomingAppointmentsTable appointments={upcomingAppointments} />
          </div>
        </div>
      </MainLayout>
    </>
  );
};

export default UserDashboard;
