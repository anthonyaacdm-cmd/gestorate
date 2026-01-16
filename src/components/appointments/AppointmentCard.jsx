
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, ChevronRight } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const AppointmentCard = ({ appointment, onClick, onEdit, onCancel }) => {
  const statusColors = {
    pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    confirmed: 'bg-green-100 text-green-800 border-green-200',
    canceled: 'bg-red-100 text-red-800 border-red-200'
  };

  const statusLabels = {
    pending: 'Pendente',
    confirmed: 'Confirmado',
    canceled: 'Cancelado'
  };

  return (
    <Card 
        className="mb-4 overflow-hidden hover:shadow-lg transition-shadow duration-200 cursor-pointer border-l-4 border-l-transparent hover:border-l-[#C94B6D]"
        onClick={() => onClick(appointment)}
    >
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-3">
          <div className="flex flex-col">
            <span className="text-lg font-semibold text-gray-900 flex items-center gap-2">
               {format(new Date(appointment.date), "dd/MM/yyyy")}
            </span>
            <span className="text-sm text-gray-500 flex items-center gap-1 mt-1">
               <Clock size={14} /> {appointment.time}
            </span>
          </div>
          <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${statusColors[appointment.status]}`}>
            {statusLabels[appointment.status]}
          </span>
        </div>
        
        <p className="text-gray-700 text-sm mb-4 line-clamp-2">
            {appointment.exam_type}
        </p>

        <div className="flex justify-end items-center gap-2 mt-2 pt-2 border-t border-gray-100">
             <span className="text-xs text-[#C94B6D] font-medium flex items-center hover:underline">
                Ver detalhes <ChevronRight size={14} />
             </span>
        </div>
      </CardContent>
    </Card>
  );
};

export default AppointmentCard;
