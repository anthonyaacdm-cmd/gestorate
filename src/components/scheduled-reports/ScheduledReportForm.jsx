
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { validateRecipients, validateReportData } from '@/services/scheduledReportService';
import { Loader2, Plus, X } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const ScheduledReportForm = ({ initialData, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    report_type: initialData?.report_type || 'appointments',
    frequency: initialData?.frequency || 'weekly',
    execution_time: initialData?.execution_time?.slice(0,5) || '09:00',
    recipients: initialData?.recipients || [],
    format: initialData?.format || 'pdf',
    filters: initialData?.filters || { period: 'last_30_days', status: 'all' },
    status: initialData?.status || 'active'
  });

  const [recipientInput, setRecipientInput] = useState('');
  const [errors, setErrors] = useState([]);
  const [submitting, setSubmitting] = useState(false);

  const handleAddRecipient = () => {
    if (!recipientInput) return;
    if (!validateRecipients([recipientInput])) {
      setErrors(['Email inválido']);
      return;
    }
    if (formData.recipients.includes(recipientInput)) {
      setRecipientInput('');
      return;
    }
    setFormData(prev => ({ ...prev, recipients: [...prev.recipients, recipientInput] }));
    setRecipientInput('');
    setErrors([]);
  };

  const removeRecipient = (email) => {
    setFormData(prev => ({ ...prev, recipients: prev.recipients.filter(r => r !== email) }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors([]);
    
    const validationErrors = validateReportData(formData);
    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      return;
    }

    setSubmitting(true);
    try {
      await onSubmit(formData);
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div className="grid gap-2">
          <Label htmlFor="name">Nome do Agendamento *</Label>
          <Input 
            id="name" 
            value={formData.name} 
            onChange={(e) => setFormData(p => ({...p, name: e.target.value}))} 
            placeholder="Ex: Relatório Semanal de Vendas"
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="grid gap-2">
            <Label>Tipo de Relatório *</Label>
            <Select 
              value={formData.report_type} 
              onValueChange={(v) => setFormData(p => ({...p, report_type: v}))}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="appointments">Agendamentos</SelectItem>
                <SelectItem value="revenue">Resumo/Volume</SelectItem>
                <SelectItem value="clients">Clientes</SelectItem>
                <SelectItem value="availabilities">Disponibilidades</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
             <Label>Formato *</Label>
             <div className="flex gap-4 pt-2">
               {['pdf', 'excel', 'csv'].map(fmt => (
                 <label key={fmt} className="flex items-center gap-2 text-sm cursor-pointer">
                   <input 
                     type="radio" 
                     name="format" 
                     value={fmt}
                     checked={formData.format === fmt}
                     onChange={(e) => setFormData(p => ({...p, format: e.target.value}))}
                     className="text-[#C94B6D] focus:ring-[#C94B6D]"
                   />
                   {fmt.toUpperCase()}
                 </label>
               ))}
             </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="grid gap-2">
            <Label>Frequência *</Label>
            <Select 
              value={formData.frequency} 
              onValueChange={(v) => setFormData(p => ({...p, frequency: v}))}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="daily">Diariamente</SelectItem>
                <SelectItem value="weekly">Semanalmente</SelectItem>
                <SelectItem value="monthly">Mensalmente</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="grid gap-2">
            <Label>Horário de Execução *</Label>
            <Input 
              type="time" 
              value={formData.execution_time}
              onChange={(e) => setFormData(p => ({...p, execution_time: e.target.value}))}
              required
            />
          </div>
        </div>

        <div className="grid gap-2">
          <Label>Destinatários *</Label>
          <div className="flex gap-2">
            <Input 
              value={recipientInput}
              onChange={(e) => setRecipientInput(e.target.value)}
              placeholder="email@exemplo.com"
              onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddRecipient())}
            />
            <Button type="button" onClick={handleAddRecipient} size="icon" variant="outline">
              <Plus size={18} />
            </Button>
          </div>
          <div className="flex flex-wrap gap-2 mt-2">
            {formData.recipients.map(email => (
              <Badge key={email} variant="secondary" className="flex items-center gap-1 pl-2 pr-1 py-1">
                {email}
                <button 
                  type="button" 
                  onClick={() => removeRecipient(email)}
                  className="hover:bg-gray-200 rounded-full p-0.5 ml-1"
                >
                  <X size={12} />
                </button>
              </Badge>
            ))}
            {formData.recipients.length === 0 && (
              <span className="text-xs text-gray-400 italic">Nenhum destinatário adicionado</span>
            )}
          </div>
        </div>
      </div>

      {errors.length > 0 && (
        <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm">
          {errors.map((err, i) => <div key={i}>{err}</div>)}
        </div>
      )}

      <div className="flex justify-end gap-3 pt-4 border-t">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button 
          type="submit" 
          disabled={submitting || formData.recipients.length === 0}
          className="bg-[#C94B6D] hover:bg-[#b03d5b]"
        >
          {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Salvar Agendamento
        </Button>
      </div>
    </form>
  );
};

export default ScheduledReportForm;
