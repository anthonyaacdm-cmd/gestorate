
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
import { Calendar, Clock, Phone, FileText, X } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const AppointmentModal = ({ isOpen, onClose, appointment, onEdit, onCancel }) => {
  if (!appointment) return null;

  const statusColors = {
    pending: 'bg-yellow-100 text-yellow-800',
    confirmed: 'bg-green-100 text-green-800',
    canceled: 'bg-red-100 text-red-800'
  };

  const statusLabels = {
    pending: 'Pendente',
    confirmed: 'Confirmado',
    canceled: 'Cancelado'
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex justify-between items-center">
             <span>Detalhes do Agendamento</span>
             <span className={`text-xs px-2 py-1 rounded-full ${statusColors[appointment.status]}`}>
                {statusLabels[appointment.status]}
             </span>
          </DialogTitle>
          <DialogDescription>
            Informações completas sobre sua consulta.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
            <div className="flex items-start gap-4">
                <Calendar className="w-5 h-5 text-gray-500 mt-1" />
                <div>
                    <p className="text-sm font-medium text-gray-500">Data</p>
                    <p className="text-gray-900">
                        {format(new Date(appointment.date), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
                    </p>
                </div>
            </div>

            <div className="flex items-start gap-4">
                <Clock className="w-5 h-5 text-gray-500 mt-1" />
                <div>
                    <p className="text-sm font-medium text-gray-500">Horário</p>
                    <p className="text-gray-900">{appointment.time}</p>
                </div>
            </div>

            <div className="flex items-start gap-4">
                <FileText className="w-5 h-5 text-gray-500 mt-1" />
                <div>
                    <p className="text-sm font-medium text-gray-500">Descrição</p>
                    <p className="text-gray-900">{appointment.exam_type}</p>
                </div>
            </div>

            <div className="flex items-start gap-4">
                <Phone className="w-5 h-5 text-gray-500 mt-1" />
                <div>
                    <p className="text-sm font-medium text-gray-500">Telefone de Contato</p>
                    <p className="text-gray-900">{appointment.phone}</p>
                </div>
            </div>
        </div>

        <DialogFooter className="flex-col sm:flex-row gap-2">
            {appointment.status !== 'canceled' && (
                <>
                    <Button variant="outline" onClick={() => onEdit(appointment)} className="w-full sm:w-auto">
                        Editar
                    </Button>
                    <Button variant="destructive" onClick={() => onCancel(appointment)} className="w-full sm:w-auto bg-red-50 text-red-600 hover:bg-red-100 border-none">
                        Cancelar Agendamento
                    </Button>
                </>
            )}
            <Button variant="ghost" onClick={onClose} className="w-full sm:w-auto">
                Fechar
            </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AppointmentModal;
