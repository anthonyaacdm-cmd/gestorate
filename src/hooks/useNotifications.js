
import { useState, useCallback, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/lib/customSupabaseClient';
import { 
  getUserNotifications, 
  markAsRead as markAsReadSvc, 
  markAllAsRead as markAllAsReadSvc, 
  deleteNotification as deleteNotificationSvc,
  getUnreadCount as getUnreadCountSvc 
} from '@/services/notificationService';
import { useToast } from '@/components/ui/use-toast';

export const useNotifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchNotifications = useCallback(async () => {
    if (!user?.id) return;
    
    setLoading(true);
    setError(null);
    try {
      // Service now sorts by sent_at
      const { data, error: apiError } = await getUserNotifications(user.id);
      if (apiError) throw new Error(apiError);
      setNotifications(data || []);
      
      const unread = data ? data.filter(n => !n.read).length : 0;
      setUnreadCount(unread);
    } catch (err) {
      setError(err.message);
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [user]);

  const updateUnreadCount = useCallback(async () => {
    if (!user?.id) return;
    const { count } = await getUnreadCountSvc(user.id);
    setUnreadCount(count || 0);
  }, [user]);

  // Real-time subscription
  useEffect(() => {
    if (!user?.id) return;

    const channel = supabase
      .channel('public:notifications')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${user.id}`,
        },
        (payload) => {
          // Refresh list on any change to stay consistent
          fetchNotifications();
          
          if (payload.eventType === 'INSERT') {
            toast({
              title: "Nova notificação",
              description: payload.new.message,
            });
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, fetchNotifications, toast]);

  const markAsRead = async (id) => {
    // Optimistic update
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
    setUnreadCount(prev => Math.max(0, prev - 1));

    try {
      const { error: apiError } = await markAsReadSvc(id);
      if (apiError) throw apiError;
    } catch (err) {
      // Revert if failed
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: false } : n));
      setUnreadCount(prev => prev + 1);
      toast({
        title: "Erro ao atualizar",
        description: "Não foi possível marcar como lida.",
        variant: "destructive"
      });
    }
  };

  const markAllAsRead = async () => {
    // Optimistic update
    const previousNotifications = [...notifications];
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    setUnreadCount(0);

    try {
      const { error: apiError } = await markAllAsReadSvc(user.id);
      if (apiError) throw apiError;
      toast({
        title: "Sucesso",
        description: "Todas as notificações foram marcadas como lidas.",
      });
    } catch (err) {
      // Revert
      setNotifications(previousNotifications);
      const unread = previousNotifications.filter(n => !n.read).length;
      setUnreadCount(unread);
      toast({
        title: "Erro ao atualizar",
        description: "Não foi possível marcar todas como lidas.",
        variant: "destructive"
      });
    }
  };

  const deleteNotification = async (id) => {
    // Optimistic update
    const previousNotifications = [...notifications];
    const wasUnread = notifications.find(n => n.id === id)?.read === false;
    
    setNotifications(prev => prev.filter(n => n.id !== id));
    if (wasUnread) setUnreadCount(prev => Math.max(0, prev - 1));

    try {
      const { error: apiError } = await deleteNotificationSvc(id);
      if (apiError) throw apiError;
      toast({
        title: "Notificação removida",
        description: "Notificação excluída com sucesso."
      });
    } catch (err) {
      setNotifications(previousNotifications);
      if (wasUnread) setUnreadCount(prev => prev + 1);
      toast({
        title: "Erro ao deletar",
        description: err.message,
        variant: "destructive"
      });
    }
  };

  return {
    notifications,
    unreadCount,
    loading,
    error,
    fetchNotifications,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    updateUnreadCount
  };
};
