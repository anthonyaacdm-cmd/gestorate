
import React, { useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useScheduledReports } from '@/hooks/useScheduledReports';
import ExecutionHistoryTable from './ExecutionHistoryTable';
import { Loader2, CalendarClock } from 'lucide-react';
import { getFrequencyDescription } from '@/utils/scheduleCalculator';

const ScheduledReportModal = ({ report, isOpen, onClose }) => {
  const { fetchExecutionHistory, history, loading } = useScheduledReports();

  useEffect(() => {
    if (isOpen && report) {
      fetchExecutionHistory(report.id);
    }
  }, [isOpen, report, fetchExecutionHistory]);

  if (!report) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CalendarClock className="h-5 w-5 text-[#C94B6D]" />
            Histórico: {report.name}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 bg-gray-50 p-4 rounded-lg border border-gray-100">
            <div>
              <p className="text-xs font-medium text-gray-500 uppercase">Tipo</p>
              <p className="text-sm font-semibold capitalize">{report.report_type}</p>
            </div>
            <div>
              <p className="text-xs font-medium text-gray-500 uppercase">Frequência</p>
              <p className="text-sm font-semibold capitalize">{report.frequency}</p>
            </div>
            <div className="col-span-2">
              <p className="text-xs font-medium text-gray-500 uppercase">Execução</p>
              <p className="text-sm font-semibold">{getFrequencyDescription(report.frequency, report.execution_time)}</p>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold mb-3 text-gray-900">Histórico de Execuções</h3>
            {loading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
              </div>
            ) : (
              <ExecutionHistoryTable history={history} />
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ScheduledReportModal;
