
import { useState, useCallback } from 'react';
import { 
  fetchAppointmentsReport, 
  fetchClientsReport, 
  fetchRevenueReport,
  fetchAvailabilitiesReport
} from '@/services/reportService';
import { generateAppointmentsPDF, generateClientsPDF, generateRevenuePDF } from '@/services/pdfExport';
import { generateAppointmentsExcel, generateClientsExcel, generateRevenueExcel } from '@/services/excelExport';
import { generateAppointmentsCSV, generateClientsCSV, generateRevenueCSV } from '@/services/csvExport';
import { useToast } from '@/components/ui/use-toast';

export const useReports = () => {
  const { toast } = useToast();
  const [selectedReportType, setSelectedReportType] = useState('appointments');
  const [reportData, setReportData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const [filters, setFilters] = useState({
    start_date: new Date(new Date().setDate(new Date().getDate() - 30)), // Last 30 days
    end_date: new Date(),
    status: 'all',
    admin_id: 'all'
  });

  const fetchReport = useCallback(async (type, currentFilters) => {
    setLoading(true);
    setError(null);
    setReportData([]);

    try {
      let data;
      switch (type) {
        case 'appointments':
          data = await fetchAppointmentsReport(currentFilters);
          break;
        case 'clients':
          data = await fetchClientsReport(currentFilters);
          break;
        case 'revenue':
          data = await fetchRevenueReport(currentFilters);
          break;
        case 'availabilities':
            data = await fetchAvailabilitiesReport(currentFilters);
            break;
        default:
          data = [];
      }
      setReportData(data);
    } catch (err) {
      setError(err.message);
      toast({
        title: "Erro ao carregar relatório",
        description: err.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  const exportPDF = () => {
    if (reportData.length === 0) return;
    try {
      if (selectedReportType === 'appointments') generateAppointmentsPDF(reportData, filters);
      else if (selectedReportType === 'clients') generateClientsPDF(reportData, filters);
      else if (selectedReportType === 'revenue') generateRevenuePDF(reportData, filters);
      else toast({ title: "Formato não suportado para este relatório" });
      
      toast({ title: "Exportação PDF iniciada" });
    } catch (err) {
      console.error(err);
      toast({ title: "Erro na exportação PDF", variant: "destructive" });
    }
  };

  const exportExcel = () => {
    if (reportData.length === 0) return;
    try {
      if (selectedReportType === 'appointments') generateAppointmentsExcel(reportData, filters);
      else if (selectedReportType === 'clients') generateClientsExcel(reportData, filters);
      else if (selectedReportType === 'revenue') generateRevenueExcel(reportData, filters);
      else toast({ title: "Formato não suportado para este relatório" });

      toast({ title: "Exportação Excel iniciada" });
    } catch (err) {
      console.error(err);
      toast({ title: "Erro na exportação Excel", variant: "destructive" });
    }
  };

  const exportCSV = () => {
    if (reportData.length === 0) return;
    try {
        if (selectedReportType === 'appointments') generateAppointmentsCSV(reportData);
        else if (selectedReportType === 'clients') generateClientsCSV(reportData);
        else if (selectedReportType === 'revenue') generateRevenueCSV(reportData);
        else toast({ title: "Formato não suportado para este relatório" });
        
        toast({ title: "Download CSV iniciado" });
    } catch (err) {
        console.error(err);
        toast({ title: "Erro na exportação CSV", variant: "destructive" });
    }
  };

  return {
    selectedReportType,
    setSelectedReportType,
    filters,
    setFilters,
    reportData,
    loading,
    error,
    fetchReport,
    exportPDF,
    exportExcel,
    exportCSV
  };
};
