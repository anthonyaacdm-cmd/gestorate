
import { supabase } from '@/lib/customSupabaseClient';

export const saveNotification = async (userId, message, type, appointmentId = null) => {
  try {
    const { data, error } = await supabase
      .from('notifications')
      .insert([
        {
          user_id: userId,
          message,
          type,
          appointment_id: appointmentId,
          read: false,
          sent_at: new Date().toISOString(), // Explicitly set sent_at
        },
      ])
      .select()
      .single();

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error saving notification:', error);
    return { data: null, error: error.message };
  }
};

export const createNotificationForAppointment = async (userId, type, appointmentId, extraInfo = '') => {
  let message = '';
  switch (type) {
    case 'appointment_created':
      message = `Novo agendamento criado com sucesso. ${extraInfo}`;
      break;
    case 'appointment_confirmed':
      message = `Seu agendamento foi confirmado! ${extraInfo}`;
      break;
    case 'appointment_canceled':
      message = `Agendamento cancelado. ${extraInfo}`;
      break;
    case 'appointment_edited':
      message = `Detalhes do agendamento foram atualizados. ${extraInfo}`;
      break;
    default:
      message = 'Nova atualização no seu agendamento.';
  }

  return await saveNotification(userId, message, type, appointmentId);
};

export const getUserNotifications = async (userId) => {
  try {
    const { data, error } = await supabase
      .from('notifications')
      .select('*')
      .eq('user_id', userId)
      .order('sent_at', { ascending: false }); // Changed from created_at to sent_at

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error fetching notifications:', error);
    return { data: [], error: error.message };
  }
};

export const getUnreadCount = async (userId) => {
  try {
    const { count, error } = await supabase
      .from('notifications')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId)
      .eq('read', false);

    if (error) throw error;
    return { count, error: null };
  } catch (error) {
    console.error('Error fetching unread count:', error);
    return { count: 0, error: error.message };
  }
};

export const markAsRead = async (notificationId) => {
  try {
    const { data, error } = await supabase
      .from('notifications')
      .update({ read: true }) // Removed updated_at as it might not exist
      .eq('id', notificationId)
      .select()
      .single();

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error marking notification as read:', error);
    return { data: null, error: error.message };
  }
};

export const markAllAsRead = async (userId) => {
  try {
    const { data, error } = await supabase
      .from('notifications')
      .update({ read: true }) // Removed updated_at as it might not exist
      .eq('user_id', userId)
      .eq('read', false)
      .select();

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error marking all notifications as read:', error);
    return { data: null, error: error.message };
  }
};

export const deleteNotification = async (notificationId) => {
  try {
    const { error } = await supabase
      .from('notifications')
      .delete()
      .eq('id', notificationId);

    if (error) throw error;
    return { error: null };
  } catch (error) {
    console.error('Error deleting notification:', error);
    return { error: error.message };
  }
};
