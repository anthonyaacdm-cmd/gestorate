
import { format } from 'date-fns';

const downloadCSV = (csvContent, fileName) => {
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement("a");
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", fileName);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
};

const arrayToCSV = (data) => {
  if (!data || !data.length) return '';
  
  const headers = Object.keys(data[0]);
  const csvRows = [headers.join(',')];
  
  for (const row of data) {
    const values = headers.map(header => {
      const escaped = ('' + (row[header] || '')).replace(/"/g, '\\"');
      return `"${escaped}"`;
    });
    csvRows.push(values.join(','));
  }
  
  return csvRows.join('\n');
};

export const generateAppointmentsCSV = (data) => {
  const formattedData = data.map(apt => ({
    id: apt.id,
    data: apt.date,
    hora: apt.time,
    cliente: apt.client_name,
    email: apt.client_email,
    telefone: apt.client_phone,
    servico: apt.service,
    status: apt.status,
    profissional: apt.admin_name
  }));

  const csv = arrayToCSV(formattedData);
  downloadCSV(csv, `agendamentos_${format(new Date(), 'yyyyMMdd')}.csv`);
};

export const generateClientsCSV = (data) => {
    const formattedData = data.map(c => ({
        cliente: c.client_name,
        email: c.client_email,
        total: c.total_appointments,
        confirmados: c.confirmed_appointments,
        ultimo_agendamento: c.last_appointment
    }));
    const csv = arrayToCSV(formattedData);
    downloadCSV(csv, `clientes_${format(new Date(), 'yyyyMMdd')}.csv`);
};

export const generateRevenueCSV = (data) => {
    const csv = arrayToCSV(data);
    downloadCSV(csv, `resumo_${format(new Date(), 'yyyyMMdd')}.csv`);
};
