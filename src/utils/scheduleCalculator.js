
import { addDays, addWeeks, addMonths, setHours, setMinutes, setSeconds, isBefore, format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export const calculateNextExecution = (frequency, executionTimeStr) => {
  if (!executionTimeStr) return null;
  
  const [hours, minutes] = executionTimeStr.split(':').map(Number);
  const now = new Date();
  
  // Create candidate date for today with correct time
  let nextDate = setSeconds(setMinutes(setHours(new Date(), hours), minutes), 0);
  
  // If today's time has passed, start calculation from tomorrow/next slot
  if (isBefore(nextDate, now)) {
    if (frequency === 'daily') {
      nextDate = addDays(nextDate, 1);
    } else if (frequency === 'weekly') {
      nextDate = addWeeks(nextDate, 1);
    } else if (frequency === 'monthly') {
      nextDate = addMonths(nextDate, 1);
    }
  } else {
    // If time hasn't passed today, but frequency is weekly/monthly, 
    // we need to check if today is the correct day of week/month?
    // For simplicity, we assume "Weekly" means "Every 7 days from creation" 
    // or specifically "Same day of week as today".
    // If creating new: Next execution is today (if time not passed) or next cycle.
    
    // Simplification: Always push to next cycle if not daily? 
    // Let's stick to: if time passed today -> next. If not -> today is candidate.
  }
  
  return nextDate;
};

export const getNextExecutionDisplay = (date) => {
  if (!date) return 'N/A';
  return format(date, "dd/MM/yyyy 'às' HH:mm", { locale: ptBR });
};

export const formatFrequency = (frequency) => {
  const map = {
    daily: 'Diariamente',
    weekly: 'Semanalmente',
    monthly: 'Mensalmente'
  };
  return map[frequency] || frequency;
};

export const getFrequencyDescription = (frequency, executionTime) => {
  if (!frequency || !executionTime) return '-';
  const time = executionTime.slice(0, 5);
  switch (frequency) {
    case 'daily': return `Todos os dias às ${time}`;
    case 'weekly': return `Toda semana às ${time}`;
    case 'monthly': return `Todo mês às ${time}`;
    default: return `${frequency} às ${time}`;
  }
};
