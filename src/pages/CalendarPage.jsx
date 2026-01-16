
import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import MainLayout from '@/layouts/MainLayout';
import CalendarView from '@/components/calendar/CalendarView';
import CalendarLegend from '@/components/calendar/CalendarLegend';
import DayDetailsModal from '@/components/calendar/DayDetailsModal';
import { useCalendarAppointments } from '@/hooks/useCalendarAppointments';
import { Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

const CalendarPage = () => {
  const { 
    filteredAppointments, 
    loading, 
    filters, 
    setFilters, 
    getAppointmentsByDate,
    updateAppointmentStatus 
  } = useCalendarAppointments();

  const [selectedDate, setSelectedDate] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSelectSlot = (slotInfo) => {
    // slotInfo.start is the date clicked
    setSelectedDate(slotInfo.start);
    setIsModalOpen(true);
  };

  const handleSelectEvent = (event) => {
    // When clicking an event, open the modal for that day
    setSelectedDate(event.start);
    setIsModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-gray-50/30">
      <Helmet>
        <title>Calendário - Gestorate</title>
        <meta name="description" content="Visualize e gerencie seus agendamentos no calendário do Gestorate." />
      </Helmet>
        
      <div className="max-w-7xl mx-auto space-y-6">
        <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Calendário</h1>
            <p className="text-gray-500 mt-1">Visualize todos os seus exames e consultas</p>
          </div>
        </header>

        {loading ? (
          <div className="h-[600px] flex items-center justify-center bg-white rounded-xl shadow-sm border">
            <Loader2 className="h-10 w-10 animate-spin text-[#C94B6D]" />
          </div>
        ) : (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <CalendarLegend 
              filters={filters} 
              setFilters={setFilters} 
              appointmentCount={filteredAppointments.length}
            />
            
            <CalendarView 
              events={filteredAppointments}
              onSelectSlot={handleSelectSlot}
              onSelectEvent={handleSelectEvent}
            />
          </motion.div>
        )}

        <DayDetailsModal 
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          date={selectedDate}
          appointments={selectedDate ? getAppointmentsByDate(selectedDate) : []}
          onUpdateStatus={updateAppointmentStatus}
        />
      </div>
    </div>
  );
};

export default CalendarPage;
