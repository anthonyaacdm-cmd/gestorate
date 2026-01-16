
import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { useScheduledReports } from '@/hooks/useScheduledReports';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { 
    Play, 
    Trash2, 
    Edit, 
    History, 
    Plus, 
    MoreHorizontal, 
    Power,
    PowerOff
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import ScheduledReportFormModal from '@/components/scheduled-reports/ScheduledReportFormModal';
import ScheduledReportModal from '@/components/scheduled-reports/ScheduledReportModal';
import ScheduledReportStats from '@/components/ScheduledReportStats';
import { getFrequencyDescription } from '@/utils/scheduleCalculator';

const ScheduledReportsPage = () => {
  const { 
    reports, 
    fetchScheduledReports, 
    createScheduledReport,
    updateScheduledReport, 
    deleteScheduledReport,
    executeReport,
    toggleReportStatus,
    history // Used for stats
  } = useScheduledReports();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingReport, setEditingReport] = useState(null);
  const [historyReport, setHistoryReport] = useState(null);
  const [executingId, setExecutingId] = useState(null);

  useEffect(() => {
    fetchScheduledReports();
  }, [fetchScheduledReports]);

  const handleCreate = async (data) => {
    await createScheduledReport(data);
  };

  const handleUpdate = async (data) => {
    if (editingReport) {
      await updateScheduledReport(editingReport.id, data);
      setEditingReport(null);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Tem certeza que deseja remover este agendamento do Gestorate?")) {
      await deleteScheduledReport(id);
    }
  };

  const handleExecute = async (id) => {
    setExecutingId(id);
    await executeReport(id);
    setExecutingId(null);
  };

  return (
    <div className="min-h-screen bg-gray-50/30">
      <Helmet>
        <title>Relatórios Agendados - Gestorate</title>
        <meta name="description" content="Automatize o envio de relatórios por e-mail com o Gestorate." />
      </Helmet>

      <div className="max-w-7xl mx-auto space-y-6">
        <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Relatórios Agendados</h1>
            <p className="text-gray-500 mt-1">Automatize o envio de relatórios por e-mail</p>
          </div>
          <Button onClick={() => setIsFormOpen(true)} className="bg-[#C94B6D] hover:bg-[#b03d5b]">
            <Plus size={18} className="mr-2" /> Novo Agendamento
          </Button>
        </header>

        <ScheduledReportStats reports={reports} history={history} />

        <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Frequência</TableHead>
                <TableHead>Destinatários</TableHead>
                <TableHead>Formato</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {reports.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                    Nenhum relatório agendado encontrado no Gestorate. Crie o primeiro!
                  </TableCell>
                </TableRow>
              ) : (
                reports.map((report) => (
                  <TableRow key={report.id}>
                    <TableCell className="font-medium">{report.name}</TableCell>
                    <TableCell className="capitalize">{report.report_type}</TableCell>
                    <TableCell>{getFrequencyDescription(report.frequency, report.execution_time)}</TableCell>
                    <TableCell>
                      <Badge variant="secondary">{report.recipients?.length || 0}</Badge>
                    </TableCell>
                    <TableCell className="uppercase text-xs font-bold text-gray-500">
                      {report.format}
                    </TableCell>
                    <TableCell>
                      <Badge className={report.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}>
                        {report.status === 'active' ? 'Ativo' : 'Inativo'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button 
                          size="icon" 
                          variant="ghost" 
                          title="Executar Agora"
                          onClick={() => handleExecute(report.id)}
                          disabled={executingId === report.id}
                        >
                          <Play size={16} className={executingId === report.id ? "animate-pulse text-green-600" : "text-gray-500"} />
                        </Button>
                        
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button size="icon" variant="ghost">
                              <MoreHorizontal size={16} />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Ações</DropdownMenuLabel>
                            <DropdownMenuItem onClick={() => { setEditingReport(report); setIsFormOpen(true); }}>
                              <Edit size={14} className="mr-2" /> Editar
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setHistoryReport(report)}>
                              <History size={14} className="mr-2" /> Histórico
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => toggleReportStatus(report)}>
                              {report.status === 'active' ? <PowerOff size={14} className="mr-2" /> : <Power size={14} className="mr-2" />}
                              {report.status === 'active' ? 'Desativar' : 'Ativar'}
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleDelete(report.id)} className="text-red-600">
                              <Trash2 size={14} className="mr-2" /> Excluir
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      <ScheduledReportFormModal 
        isOpen={isFormOpen}
        onClose={() => { setIsFormOpen(false); setEditingReport(null); }}
        initialData={editingReport}
        onSubmit={editingReport ? handleUpdate : handleCreate}
      />

      <ScheduledReportModal 
        isOpen={!!historyReport}
        onClose={() => setHistoryReport(null)}
        report={historyReport}
      />
    </div>
  );
};

export default ScheduledReportsPage;
