
import React from 'react';
import { format, parseISO, isSameDay } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Calendar as CalendarIcon, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';

const AvailabilitySelector = ({ availabilities, selectedDate, selectedTime, onSelect }) => {
  
  // Group availabilities by date
  const groupedAvailabilities = availabilities.reduce((acc, curr) => {
    const dateKey = curr.date;
    if (!acc[dateKey]) acc[dateKey] = [];
    acc[dateKey].push(curr);
    return acc;
  }, {});

  const dates = Object.keys(groupedAvailabilities).sort();

  if (dates.length === 0) {
    return (
      <div className="text-center py-10 bg-gray-50 rounded-lg border border-dashed border-gray-200">
        <CalendarIcon className="mx-auto h-10 w-10 text-gray-300 mb-2" />
        <p className="text-gray-500 font-medium">Nenhum horário disponível no momento.</p>
        <p className="text-sm text-gray-400">Tente novamente mais tarde.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
          <CalendarIcon className="w-4 h-4 text-[#C94B6D]" />
          1. Escolha uma Data
        </h3>
        <ScrollArea className="w-full whitespace-nowrap pb-4">
          <div className="flex gap-2">
            {dates.map((dateStr) => {
              const dateObj = parseISO(dateStr);
              const isSelected = selectedDate === dateStr;
              
              return (
                <button
                  key={dateStr}
                  onClick={() => onSelect(dateStr, null)}
                  className={`flex flex-col items-center justify-center min-w-[80px] p-3 rounded-lg border transition-all ${
                    isSelected 
                      ? 'bg-[#C94B6D] text-white border-[#C94B6D] shadow-md transform scale-105' 
                      : 'bg-white border-gray-200 hover:border-[#C94B6D]/50 hover:bg-pink-50 text-gray-700'
                  }`}
                >
                  <span className="text-xs font-medium uppercase opacity-90">
                    {format(dateObj, 'EEE', { locale: ptBR })}
                  </span>
                  <span className="text-lg font-bold">
                    {format(dateObj, 'd')}
                  </span>
                  <span className="text-xs opacity-75">
                    {format(dateObj, 'MMM', { locale: ptBR })}
                  </span>
                </button>
              );
            })}
          </div>
        </ScrollArea>
      </div>

      {selectedDate && (
        <div className="animate-in fade-in slide-in-from-top-4 duration-300">
          <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <Clock className="w-4 h-4 text-[#C94B6D]" />
            2. Escolha um Horário
          </h3>
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
            {groupedAvailabilities[selectedDate].map((slot) => {
              const isSelected = selectedTime === slot.time;
              return (
                <Button
                  key={slot.id}
                  variant={isSelected ? "default" : "outline"}
                  onClick={() => onSelect(selectedDate, slot.time)}
                  className={`w-full ${isSelected ? 'bg-[#C94B6D] hover:bg-[#b03d5b]' : 'hover:border-[#C94B6D] hover:text-[#C94B6D]'}`}
                >
                  {slot.time.slice(0, 5)}
                </Button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default AvailabilitySelector;
