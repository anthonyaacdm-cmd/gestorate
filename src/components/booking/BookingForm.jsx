
import React, { useState } from 'react';
import { Loader2, User, Mail, Phone, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from '@/components/ui/use-toast';
import { useN8nWebhook } from '@/hooks/useN8nWebhook';

const BookingForm = ({ 
  onSubmit, 
  loading, 
  selectedDate, 
  selectedTime, 
  validateEmail, 
  validatePhone 
}) => {
  const { toast } = useToast();
  // While standard booking handles the trigger internally, we can use this hook 
  // if we wanted to show real-time status, though for public facing forms
  // we usually hide the "sausage making" of webhooks unless it's a critical error.
  const { webhookError } = useN8nWebhook();

  const [formData, setFormData] = useState({
    guest_name: '',
    guest_email: '',
    guest_phone: '',
    exam_type: '',
    notes: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (value) => {
    setFormData(prev => ({ ...prev, exam_type: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!selectedDate || !selectedTime) {
      toast({
        title: "Seleção incompleta",
        description: "Por favor, selecione uma data e horário.",
        variant: "destructive"
      });
      return;
    }

    if (!formData.guest_name || !formData.guest_email || !formData.guest_phone || !formData.exam_type) {
      toast({
        title: "Campos obrigatórios",
        description: "Por favor, preencha todos os campos obrigatórios.",
        variant: "destructive"
      });
      return;
    }

    if (!validateEmail(formData.guest_email)) {
      toast({
        title: "Email inválido",
        description: "Por favor, insira um email válido.",
        variant: "destructive"
      });
      return;
    }

    if (!validatePhone(formData.guest_phone)) {
      toast({
        title: "Telefone inválido",
        description: "Por favor, insira um telefone válido.",
        variant: "destructive"
      });
      return;
    }

    onSubmit({ ...formData, date: selectedDate, time: selectedTime });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="space-y-4 bg-gray-50 p-6 rounded-lg border border-gray-100">
        <h3 className="text-sm font-semibold text-gray-900 mb-2 flex items-center gap-2">
          <FileText className="w-4 h-4 text-[#C94B6D]" />
          3. Seus Dados
        </h3>
        
        <div className="space-y-2">
          <Label htmlFor="guest_name">Nome Completo *</Label>
          <div className="relative">
            <User className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            <Input 
              id="guest_name" 
              name="guest_name" 
              placeholder="Digite seu nome" 
              value={formData.guest_name}
              onChange={handleChange}
              className="pl-10"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="guest_email">Email *</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
              <Input 
                id="guest_email" 
                name="guest_email" 
                type="email" 
                placeholder="seu@email.com" 
                value={formData.guest_email}
                onChange={handleChange}
                className="pl-10"
                required
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="guest_phone">Telefone / WhatsApp *</Label>
            <div className="relative">
              <Phone className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
              <Input 
                id="guest_phone" 
                name="guest_phone" 
                placeholder="(00) 00000-0000" 
                value={formData.guest_phone}
                onChange={handleChange}
                className="pl-10"
                required
              />
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="exam_type">Serviço / Tipo de Exame *</Label>
          <Select onValueChange={handleSelectChange} value={formData.exam_type}>
            <SelectTrigger className="bg-white">
              <SelectValue placeholder="Selecione o serviço" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Consulta Geral">Consulta Geral</SelectItem>
              <SelectItem value="Exame de Rotina">Exame de Rotina</SelectItem>
              <SelectItem value="Retorno">Retorno</SelectItem>
              <SelectItem value="Avaliação">Avaliação</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="notes">Observações (Opcional)</Label>
          <Textarea 
            id="notes" 
            name="notes" 
            placeholder="Alguma informação adicional?" 
            value={formData.notes}
            onChange={handleChange}
            className="bg-white"
          />
        </div>
      </div>

      <Button 
        type="submit" 
        className="w-full bg-[#C94B6D] hover:bg-[#b03d5b] text-lg py-6"
        disabled={loading || !selectedDate || !selectedTime}
      >
        {loading ? (
          <>
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            Processando...
          </>
        ) : (
          "Confirmar Agendamento"
        )}
      </Button>
      
      {/* Subtle reassurance message */}
      <p className="text-xs text-center text-gray-500 mt-2">
        Você receberá uma confirmação por email após o agendamento.
      </p>
    </form>
  );
};

export default BookingForm;
