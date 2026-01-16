
import React from 'react';
import { CheckCircle2, Clock, XCircle, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';

const CalendarLegend = ({ filters, setFilters, appointmentCount }) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
      <div className="flex flex-wrap gap-4 items-center">
        <h3 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
          <Filter size={16} />
          Filtros:
        </h3>
        
        <div className="flex flex-wrap gap-2">
          <Button
            variant={filters.status === 'all' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilters(prev => ({ ...prev, status: 'all' }))}
            className={filters.status === 'all' ? "bg-gray-800" : ""}
          >
            Todos ({appointmentCount})
          </Button>
          
          <Button
            variant={filters.status === 'pending' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilters(prev => ({ ...prev, status: 'pending' }))}
            className={filters.status === 'pending' ? "bg-yellow-500 hover:bg-yellow-600 text-white border-none" : "text-yellow-600 border-yellow-200 hover:bg-yellow-50"}
          >
            <Clock size={14} className="mr-1" /> Pendentes
          </Button>

          <Button
            variant={filters.status === 'confirmed' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilters(prev => ({ ...prev, status: 'confirmed' }))}
            className={filters.status === 'confirmed' ? "bg-green-600 hover:bg-green-700 text-white border-none" : "text-green-600 border-green-200 hover:bg-green-50"}
          >
            <CheckCircle2 size={14} className="mr-1" /> Confirmados
          </Button>

          <Button
            variant={filters.status === 'canceled' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilters(prev => ({ ...prev, status: 'canceled' }))}
            className={filters.status === 'canceled' ? "bg-red-500 hover:bg-red-600 text-white border-none" : "text-red-600 border-red-200 hover:bg-red-50"}
          >
            <XCircle size={14} className="mr-1" /> Cancelados
          </Button>
        </div>
      </div>
      
      <div className="text-xs text-gray-400 hidden lg:block">
        Clique em um dia para ver detalhes
      </div>
    </div>
  );
};

export default CalendarLegend;
