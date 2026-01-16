
import { useState, useCallback } from 'react';
import { supabase } from '@/lib/customSupabaseClient';
import { useAuth } from '@/context/AuthContext';
import { triggerScheduledReportWebhook, executeReportImmediately } from '@/services/scheduledReportService';
import { useToast } from '@/components/ui/use-toast';

export const useScheduledReports = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [reports, setReports] = useState([]);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchScheduledReports = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('scheduled_reports')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setReports(data);
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [user]);

  const fetchExecutionHistory = useCallback(async (reportId) => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('scheduled_reports_history')
        .select('*')
        .eq('scheduled_report_id', reportId)
        .order('executed_at', { ascending: false })
        .limit(20);

      if (error) throw error;
      setHistory(data);
    } catch (err) {
      console.error(err);
      toast({ title: "Erro ao carregar histórico", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  const createScheduledReport = async (reportData) => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('scheduled_reports')
        .insert({ ...reportData, user_id: user.id })
        .select()
        .single();

      if (error) throw error;

      // Sync with N8N
      await triggerScheduledReportWebhook(data, 'upsert');

      setReports(prev => [data, ...prev]);
      toast({ title: "Agendamento criado com sucesso!" });
      return { success: true };
    } catch (err) {
      console.error(err);
      toast({ title: "Erro ao criar agendamento", description: err.message, variant: "destructive" });
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  const updateScheduledReport = async (id, updates) => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('scheduled_reports')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      // Sync with N8N
      await triggerScheduledReportWebhook(data, 'upsert');

      setReports(prev => prev.map(r => r.id === id ? data : r));
      toast({ title: "Agendamento atualizado!" });
      return { success: true };
    } catch (err) {
      console.error(err);
      toast({ title: "Erro ao atualizar", variant: "destructive" });
      return { success: false };
    } finally {
      setLoading(false);
    }
  };

  const deleteScheduledReport = async (id) => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from('scheduled_reports')
        .delete()
        .eq('id', id);

      if (error) throw error;

      // Sync with N8N (delete trigger)
      await triggerScheduledReportWebhook({ id }, 'delete');

      setReports(prev => prev.filter(r => r.id !== id));
      toast({ title: "Agendamento removido." });
      return { success: true };
    } catch (err) {
      console.error(err);
      toast({ title: "Erro ao remover", variant: "destructive" });
      return { success: false };
    } finally {
      setLoading(false);
    }
  };

  const executeReport = async (id) => {
    setLoading(true);
    try {
      const result = await executeReportImmediately(id);
      if (!result.success) throw new Error(result.error);
      
      toast({ title: "Execução iniciada", description: "O relatório será enviado em breve." });
      return true;
    } catch (err) {
      toast({ title: "Falha na execução", description: err.message, variant: "destructive" });
      return false;
    } finally {
      setLoading(false);
    }
  };

  const toggleReportStatus = async (report) => {
      const newStatus = report.status === 'active' ? 'inactive' : 'active';
      return updateScheduledReport(report.id, { status: newStatus });
  };

  return {
    reports,
    history,
    loading,
    error,
    fetchScheduledReports,
    fetchExecutionHistory,
    createScheduledReport,
    updateScheduledReport,
    deleteScheduledReport,
    executeReport,
    toggleReportStatus
  };
};
