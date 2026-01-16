
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Clock, Calendar, ToggleLeft, ToggleRight, Trash2, Edit2 } from 'lucide-react';

const AvailabilityModal = ({ isOpen, onClose, availability, onEdit, onDelete, onToggle }) => {
  if (!availability) return null;

  const days = [
    'Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado'
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex justify-between items-center">
             <span>Detalhes da Disponibilidade</span>
             <span className={`text-xs px-2 py-1 rounded-full ${availability.active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                {availability.active ? 'Ativo' : 'Inativo'}
             </span>
          </DialogTitle>
          <DialogDescription>
            Configure seus horários de atendimento.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
            <div className="flex items-start gap-4">
                <Calendar className="w-5 h-5 text-gray-500 mt-1" />
                <div>
                    <p className="text-sm font-medium text-gray-500">Dia da Semana</p>
                    <p className="text-gray-900 font-medium">
                        {days[availability.day_of_week]}
                    </p>
                </div>
            </div>

            <div className="flex items-start gap-4">
                <Clock className="w-5 h-5 text-gray-500 mt-1" />
                <div>
                    <p className="text-sm font-medium text-gray-500">Horário</p>
                    <p className="text-gray-900">
                      {availability.start_time.slice(0, 5)} - {availability.end_time.slice(0, 5)}
                    </p>
                </div>
            </div>
        </div>

        <DialogFooter className="flex-col sm:flex-row gap-2">
            <Button 
                variant="outline" 
                onClick={() => onToggle(availability)} 
                className={`w-full sm:w-auto ${availability.active ? 'text-gray-600' : 'text-green-600 border-green-200 bg-green-50 hover:bg-green-100'}`}
            >
                {availability.active ? <ToggleLeft className="mr-2 h-4 w-4" /> : <ToggleRight className="mr-2 h-4 w-4" />}
                {availability.active ? 'Desativar' : 'Ativar'}
            </Button>
            <Button variant="outline" onClick={() => onEdit(availability)} className="w-full sm:w-auto">
                <Edit2 className="mr-2 h-4 w-4" /> Editar
            </Button>
            <Button variant="destructive" onClick={() => onDelete(availability)} className="w-full sm:w-auto bg-red-50 text-red-600 hover:bg-red-100 border-none">
                <Trash2 className="mr-2 h-4 w-4" /> Excluir
            </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AvailabilityModal;
