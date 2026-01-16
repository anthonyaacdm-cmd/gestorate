
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { useNotifications } from '@/hooks/useNotifications';
import NotificationCard from '@/components/NotificationCard';
import MainLayout from '@/layouts/MainLayout';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Loader2, CheckCircle2, Inbox, RefreshCw, Filter } from 'lucide-react';
import { AnimatePresence } from 'framer-motion';

const NotificationsPage = () => {
  const { 
    notifications, 
    loading, 
    fetchNotifications, 
    markAsRead, 
    markAllAsRead, 
    deleteNotification 
  } = useNotifications();

  const [filter, setFilter] = useState('all');
  const [notificationToDelete, setNotificationToDelete] = useState(null);

  // Initial fetch is handled by hook, but we can force refresh on mount if needed
  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  const filteredNotifications = notifications.filter(n => {
    if (filter === 'all') return true;
    if (filter === 'unread') return !n.read;
    if (filter === 'read') return n.read;
    return true;
  });

  const handleDeleteClick = (id) => {
    setNotificationToDelete(id);
  };

  const confirmDelete = async () => {
    if (notificationToDelete) {
      await deleteNotification(notificationToDelete);
      setNotificationToDelete(null);
    }
  };

  return (
    <>
      <Helmet>
        <title>Notificações - Gestorate</title>
        <meta name="description" content="Fique por dentro das atualizações dos seus agendamentos no Gestorate." />
      </Helmet>
      
      <MainLayout>
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Notificações</h1>
              <p className="text-gray-600 mt-1">Fique por dentro das atualizações dos seus agendamentos</p>
            </div>
            <div className="flex gap-2">
               <Button 
                onClick={markAllAsRead} 
                variant="outline" 
                className="text-[#C94B6D] border-[#C94B6D] hover:bg-pink-50"
                disabled={notifications.every(n => n.read)}
               >
                 <CheckCircle2 className="mr-2 h-4 w-4" />
                 Marcar tudo como lido
               </Button>
            </div>
          </div>

          {/* Filters & Actions */}
          <div className="flex flex-wrap gap-2 mb-6 items-center">
             <div className="bg-white p-1 rounded-lg border border-gray-200 flex gap-1 shadow-sm">
              <button
                onClick={() => setFilter('all')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                  filter === 'all'
                    ? 'bg-gray-900 text-white shadow-sm'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                Todas
              </button>
              <button
                onClick={() => setFilter('unread')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                  filter === 'unread'
                    ? 'bg-gray-900 text-white shadow-sm'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                Não Lidas
              </button>
              <button
                onClick={() => setFilter('read')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                  filter === 'read'
                    ? 'bg-gray-900 text-white shadow-sm'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                Lidas
              </button>
            </div>

            <Button variant="ghost" size="icon" onClick={() => fetchNotifications()} className="ml-auto" title="Atualizar">
                <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            </Button>
          </div>

          {/* Content */}
          {loading && notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20">
               <Loader2 className="h-10 w-10 animate-spin text-[#C94B6D] mb-4" />
               <p className="text-gray-500">Carregando notificações...</p>
            </div>
          ) : filteredNotifications.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-2xl shadow-sm border border-gray-100">
               <div className="bg-gray-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Inbox className="h-8 w-8 text-gray-400" />
               </div>
               <h3 className="text-lg font-medium text-gray-900">Nenhuma notificação encontrada</h3>
               <p className="text-gray-500 max-w-sm mx-auto mt-2">
                 {filter !== 'all' 
                    ? `Você não tem notificações com status "${filter === 'unread' ? 'Não lidas' : 'Lidas'}".` 
                    : "Você não possui notificações no Gestorate no momento."}
               </p>
            </div>
          ) : (
            <div className="space-y-4">
              <AnimatePresence>
                {filteredNotifications.map((notification) => (
                  <NotificationCard
                    key={notification.id}
                    notification={notification}
                    onMarkAsRead={markAsRead}
                    onDelete={handleDeleteClick}
                  />
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>
      </MainLayout>

      {/* Delete Confirmation Dialog */}
      <Dialog open={!!notificationToDelete} onOpenChange={(open) => !open && setNotificationToDelete(null)}>
        <DialogContent>
            <DialogHeader>
                <DialogTitle>Excluir notificação?</DialogTitle>
                <DialogDescription>
                    Tem certeza que deseja deletar esta notificação do Gestorate? Esta ação não pode ser desfeita.
                </DialogDescription>
            </DialogHeader>
            <DialogFooter>
                <Button variant="outline" onClick={() => setNotificationToDelete(null)}>
                    Cancelar
                </Button>
                <Button onClick={confirmDelete} className="bg-red-600 hover:bg-red-700">
                    Sim, Excluir
                </Button>
            </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default NotificationsPage;
