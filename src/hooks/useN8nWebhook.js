
import { useState, useCallback } from 'react';
import { triggerN8nWebhook } from '@/services/appointmentService';
import { supabase } from '@/lib/customSupabaseClient';
import { useToast } from '@/components/ui/use-toast';

/**
 * Custom hook to manage N8N webhook state and retries.
 */
export const useN8nWebhook = () => {
  const [webhookSent, setWebhookSent] = useState(false);
  const [webhookError, setWebhookError] = useState(null);
  const [isRetrying, setIsRetrying] = useState(false);
  const { toast } = useToast();

  const clearError = useCallback(() => {
    setWebhookError(null);
  }, []);

  const retryWebhook = useCallback(async (appointmentId) => {
    if (!appointmentId) return;

    setIsRetrying(true);
    setWebhookError(null);
    setWebhookSent(false);

    try {
      // 1. Fetch complete appointment data again to ensure freshness
      const { data: appointment, error: fetchError } = await supabase
        .from('appointments')
        .select(`
          *,
          users (id, name, email, phone),
          admin_user:admin_id (id, name, email, phone)
        `)
        .eq('id', appointmentId)
        .single();

      if (fetchError) throw new Error('Failed to fetch appointment data for retry');

      // 2. Trigger webhook
      const result = await triggerN8nWebhook(appointment);

      if (result.success) {
        setWebhookSent(true);
        toast({
          title: "Webhook enviado",
          description: "Notificação reenviada com sucesso para o sistema.",
          className: "bg-green-50 text-green-900 border-green-200"
        });
      } else {
        setWebhookError(result.error || 'Erro desconhecido no envio do webhook');
        toast({
          title: "Falha no reenvio",
          description: "Não foi possível conectar ao serviço de notificações.",
          variant: "destructive"
        });
      }
    } catch (err) {
      console.error(err);
      setWebhookError(err.message);
      toast({
        title: "Erro",
        description: err.message,
        variant: "destructive"
      });
    } finally {
      setIsRetrying(false);
    }
  }, [toast]);

  return {
    webhookSent,
    webhookError,
    isRetrying,
    retryWebhook,
    clearError
  };
};
