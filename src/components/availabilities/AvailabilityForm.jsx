import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { Loader2, Clock, Calendar } from 'lucide-react';

const AvailabilityForm = ({ availability, onSuccess, onCancel, onSubmit }) => {
  const isEditing = !!availability;
  const { toast } = useToast();

  const [dayOfWeek, setDayOfWeek] = useState(availability?.day_of_week ?? 1);
  const [startTime, setStartTime] = useState(availability?.start_time || '09:00');
  const [endTime, setEndTime] = useState(availability?.end_time || '17:00');
  const [submitting, setSubmitting] = useState(false);

  const days = [
    { value: 0, label: 'Domingo' },
    { value: 1, label: 'Segunda-feira' },
    { value: 2, label: 'Terça-feira' },
    { value: 3, label: 'Quarta-feira' },
    { value: 4, label: 'Quinta-feira' },
    { value: 5, label: 'Sexta-feira' },
    { value: 6, label: 'Sábado' },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!startTime || !endTime) {
      toast({
        title: 'Campos obrigatórios',
        description: 'Por favor preencha os horários de início e fim.',
        variant: 'destructive',
      });
      return;
    }

    if (startTime >= endTime) {
      toast({
        title: 'Horário inválido',
        description: 'O horário final deve ser posterior ao horário inicial.',
        variant: 'destructive',
      });
      return;
    }

    setSubmitting(true);
    try {
      // Importante:
      // - NÃO envie admin_id daqui. O ideal é o banco preencher via DEFAULT auth.uid()
      //   (evita erro de FK/RLS) e o RLS validar.
      const data = {
        day_of_week: Number(dayOfWeek),
        start_time: startTime,
        end_time: endTime,
        active: true,
      };

      await onSubmit(data);
      onSuccess?.();
    } catch (err) {
      console.error(err);
      toast({
        title: 'Erro ao salvar disponibilidade',
        description: err?.message || 'Ocorreu um erro inesperado.',
        variant: 'destructive',
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 p-1">
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Dia da Semana</label>
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <select
              value={dayOfWeek}
              onChange={(e) => setDayOfWeek(e.target.value)}
              className="w-full h-10 pl-10 pr-3 rounded-md border border-gray-200 focus:outline-none focus:ring-2 focus:ring-pink-500 bg-white"
              required
            >
              {days.map((day) => (
                <option key={day.value} value={day.value}>
                  {day.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Horário Início</label>
            <div className="relative">
              <Clock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
              <Input
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="pl-10"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Horário Fim</label>
            <div className="relative">
              <Clock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
              <Input
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="pl-10"
                required
              />
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-4 border-t">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit" disabled={submitting} className="bg-[#C94B6D] hover:bg-[#A63D5A] text-white">
          {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {isEditing ? 'Salvar Alterações' : 'Criar Disponibilidade'}
        </Button>
      </div>
    </form>
  );
};

export default AvailabilityForm;
