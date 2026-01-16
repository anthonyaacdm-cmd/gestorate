
import * as XLSX from 'xlsx';
import { format } from 'date-fns';

const createWorkbook = (data, sheetName, filters) => {
  const wb = XLSX.utils.book_new();
  
  // 1. Data Sheet
  const ws = XLSX.utils.json_to_sheet(data);
  
  // Auto-width columns
  const colWidths = Object.keys(data[0] || {}).map(key => ({ wch: Math.max(key.length, 15) }));
  ws['!cols'] = colWidths;
  
  XLSX.utils.book_append_sheet(wb, ws, sheetName);

  // 2. Info Sheet
  const infoData = [
    { Property: "Report Type", Value: sheetName },
    { Property: "Generated At", Value: format(new Date(), 'dd/MM/yyyy HH:mm') },
    { Property: "Start Date", Value: filters.start_date ? format(filters.start_date, 'yyyy-MM-dd') : 'All' },
    { Property: "End Date", Value: filters.end_date ? format(filters.end_date, 'yyyy-MM-dd') : 'All' },
    { Property: "Status Filter", Value: filters.status || 'All' }
  ];
  const wsInfo = XLSX.utils.json_to_sheet(infoData);
  XLSX.utils.book_append_sheet(wb, wsInfo, "Report Info");

  return wb;
};

export const generateAppointmentsExcel = (data, filters) => {
  // Format data for Excel
  const formattedData = data.map(apt => ({
    ID: apt.id,
    Data: apt.date,
    Hora: apt.time,
    Cliente: apt.client_name,
    Email: apt.client_email,
    Telefone: apt.client_phone,
    Servico: apt.service,
    Profissional: apt.admin_name,
    Status: apt.status
  }));

  const wb = createWorkbook(formattedData, "Agendamentos", filters);
  XLSX.writeFile(wb, `agendamentos_${format(new Date(), 'yyyyMMdd')}.xlsx`);
};

export const generateClientsExcel = (data, filters) => {
  const formattedData = data.map(c => ({
    Cliente: c.client_name,
    Email: c.client_email,
    Telefone: c.client_phone,
    'Total Agendamentos': c.total_appointments,
    'Confirmados': c.confirmed_appointments,
    'Cancelados': c.canceled_appointments,
    'Última Visita': c.last_appointment,
    'Serviços Utilizados': c.services
  }));

  const wb = createWorkbook(formattedData, "Clientes", filters);
  XLSX.writeFile(wb, `clientes_${format(new Date(), 'yyyyMMdd')}.xlsx`);
};

export const generateRevenueExcel = (data, filters) => {
    const formattedData = data.map(item => ({
        Profissional: item.admin_name,
        Total: item.total,
        Confirmados: item.confirmed,
        Cancelados: item.canceled
    }));

    const wb = createWorkbook(formattedData, "Resumo", filters);
    XLSX.writeFile(wb, `resumo_${format(new Date(), 'yyyyMMdd')}.xlsx`);
};
