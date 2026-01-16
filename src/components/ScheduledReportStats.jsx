
import React, { useMemo } from 'react';
import { Activity, Mail, AlertTriangle, CalendarCheck } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

const StatItem = ({ icon: Icon, label, value, color }) => (
  <Card className="border-none shadow-sm bg-white">
    <CardContent className="p-4 flex items-center gap-4">
      <div className={`p-3 rounded-full ${color}`}>
        <Icon size={20} className="text-white" />
      </div>
      <div>
        <p className="text-sm text-gray-500 font-medium">{label}</p>
        <p className="text-2xl font-bold text-gray-900">{value}</p>
      </div>
    </CardContent>
  </Card>
);

const ScheduledReportStats = ({ reports, history }) => {
  const stats = useMemo(() => {
    const totalReports = reports.length;
    const activeReports = reports.filter(r => r.status === 'active').length;
    
    // Simple mock stats logic from props or we could fetch aggregated stats from DB
    // Assuming 'history' prop contains recent executions
    const successfulExecutions = history ? history.filter(h => h.status === 'success').length : 0;
    const failedExecutions = history ? history.filter(h => h.status === 'error').length : 0;

    return { totalReports, activeReports, successfulExecutions, failedExecutions };
  }, [reports, history]);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <StatItem 
        icon={CalendarCheck} 
        label="Relatórios Ativos" 
        value={stats.activeReports} 
        color="bg-blue-500" 
      />
      <StatItem 
        icon={Activity} 
        label="Execuções (Recentes)" 
        value={stats.successfulExecutions} 
        color="bg-green-500" 
      />
      <StatItem 
        icon={AlertTriangle} 
        label="Falhas" 
        value={stats.failedExecutions} 
        color="bg-red-500" 
      />
      <StatItem 
        icon={Mail} 
        label="Emails Enviados" 
        value={stats.successfulExecutions} // Approx
        color="bg-purple-500" 
      />
    </div>
  );
};

export default ScheduledReportStats;
