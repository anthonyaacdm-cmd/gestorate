import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { useAuth } from '@/context/AuthContext';
import { getUserNotifications, markAsRead, markAllAsRead, deleteNotification } from '@/services/notificationService';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import MainLayout from '@/layouts/MainLayout';
import { Bell, Check, X, Circle, Trash2, CheckCircle2, Filter } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { motion, AnimatePresence } from 'framer-motion';

const NotificationPage = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      loadNotifications();
    }
  }, [user]);

  const loadNotifications = async () => {
    setLoading(true);
    const { data, error } = await getUserNotifications(user.id);
    setLoading(false);
    
    if (error) {
      toast({
        title: 'Erro ao carregar notificações',
        description: error,
        variant: 'destructive',
      });
      return;
    }
    
    setNotifications(data || []);
  };

  const handleMarkAsRead = async (id) => {
    await markAsRead(id);
    setNotifications(prev => 
      prev.map(n => n.id === id ? { ...n, read_at: new Date().toISOString() } : n)
    );
  };

  const handleMarkAllRead = async () => {
    await markAllAsRead(user.id);
    setNotifications(prev => 
      prev.map(n => ({ ...n, read_at: new Date().toISOString() }))
    );
    toast({
      title: 'Sucesso',
      description: 'Todas as notificações marcadas como lidas.',
    });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Tem certeza que deseja excluir esta notificação?')) return;
    
    const { error } = await deleteNotification(id);
    if (error) {
      toast({
        title: 'Erro ao excluir',
        description: error,
        variant: 'destructive',
      });
      return;
    }
    setNotifications(prev => prev.filter(n => n.id !== id));
    toast({
      title: 'Notificação excluída',
    });
  };

  const getIcon = (type) => {
    switch (type) {
      case 'new_appointment': return <Circle className="text-blue-500" />;
      case 'confirmed': return <Check className="text-green-500" />;
      case 'canceled': return <X className="text-red-500" />;
      case 'admin_notification': return <Bell className="text-purple-500" />;
      default: return <Bell className="text-gray-500" />;
    }
  };

  const filteredNotifications = notifications.filter(n => {
    if (filter === 'all') return true;
    if (filter === 'unread') return !n.read_at;
    return n.type === filter;
  });

  return (
    <>
      <Helmet>
        <title>Notificações - Sistema de Agendamentos</title>
        <meta name="description" content="Histórico de notificações." />
      </Helmet>
      
      <MainLayout>
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Notificações</h1>
              <p className="text-gray-600 mt-1">Veja seu histórico de atualizações</p>
            </div>
            <div className="flex gap-2">
               <Button
                variant="outline"
                onClick={handleMarkAllRead}
                className="flex items-center gap-2 border-gray-300 hover:bg-gray-100"
              >
                <CheckCircle2 size={16} />
                Marcar todas como lidas
              </Button>
            </div>
          </div>
          
          <div className="flex flex-wrap items-center gap-2 bg-white p-4 rounded-lg shadow-sm border">
            <Filter size={20} className="text-gray-500 mr-2" />
            <span className="text-sm font-medium text-gray-700 mr-2">Filtrar:</span>
            
            {['all', 'unread', 'new_appointment', 'confirmed', 'canceled'].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={cn(
                  "px-3 py-1.5 rounded-full text-xs font-medium transition-colors border",
                  filter === f
                    ? "bg-[#C94B6D] text-white border-[#C94B6D]"
                    : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50"
                )}
              >
                {f === 'all' && 'Todas'}
                {f === 'unread' && 'Não lidas'}
                {f === 'new_appointment' && 'Agendamentos'}
                {f === 'confirmed' && 'Confirmadas'}
                {f === 'canceled' && 'Canceladas'}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#C94B6D]"></div>
            </div>
          ) : filteredNotifications.length === 0 ? (
            <Card>
              <CardContent className="py-16">
                <div className="text-center">
                  <Bell size={48} className="mx-auto text-gray-300 mb-4" />
                  <p className="text-gray-500 text-lg">
                    {filter === 'all' 
                      ? 'Você não tem notificações.' 
                      : 'Nenhuma notificação encontrada com este filtro.'}
                  </p>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              <AnimatePresence>
                {filteredNotifications.map((notification) => (
                  <motion.div
                    key={notification.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    layout
                  >
                    <Card className={cn(
                      "transition-colors",
                      !notification.read_at ? "bg-white border-l-4 border-l-[#C94B6D]" : "bg-gray-50/50"
                    )}>
                      <CardContent className="p-4 sm:p-6">
                        <div className="flex gap-4">
                          <div className={cn(
                            "p-3 rounded-full h-fit",
                            !notification.read_at ? "bg-pink-50" : "bg-gray-100"
                          )}>
                            {getIcon(notification.type)}
                          </div>
                          
                          <div className="flex-1">
                            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2">
                              <p className={cn(
                                "text-gray-900 text-sm sm:text-base",
                                !notification.read_at ? "font-semibold" : "font-medium"
                              )}>
                                {notification.message}
                              </p>
                              <span className="text-xs text-gray-500 whitespace-nowrap">
                                {format(new Date(notification.created_at), "dd MMM 'às' HH:mm", { locale: ptBR })}
                              </span>
                            </div>
                            
                            <div className="mt-4 flex justify-end items-center gap-3">
                              {!notification.read_at && (
                                <button
                                  onClick={() => handleMarkAsRead(notification.id)}
                                  className="text-sm text-[#C94B6D] hover:underline font-medium flex items-center gap-1"
                                >
                                  <CheckCircle2 size={14} />
                                  Marcar como lida
                                </button>
                              )}
                              <button
                                onClick={() => handleDelete(notification.id)}
                                className="text-gray-400 hover:text-red-500 transition-colors p-1"
                                title="Excluir notificação"
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>
      </MainLayout>
    </>
  );
};

export default NotificationPage;