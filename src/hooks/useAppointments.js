
import { useState, useCallback } from 'react';
import { useAuth } from '@/context/AuthContext';
import { 
  getUserAppointments, 
  createAppointment as createSvc, 
  updateAppointment as updateSvc, 
  cancelAppointment as cancelSvc,
  getAvailability as checkSvc 
} from '@/services/appointmentService';
import { useToast } from '@/components/ui/use-toast';

export const useAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { user } = useAuth();
  const { toast } = useToast();

  const getAppointments = useCallback(async () => {
    if (!user?.id) return;
    
    setLoading(true);
    setError(null);
    try {
      const { data, error: apiError } = await getUserAppointments(user.id);
      if (apiError) throw new Error(apiError);
      setAppointments(data || []);
    } catch (err) {
      setError(err.message);
      toast({
        title: "Erro ao carregar agendamentos",
        description: err.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  }, [user, toast]);

  const createAppointment = async (data) => {
    setLoading(true);
    try {
      const { data: newAppt, error: apiError } = await createSvc({
        ...data,
        user_id: user.id
      });
      
      if (apiError) throw new Error(apiError);
      
      // Optimistic update or wait for refresh
      setAppointments(prev => [...prev, newAppt]);
      return { success: true, data: newAppt };
    } catch (err) {
      toast({
        title: "Erro ao criar",
        description: err.message,
        variant: "destructive"
      });
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  const updateAppointment = async (id, updates) => {
    setLoading(true);
    try {
      const { data: updatedAppt, error: apiError } = await updateSvc(id, updates);
      if (apiError) throw new Error(apiError);

      setAppointments(prev => prev.map(a => a.id === id ? updatedAppt : a));
      return { success: true, data: updatedAppt };
    } catch (err) {
      toast({
        title: "Erro ao atualizar",
        description: err.message,
        variant: "destructive"
      });
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  const cancelAppointment = async (id) => {
    try {
      const { data: cancelledAppt, error: apiError } = await cancelSvc(id);
      if (apiError) throw new Error(apiError);

      setAppointments(prev => prev.map(a => a.id === id ? cancelledAppt : a));
      return { success: true };
    } catch (err) {
      toast({
        title: "Erro ao cancelar",
        description: err.message,
        variant: "destructive"
      });
      return { success: false, error: err.message };
    }
  };

  const checkAvailability = async (date) => {
    const { data, error } = await checkSvc(date);
    if (error) {
        console.error(error);
        return null;
    }
    return data;
  };

  return {
    appointments,
    loading,
    error,
    getAppointments,
    createAppointment,
    updateAppointment,
    cancelAppointment,
    checkAvailability,
    setAppointments // Exposed for real-time updates
  };
};
