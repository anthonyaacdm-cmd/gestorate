
import { useState, useCallback } from 'react';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/lib/customSupabaseClient';
import { useToast } from '@/components/ui/use-toast';

export const useAvailabilities = () => {
  const [availabilities, setAvailabilities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { user } = useAuth();
  const { toast } = useToast();

  const getAvailabilities = useCallback(async () => {
    if (!user?.id) return;
    
    setLoading(true);
    setError(null);
    try {
      const { data, error: apiError } = await supabase
        .from('availabilities')
        .select('*')
        .eq('admin_id', user.id)
        .order('day_of_week', { ascending: true })
        .order('start_time', { ascending: true });

      if (apiError) throw apiError;
      setAvailabilities(data || []);
    } catch (err) {
      setError(err.message);
      toast({
        title: "Erro ao carregar disponibilidades",
        description: err.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  }, [user, toast]);

  const createAvailability = async (data) => {
    if (!user?.id) return { success: false, error: 'User not authenticated' };
    
    setLoading(true);
    try {
      const { data: newAvail, error: apiError } = await supabase
        .from('availabilities')
        .insert([{
          ...data,
          admin_id: user.id,
          active: true
        }])
        .select()
        .single();
      
      if (apiError) throw apiError;
      
      setAvailabilities(prev => [...prev, newAvail]);
      return { success: true, data: newAvail };
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

  const updateAvailability = async (id, updates) => {
    setLoading(true);
    try {
      const { data: updatedAvail, error: apiError } = await supabase
        .from('availabilities')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single();

      if (apiError) throw apiError;

      setAvailabilities(prev => prev.map(a => a.id === id ? updatedAvail : a));
      return { success: true, data: updatedAvail };
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

  const toggleAvailability = async (id, currentStatus) => {
    // Optimistic update
    setAvailabilities(prev => prev.map(a => a.id === id ? { ...a, active: !currentStatus } : a));
    
    try {
      const { error: apiError } = await supabase
        .from('availabilities')
        .update({
          active: !currentStatus,
          updated_at: new Date().toISOString()
        })
        .eq('id', id);

      if (apiError) {
        // Revert on error
        setAvailabilities(prev => prev.map(a => a.id === id ? { ...a, active: currentStatus } : a));
        throw apiError;
      }
      return { success: true };
    } catch (err) {
      toast({
        title: "Erro ao alterar status",
        description: err.message,
        variant: "destructive"
      });
      return { success: false, error: err.message };
    }
  };

  const deleteAvailability = async (id) => {
    try {
      const { error: apiError } = await supabase
        .from('availabilities')
        .delete()
        .eq('id', id);

      if (apiError) throw apiError;

      setAvailabilities(prev => prev.filter(a => a.id !== id));
      return { success: true };
    } catch (err) {
      toast({
        title: "Erro ao deletar",
        description: err.message,
        variant: "destructive"
      });
      return { success: false, error: err.message };
    }
  };

  return {
    availabilities,
    loading,
    error,
    getAvailabilities,
    createAvailability,
    updateAvailability,
    deleteAvailability,
    toggleAvailability,
    setAvailabilities
  };
};
