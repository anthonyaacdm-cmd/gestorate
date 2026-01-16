
import React, { useEffect, useState } from 'react';
import { Calendar as CalendarIcon, Filter, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar'; // Ensure you have this or use simple inputs
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { supabase } from '@/lib/customSupabaseClient';

const ReportFilters = ({ filters, setFilters, onApply, onReset }) => {
  const [admins, setAdmins] = useState([]);

  useEffect(() => {
    // Fetch admins for filter
    const fetchAdmins = async () => {
      const { data } = await supabase
        .from('users')
        .select('id, name')
        .eq('role', 'admin');
      if (data) setAdmins(data);
    };
    fetchAdmins();
  }, []);

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 space-y-4">
      <h3 className="font-semibold text-gray-900 flex items-center gap-2">
        <Filter size={18} /> Filtros
      </h3>
      
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">Período</label>
        <div className="grid gap-2">
           <input 
             type="date"
             className="w-full text-sm border rounded-md p-2"
             value={filters.start_date ? format(filters.start_date, 'yyyy-MM-dd') : ''}
             onChange={(e) => setFilters(prev => ({ ...prev, start_date: e.target.value ? new Date(e.target.value) : null }))}
           />
           <input 
             type="date"
             className="w-full text-sm border rounded-md p-2"
             value={filters.end_date ? format(filters.end_date, 'yyyy-MM-dd') : ''}
             onChange={(e) => setFilters(prev => ({ ...prev, end_date: e.target.value ? new Date(e.target.value) : null }))}
           />
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">Status</label>
        <Select 
          value={filters.status} 
          onValueChange={(val) => setFilters(prev => ({ ...prev, status: val }))}
        >
          <SelectTrigger>
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos</SelectItem>
            <SelectItem value="confirmed">Confirmados</SelectItem>
            <SelectItem value="pending">Pendentes</SelectItem>
            <SelectItem value="canceled">Cancelados</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">Profissional</label>
        <Select 
          value={filters.admin_id} 
          onValueChange={(val) => setFilters(prev => ({ ...prev, admin_id: val }))}
        >
          <SelectTrigger>
            <SelectValue placeholder="Selecione..." />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos</SelectItem>
            {admins.map(admin => (
              <SelectItem key={admin.id} value={admin.id}>{admin.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex flex-col gap-2 pt-2">
        <Button onClick={onApply} className="w-full bg-[#C94B6D] hover:bg-[#b03d5b]">
          Aplicar Filtros
        </Button>
        <Button onClick={onReset} variant="outline" className="w-full">
          <X size={16} className="mr-2" /> Limpar
        </Button>
      </div>
    </div>
  );
};

export default ReportFilters;
