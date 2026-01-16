
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Clock, Calendar, MoreHorizontal } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const AvailabilityCard = ({ availability, onEdit, onDelete, onToggle }) => {
  const days = [
    'Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado'
  ];

  return (
    <Card className={`mb-4 overflow-hidden hover:shadow-lg transition-all duration-200 border-l-4 ${availability.active ? 'border-l-green-500' : 'border-l-gray-300 bg-gray-50'}`}>
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-2">
          <div className="flex flex-col">
            <span className="text-lg font-semibold text-gray-900 flex items-center gap-2">
               <Calendar size={18} className="text-[#C94B6D]" /> {days[availability.day_of_week]}
            </span>
            <span className="text-sm text-gray-500 flex items-center gap-2 mt-2 ml-1">
               <Clock size={14} /> {availability.start_time.slice(0, 5)} - {availability.end_time.slice(0, 5)}
            </span>
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onToggle(availability)}>
                {availability.active ? 'Desativar' : 'Ativar'}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onEdit(availability)}>
                Editar
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onDelete(availability)} className="text-red-600 focus:text-red-600">
                Excluir
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="flex items-center gap-2 mt-4 pt-3 border-t border-gray-100">
            <span className={`text-xs px-2 py-1 rounded-full font-medium ${availability.active ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-600'}`}>
                {availability.active ? 'Ativo' : 'Inativo'}
            </span>
        </div>
      </CardContent>
    </Card>
  );
};

export default AvailabilityCard;
