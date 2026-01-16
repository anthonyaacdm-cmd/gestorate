
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Clock, Phone, AlertCircle, Plus, CalendarX, CheckCircle2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const DayDetailsModal = ({ 
  isOpen, 
  onClose, 
  date, 
  appointments, 
  onUpdateStatus 
}) => {
  const navigate = useNavigate();

  if (!date) return null;

  const handleCreateNew = () => {
    // Navigate to appointment booking with the date pre-selected (if booking supports it)
    // Assuming /appointments handles basic flow, we can pass state
    navigate('/appointments', { state: { preSelectedDate: date } });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-white">
        <DialogHeader>
          <DialogTitle className="flex flex-col gap-1">
            <span className="text-xl">
              {format(date, "d 'de' MMMM", { locale: ptBR })}
            </span>
            <span className="text-sm font-normal text-gray-500">
              {format(date, "EEEE", { locale: ptBR })}
            </span>
          </DialogTitle>
        </DialogHeader>

        <div className="py-4 space-y-4 max-h-[60vh] overflow-y-auto">
          {appointments.length === 0 ? (
            <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-lg border border-dashed border-gray-200">
              <CalendarX className="mx-auto h-10 w-10 text-gray-300 mb-2" />
              <p>Nenhum agendamento para este dia.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {appointments.map((apt) => (
                <div 
                  key={apt.id} 
                  className={`p-4 rounded-lg border flex justify-between items-start group hover:shadow-md transition-all ${
                    apt.resource.status === 'canceled' 
                      ? 'bg-red-50 border-red-100' 
                      : apt.resource.status === 'confirmed'
                      ? 'bg-green-50 border-green-100'
                      : 'bg-white border-gray-200'
                  }`}
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-gray-900">
                        {apt.resource.time.slice(0, 5)}
                      </span>
                      <span className={`text-xs px-2 py-0.5 rounded-full capitalize ${
                        apt.resource.status === 'confirmed' ? 'bg-green-200 text-green-800' :
                        apt.resource.status === 'canceled' ? 'bg-red-200 text-red-800' :
                        'bg-yellow-200 text-yellow-800'
                      }`}>
                        {apt.resource.status === 'pending' ? 'Pendente' : apt.resource.status}
                      </span>
                    </div>
                    <p className="font-medium text-gray-800">{apt.resource.exam_type}</p>
                    {apt.resource.phone && (
                      <p className="text-sm text-gray-500 flex items-center gap-1">
                        <Phone size={12} /> {apt.resource.phone}
                      </p>
                    )}
                  </div>

                  <div className="flex flex-col gap-2 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                    {apt.resource.status !== 'canceled' && (
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-8 text-red-600 hover:text-red-700 hover:bg-red-50"
                        onClick={() => {
                          if (window.confirm('Tem certeza que deseja cancelar este agendamento?')) {
                            onUpdateStatus(apt.id, 'canceled');
                          }
                        }}
                      >
                        Cancelar
                      </Button>
                    )}
                    {apt.resource.status === 'pending' && (
                       /* Only admin usually confirms, but if user can confirm own logic is weird, maybe re-schedule? 
                          Leaving simple for user view. */
                       null
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <DialogFooter className="flex-col sm:flex-row gap-2">
          <Button variant="outline" onClick={onClose} className="w-full sm:w-auto">
            Fechar
          </Button>
          <Button onClick={handleCreateNew} className="w-full sm:w-auto bg-[#C94B6D] hover:bg-[#b03d5b]">
            <Plus size={16} className="mr-2" /> Novo Agendamento
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DayDetailsModal;
