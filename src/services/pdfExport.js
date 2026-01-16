
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const createPDFHeader = (doc, title, filters) => {
  const pageWidth = doc.internal.pageSize.width;
  
  // Header Background
  doc.setFillColor(201, 75, 109); // #C94B6D
  doc.rect(0, 0, pageWidth, 40, 'F');
  
  // Title
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(22);
  doc.text(title, 20, 20);
  
  // Subtitle/Date
  doc.setFontSize(10);
  doc.text(`Gerado em: ${format(new Date(), "dd 'de' MMMM 'de' yyyy 'às' HH:mm", { locale: ptBR })}`, 20, 30);
  
  // Filter Summary
  doc.setTextColor(100, 100, 100);
  doc.setFontSize(10);
  let filterText = 'Filtros: ';
  if (filters.start_date && filters.end_date) {
    filterText += `${format(filters.start_date, 'dd/MM/yyyy')} a ${format(filters.end_date, 'dd/MM/yyyy')}`;
  } else {
    filterText += 'Todo o período';
  }
  if (filters.status && filters.status !== 'all') {
    filterText += ` | Status: ${filters.status}`;
  }
  
  doc.text(filterText, 20, 50);
};

const addPageNumbers = (doc) => {
  const pageCount = doc.internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    doc.text(
      `Página ${i} de ${pageCount}`,
      doc.internal.pageSize.width - 20,
      doc.internal.pageSize.height - 10,
      { align: 'right' }
    );
  }
};

export const generateAppointmentsPDF = (data, filters) => {
  const doc = new jsPDF();
  
  createPDFHeader(doc, 'Relatório de Agendamentos', filters);
  
  const tableColumn = ["Data", "Hora", "Cliente", "Serviço", "Profissional", "Status", "Telefone"];
  const tableRows = [];

  data.forEach(ticket => {
    const ticketData = [
      format(new Date(ticket.date), 'dd/MM/yyyy'),
      ticket.time.slice(0, 5),
      ticket.client_name,
      ticket.service,
      ticket.admin_name,
      ticket.status === 'confirmed' ? 'Confirmado' : ticket.status === 'pending' ? 'Pendente' : 'Cancelado',
      ticket.client_phone || '-'
    ];
    tableRows.push(ticketData);
  });

  doc.autoTable({
    head: [tableColumn],
    body: tableRows,
    startY: 60,
    theme: 'grid',
    headStyles: { fillColor: [201, 75, 109] }, // #C94B6D
    styles: { fontSize: 8, cellPadding: 3 },
  });
  
  addPageNumbers(doc);
  doc.save(`agendamentos_${format(new Date(), 'yyyyMMdd_HHmm')}.pdf`);
};

export const generateClientsPDF = (data, filters) => {
  const doc = new jsPDF();
  createPDFHeader(doc, 'Relatório de Clientes', filters);
  
  const tableColumn = ["Cliente", "Email", "Telefone", "Total Agend.", "Confirmados", "Última Visita"];
  const tableRows = [];

  data.forEach(client => {
    tableRows.push([
      client.client_name,
      client.client_email || '-',
      client.client_phone || '-',
      client.total_appointments,
      client.confirmed_appointments,
      format(new Date(client.last_appointment), 'dd/MM/yyyy')
    ]);
  });

  doc.autoTable({
    head: [tableColumn],
    body: tableRows,
    startY: 60,
    theme: 'striped',
    headStyles: { fillColor: [75, 85, 99] }, // Gray
    styles: { fontSize: 9 }
  });

  addPageNumbers(doc);
  doc.save(`clientes_${format(new Date(), 'yyyyMMdd')}.pdf`);
};

export const generateRevenuePDF = (data, filters) => {
    const doc = new jsPDF();
    createPDFHeader(doc, 'Resumo de Volume', filters);

    const tableColumn = ["Profissional", "Total Agendamentos", "Confirmados", "Cancelados"];
    const tableRows = [];

    data.forEach(item => {
        tableRows.push([
            item.admin_name,
            item.total,
            item.confirmed,
            item.canceled
        ]);
    });

    doc.autoTable({
        head: [tableColumn],
        body: tableRows,
        startY: 60,
        theme: 'grid',
        headStyles: { fillColor: [65, 105, 225] },
    });

    addPageNumbers(doc);
    doc.save(`resumo_volume_${format(new Date(), 'yyyyMMdd')}.pdf`);
};
