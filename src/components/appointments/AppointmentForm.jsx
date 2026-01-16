
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select'; 
import { useToast } from '@/components/ui/use-toast';
import { Loader2, Calendar as CalendarIcon, Clock, RotateCw } from 'lucide-react';
import { Calendar } from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { format } from 'date-fns';
import { validatePhone, formatPhone } from '@/utils/validation';
import { useN8nWebhook } from '@/hooks/useN8nWebhook';

const AppointmentForm = ({ appointment, onSuccess, onCancel, checkAvailability, onSubmit }) => {
  const isEditing = !!appointment;
  const { user } = useAuth();
  const { toast } = useToast();
  const isAdmin = user?.role === 'admin' || user?.role === 'master';
  
  // Use custom hook for webhook tracking
  const { webhookSent, webhookError, isRetrying, retryWebhook } = useN8nWebhook();
  
  const [date, setDate] = useState(appointment ? new Date(appointment.date) : new Date());
  const [time, setTime] = useState(appointment?.time || '');
  const [examType, setExamType] = useState(appointment?.exam_type || '');
  const [phone, setPhone] = useState(appointment?.phone || user?.phone || '');
  const [status, setStatus] = useState(appointment?.status || 'pending');
  const [submitting, setSubmitting] = useState(false);

  // Mock time slots
  const timeSlots = [
    '08:00', '08:30', '09:00', '09:30', '10:00', '10:30',
    '11:00', '11:30', '14:00', '14:30', '15:00', '15:30',
    '16:00', '16:30', '17:00', '17:30'
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!time || !examType || !phone) {
        toast({ title: "Erro", description: "Preencha todos os campos obrigatórios.", variant: "destructive" });
        return;
    }

    if (!validatePhone(phone)) {
        toast({ title: "Erro", description: "Telefone inválido.", variant: "destructive" });
        return; 
    }

    setSubmitting(true);
    try {
      const data = {
        date: format(date, 'yyyy-MM-dd'),
        time,
        exam_type: examType,
        phone,
        status: isAdmin ? status : (isEditing ? appointment.status : 'pending'),
        // Add service mapped to examType for consistency with webhook payload
        service: examType 
      };
      
      await onSubmit(data);
      
      toast({
        title: isEditing ? "Agendamento atualizado" : "Agendamento realizado",
        description: "Os detalhes foram salvos com sucesso.",
        className: "bg-green-50 border-green-200 text-green-900"
      });

      onSuccess?.();
    } catch (err) {
      console.error(err);
      toast({ title: "Erro", description: "Falha ao salvar agendamento.", variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Webhook Status / Retry Section (Only if editing and there was a previous error, ideally we'd track this better) 
          For now, we expose retry if there's an explicit error in state, but the form usually closes on success.
          So this is mostly for 'edit' mode if we keep the form open, or if parent passes error props.
      */}
      
      <form onSubmit={handleSubmit} className="p-1 space-y-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Data</label>
            <Calendar
              onChange={setDate}
              value={date}
              minDate={new Date()}
              className="w-full border rounded-lg p-2"
              locale="pt-BR"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
              <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Horário</label>
              <div className="relative">
                  <Clock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                  <select
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className="w-full h-10 pl-10 pr-3 rounded-md border border-gray-200 focus:outline-none focus:ring-2 focus:ring-pink-500"
                  required
                  >
                  <option value="">Selecione...</option>
                  {timeSlots.map(t => (
                      <option key={t} value={t}>{t}</option>
                  ))}
                  </select>
              </div>
              </div>

              {isAdmin && (
                  <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                      <select
                          value={status}
                          onChange={(e) => setStatus(e.target.value)}
                          className="w-full h-10 px-3 rounded-md border border-gray-200 focus:outline-none focus:ring-2 focus:ring-pink-500"
                      >
                          <option value="pending">Pendente</option>
                          <option value="confirmed">Confirmado</option>
                          <option value="canceled">Cancelado</option>
                      </select>
                  </div>
              )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Descrição / Tipo de Exame</label>
            <textarea
              value={examType}
              onChange={(e) => setExamType(e.target.value)}
              className="w-full p-3 rounded-md border border-gray-200 focus:outline-none focus:ring-2 focus:ring-pink-500"
              rows={3}
              placeholder="Ex: Consulta de rotina"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Telefone</label>
            <Input
              value={phone}
              onChange={(e) => setPhone(formatPhone(e.target.value))}
              placeholder="(99) 99999-9999"
              maxLength={15}
              required
            />
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancelar
          </Button>
          <Button type="submit" disabled={submitting} className="bg-[#C94B6D] hover:bg-[#A63D5A] text-white">
            {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isEditing ? 'Salvar Alterações' : 'Agendar'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default AppointmentForm;
