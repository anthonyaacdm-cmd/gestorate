
import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, ExternalLink, Inbox } from 'lucide-react';
import { useNotifications } from '@/hooks/useNotifications';
import NotificationBadge from '@/components/NotificationBadge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { motion, AnimatePresence } from 'framer-motion';

const NotificationCenter = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const { 
    notifications, 
    unreadCount, 
    markAllAsRead, 
    fetchNotifications 
  } = useNotifications();

  // Fetch on mount
  useEffect(() => {
    fetchNotifications();
    
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [fetchNotifications]);

  const handleViewAll = () => {
    setIsOpen(false);
    navigate('/notifications');
  };

  const recentNotifications = notifications.slice(0, 5);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-full text-gray-600 hover:bg-pink-50 hover:text-[#C94B6D] transition-colors focus:outline-none"
        aria-label="Notificações"
      >
        <Bell size={20} />
        <NotificationBadge />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-xl shadow-xl ring-1 ring-black ring-opacity-5 z-50 overflow-hidden"
          >
            <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <h3 className="font-semibold text-gray-900">Notificações</h3>
              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  className="text-xs font-medium text-[#C94B6D] hover:text-[#A63D5A] hover:underline"
                >
                  Marcar todas como lidas
                </button>
              )}
            </div>

            <div className="max-h-[350px] overflow-y-auto custom-scrollbar">
              {recentNotifications.length === 0 ? (
                <div className="py-12 px-4 text-center text-gray-500 flex flex-col items-center">
                  <div className="bg-gray-100 p-3 rounded-full mb-3">
                    <Inbox size={24} className="text-gray-400" />
                  </div>
                  <p className="text-sm">Nenhuma notificação recente</p>
                </div>
              ) : (
                <ul className="divide-y divide-gray-50">
                  {recentNotifications.map((notification) => (
                    <li
                      key={notification.id}
                      onClick={handleViewAll}
                      className={cn(
                        "p-4 hover:bg-gray-50 transition-colors cursor-pointer relative",
                        !notification.read && "bg-blue-50/30"
                      )}
                    >
                       {!notification.read && (
                         <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#C94B6D]" />
                       )}
                      <div className="flex flex-col gap-1">
                        <p className={cn("text-sm text-gray-800 line-clamp-2", !notification.read && "font-medium")}>
                          {notification.message}
                        </p>
                        <p className="text-xs text-gray-400">
                          {formatDistanceToNow(new Date(notification.sent_at || notification.created_at || new Date()), { addSuffix: true, locale: ptBR })}
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className="p-3 border-t border-gray-100 bg-gray-50/50 text-center">
              <Button
                variant="ghost"
                onClick={handleViewAll}
                className="w-full text-[#C94B6D] hover:text-[#A63D5A] hover:bg-pink-50 text-sm font-medium h-9"
              >
                Ver todas as notificações <ExternalLink size={14} className="ml-2" />
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default NotificationCenter;
