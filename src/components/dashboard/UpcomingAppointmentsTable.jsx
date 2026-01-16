
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Link } from 'react-router-dom';
import { ChevronRight, CalendarClock } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const UpcomingAppointmentsTable = ({ appointments }) => {
  return (
    <Card className="col-span-1 h-full">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg text-gray-800">Próximos Agendamentos</CardTitle>
        <Link to="/appointments" className="text-sm text-[#C94B6D] hover:underline flex items-center">
            Ver todos <ChevronRight size={14} />
        </Link>
      </CardHeader>
      <CardContent className="space-y-4">
        {appointments.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-gray-500">
                <CalendarClock size={32} className="mb-2 text-gray-300" />
                <span className="text-sm">Nenhum agendamento futuro.</span>
            </div>
        ) : (
            appointments.map((app) => (
                <div key={app.id} className="flex items-start gap-3 p-3 rounded-lg border border-gray-100 hover:border-pink-100 hover:bg-pink-50/30 transition-all">
                    <div className="bg-[#C94B6D]/10 text-[#C94B6D] rounded-lg p-2 min-w-[50px] text-center">
                        <span className="block text-xs font-bold uppercase">{format(parseISO(app.date), 'MMM', { locale: ptBR })}</span>
                        <span className="block text-lg font-bold">{format(parseISO(app.date), 'dd')}</span>
                    </div>
                    <div>
                        <h4 className="font-medium text-gray-900 text-sm line-clamp-1">{app.exam_type}</h4>
                        <div className="text-xs text-gray-500 flex items-center gap-2 mt-1">
                            <span>{app.time}</span>
                            <span className="w-1 h-1 rounded-full bg-gray-300"></span>
                            <span className={
                                app.status === 'confirmed' ? 'text-green-600' : 
                                app.status === 'pending' ? 'text-yellow-600' : 'text-red-600'
                            }>
                                {app.status === 'confirmed' ? 'Confirmado' : app.status === 'pending' ? 'Pendente' : 'Cancelado'}
                            </span>
                        </div>
                    </div>
                </div>
            ))
        )}
      </CardContent>
    </Card>
  );
};

export default UpcomingAppointmentsTable;
