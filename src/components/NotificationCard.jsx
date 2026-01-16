
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Bell, Calendar, CheckCircle2, XCircle, Trash2, Edit } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

const NotificationCard = ({ notification, onMarkAsRead, onDelete }) => {
  const getIcon = (type) => {
    switch (type) {
      case 'appointment_created':
        return <Calendar className="text-blue-500" size={24} />;
      case 'appointment_confirmed':
        return <CheckCircle2 className="text-green-500" size={24} />;
      case 'appointment_canceled':
        return <XCircle className="text-red-500" size={24} />;
      case 'appointment_edited':
        return <Edit className="text-orange-500" size={24} />;
      default:
        return <Bell className="text-gray-500" size={24} />;
    }
  };

  const getTypeLabel = (type) => {
    switch (type) {
      case 'appointment_created': return 'Agendamento Criado';
      case 'appointment_confirmed': return 'Agendamento Confirmado';
      case 'appointment_canceled': return 'Agendamento Cancelado';
      case 'appointment_edited': return 'Agendamento Atualizado';
      default: return 'Notificação';
    }
  };

  // Use sent_at as primary timestamp, fallback to created_at if needed
  const timestamp = notification.sent_at || notification.created_at || new Date();

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      layout
      className="mb-3"
    >
      <Card className={cn(
        "overflow-hidden transition-all duration-200 hover:shadow-md border-l-4",
        !notification.read 
          ? "bg-blue-50/50 border-l-[#C94B6D]" 
          : "bg-white border-l-gray-300"
      )}>
        <CardContent className="p-4 sm:p-5">
          <div className="flex gap-4 items-start">
            <div className={cn(
              "p-2 rounded-full flex-shrink-0 mt-1",
              !notification.read ? "bg-white shadow-sm" : "bg-gray-100"
            )}>
              {getIcon(notification.type)}
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-start mb-1 gap-2 flex-wrap">
                <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                  {getTypeLabel(notification.type)}
                </span>
                <span className="text-xs text-gray-400 whitespace-nowrap">
                  {format(new Date(timestamp), "dd 'de' MMM, HH:mm", { locale: ptBR })}
                </span>
              </div>
              
              <p className={cn(
                "text-gray-900 mb-3 break-words",
                !notification.read ? "font-semibold" : "font-normal"
              )}>
                {notification.message}
              </p>
              
              <div className="flex justify-end gap-2 pt-2 border-t border-gray-100/50">
                {!notification.read && (
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => onMarkAsRead(notification.id)}
                    className="text-[#C94B6D] hover:text-[#A63D5A] hover:bg-pink-50 h-8 px-2 text-xs"
                  >
                    Marcar como lida
                  </Button>
                )}
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => onDelete(notification.id)}
                  className="text-gray-400 hover:text-red-600 hover:bg-red-50 h-8 px-2 text-xs"
                >
                  <Trash2 size={14} className="mr-1" /> Excluir
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default NotificationCard;
