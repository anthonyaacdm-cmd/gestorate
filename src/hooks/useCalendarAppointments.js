
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/customSupabaseClient';
import { useAuth } from '@/context/AuthContext';
import { format, parseISO, isSameDay } from 'date-fns';
import { useToast } from '@/components/ui/use-toast';

export function useCalendarAppointments() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    status: 'all' // all, pending, confirmed, canceled
  });

  const fetchAppointments = useCallback(async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      setError(null);
      
      const { data, error: fetchError } = await supabase
        .from('appointments')
        .select('*')
        .eq('user_id', user.id);

      if (fetchError) throw fetchError;

      const formattedAppointments = data.map(app => {
        // Construct date objects safely
        // Assuming app.date is "YYYY-MM-DD" and app.time is "HH:mm:ss"
        const start = new Date(`${app.date}T${app.time}`);
        // Default duration 1 hour if not specified, just for calendar blocking
        const end = new Date(start.getTime() + 60 * 60 * 1000); 

        return {
          id: app.id,
          title: `${app.exam_type || 'Consulta'} - ${format(start, 'HH:mm')}`,
          start,
          end,
          resource: {
            ...app,
            status: app.status || 'pending',
            date: app.date,
            time: app.time
          }
        };
      });

      setAppointments(formattedAppointments);
    } catch (err) {
      console.error('Error fetching calendar appointments:', err);
      setError(err.message);
      toast({
        title: "Erro ao carregar calendário",
        description: err.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  }, [user, toast]);

  // Real-time subscription
  useEffect(() => {
    if (!user) return;

    fetchAppointments();

    const subscription = supabase
      .channel('public:appointments')
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'appointments',
        filter: `user_id=eq.${user.id}`
      }, (payload) => {
        console.log('Real-time calendar update:', payload);
        fetchAppointments();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, [user, fetchAppointments]);

  const updateAppointmentStatus = async (id, newStatus) => {
    try {
      const { error } = await supabase
        .from('appointments')
        .update({ status: newStatus })
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Status atualizado",
        description: `Agendamento marcado como ${newStatus}.`,
        className: "bg-green-50 border-green-200 text-green-900"
      });
      
      // Optimistic update or wait for subscription
      fetchAppointments();
    } catch (err) {
      toast({
        title: "Erro ao atualizar",
        description: err.message,
        variant: "destructive"
      });
    }
  };

  const getAppointmentsByDate = (date) => {
    return appointments.filter(apt => isSameDay(apt.start, date));
  };

  const filteredAppointments = appointments.filter(apt => {
    if (filters.status === 'all') return true;
    return apt.resource.status === filters.status;
  });

  return {
    appointments,
    filteredAppointments,
    loading,
    error,
    filters,
    setFilters,
    updateAppointmentStatus,
    getAppointmentsByDate,
    refresh: fetchAppointments
  };
}
