
import React from 'react';
import { useNotifications } from '@/hooks/useNotifications';
import { cn } from '@/lib/utils';

const NotificationBadge = ({ className }) => {
  const { unreadCount } = useNotifications();

  if (unreadCount === 0) return null;

  return (
    <span className={cn(
      "absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-600 text-[10px] font-bold text-white shadow-sm ring-2 ring-white",
      className
    )}>
      {unreadCount > 9 ? '9+' : unreadCount}
    </span>
  );
};

export default NotificationBadge;
