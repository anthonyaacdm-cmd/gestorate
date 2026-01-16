
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const RecentAppointmentsTable = ({ appointments }) => {
  const getStatusColor = (status) => {
    switch(status) {
        case 'confirmed': return 'bg-green-100 text-green-800';
        case 'pending': return 'bg-yellow-100 text-yellow-800';
        case 'canceled': return 'bg-red-100 text-red-800';
        default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card className="col-span-1 lg:col-span-2 overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg text-gray-800">Agendamentos Recentes</CardTitle>
        <Link to="/appointments" className="text-sm text-[#C94B6D] hover:underline flex items-center">
            Ver todos <ChevronRight size={14} />
        </Link>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
            <table className="w-full text-left">
                <thead className="bg-gray-50 text-xs text-gray-500 uppercase">
                    <tr>
                        <th className="px-6 py-3 font-medium">Data</th>
                        <th className="px-6 py-3 font-medium">Horário</th>
                        <th className="px-6 py-3 font-medium">Exame</th>
                        <th className="px-6 py-3 font-medium">Status</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                    {appointments.length === 0 ? (
                        <tr>
                            <td colSpan="4" className="px-6 py-8 text-center text-gray-500 text-sm">
                                Nenhum agendamento recente.
                            </td>
                        </tr>
                    ) : (
                        appointments.map((app) => (
                            <tr key={app.id} className="hover:bg-gray-50/50 transition-colors">
                                <td className="px-6 py-4 text-sm font-medium text-gray-900">
                                    {format(parseISO(app.date), "dd 'de' MMM", { locale: ptBR })}
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-600">{app.time}</td>
                                <td className="px-6 py-4 text-sm text-gray-600 truncate max-w-[150px]">{app.exam_type}</td>
                                <td className="px-6 py-4">
                                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(app.status)}`}>
                                        {app.status === 'confirmed' ? 'Confirmado' : app.status === 'pending' ? 'Pendente' : 'Cancelado'}
                                    </span>
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
      </CardContent>
    </Card>
  );
};

export default RecentAppointmentsTable;
