
import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet';
import ReportFilters from '@/components/reports/ReportFilters';
import ReportPreview from '@/components/reports/ReportPreview';
import ExportButtons from '@/components/reports/ExportButtons';
import { useReports } from '@/hooks/useReports';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2, BarChart3, Users, Calendar } from 'lucide-react';

const ReportsPage = () => {
  const { 
    selectedReportType, 
    setSelectedReportType, 
    filters, 
    setFilters, 
    reportData, 
    loading, 
    fetchReport,
    exportPDF,
    exportExcel,
    exportCSV
  } = useReports();

  // Fetch initial data when report type changes
  useEffect(() => {
    fetchReport(selectedReportType, filters);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedReportType]); 

  const handleApplyFilters = () => {
    fetchReport(selectedReportType, filters);
  };

  const handleResetFilters = () => {
    setFilters({
      start_date: new Date(new Date().setDate(new Date().getDate() - 30)),
      end_date: new Date(),
      status: 'all',
      admin_id: 'all'
    });
  };

  return (
    <div className="min-h-screen bg-gray-50/30">
      <Helmet>
        <title>Relatórios - Gestorate</title>
        <meta name="description" content="Visualize e exporte dados do sistema Gestorate." />
      </Helmet>

      <div className="max-w-7xl mx-auto space-y-6">
        <header>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Relatórios</h1>
          <p className="text-gray-500 mt-1">Visualize e exporte dados do sistema Gestorate</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar Filters */}
          <div className="lg:col-span-1 space-y-6">
            <ReportFilters 
              filters={filters}
              setFilters={setFilters}
              onApply={handleApplyFilters}
              onReset={handleResetFilters}
            />
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-6">
            {/* Report Type Tabs */}
            <Tabs 
              value={selectedReportType} 
              onValueChange={setSelectedReportType} 
              className="w-full"
            >
              <TabsList className="grid w-full grid-cols-3 bg-white border border-gray-200 p-1 rounded-lg">
                <TabsTrigger value="appointments" className="flex items-center gap-2">
                  <Calendar size={16} /> Agendamentos
                </TabsTrigger>
                <TabsTrigger value="clients" className="flex items-center gap-2">
                  <Users size={16} /> Clientes
                </TabsTrigger>
                <TabsTrigger value="revenue" className="flex items-center gap-2">
                  <BarChart3 size={16} /> Resumo
                </TabsTrigger>
              </TabsList>
            </Tabs>

            {/* Report Content Area */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 min-h-[400px] flex flex-col">
              <div className="flex justify-between items-center mb-6">
                <div>
                    <h2 className="text-xl font-semibold text-gray-800 capitalize">
                      Relatório de {selectedReportType === 'revenue' ? 'Resumo de Volume' : selectedReportType}
                    </h2>
                    <p className="text-sm text-gray-500">
                      {reportData.length} registros encontrados
                    </p>
                </div>
              </div>

              {loading ? (
                <div className="flex-1 flex items-center justify-center">
                  <Loader2 className="h-10 w-10 animate-spin text-[#C94B6D]" />
                </div>
              ) : (
                <div className="flex-1">
                  <ReportPreview data={reportData} type={selectedReportType} />
                </div>
              )}

              <ExportButtons 
                onExportPDF={exportPDF} 
                onExportExcel={exportExcel} 
                onExportCSV={exportCSV}
                disabled={loading || reportData.length === 0} 
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportsPage;
