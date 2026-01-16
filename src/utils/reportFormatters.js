
import { format, parseISO, isValid } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export const formatCurrency = (value) => {
  if (typeof value !== 'number') return 'R$ 0,00';
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
};

export const formatDate = (dateStr) => {
  if (!dateStr) return '-';
  const date = typeof dateStr === 'string' ? parseISO(dateStr) : dateStr;
  if (!isValid(date)) return '-';
  return format(date, 'dd/MM/yyyy', { locale: ptBR });
};

export const formatDateTime = (dateStr, timeStr) => {
  if (!dateStr) return '-';
  const formattedDate = formatDate(dateStr);
  const formattedTime = timeStr ? timeStr.slice(0, 5) : '';
  return `${formattedDate} ${formattedTime}`.trim();
};

export const formatPhone = (phone) => {
  if (!phone) return '-';
  return phone.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3')
              .replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
};

export const getStatusBadgeColor = (status) => {
  switch (status?.toLowerCase()) {
    case 'confirmed':
    case 'confirmado':
      return 'bg-green-100 text-green-800 border-green-200';
    case 'pending':
    case 'pendente':
      return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    case 'canceled':
    case 'cancelado':
      return 'bg-red-100 text-red-800 border-red-200';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};

export const calculateStats = (data, type = 'appointments') => {
  if (!data || !Array.isArray(data)) return null;

  const total = data.length;
  
  if (type === 'appointments') {
    const confirmed = data.filter(i => i.status === 'confirmed').length;
    const pending = data.filter(i => i.status === 'pending').length;
    const canceled = data.filter(i => i.status === 'canceled').length;
    
    // Assuming revenue calculation is needed, maybe based on exam_type if prices were available
    // For now, we just count
    return {
      total,
      confirmed,
      pending,
      canceled,
      completionRate: total > 0 ? ((confirmed / total) * 100).toFixed(1) + '%' : '0%'
    };
  }
  
  return { total };
};
