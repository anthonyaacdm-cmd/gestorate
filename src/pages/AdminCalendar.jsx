
import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { setAvailability, getAvailability, getAppointmentsByDate } from '@/services/appointmentService';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Modal } from '@/components/ui/modal';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import MainLayout from '@/layouts/MainLayout';
import { Calendar } from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { format } from 'date-fns';

const AdminCalendar = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showModal, setShowModal] = useState(false);
  const [availabilityData, setAvailabilityData] = useState(null);
  const [isAvailable, setIsAvailable] = useState(true);
  const [maxAppointments, setMaxAppointments] = useState(5);
  const { toast } = useToast();

  const handleDateClick = async (date) => {
    setSelectedDate(date);
    const dateStr = format(date, 'yyyy-MM-dd');
    
    // Fetch slots and appointments in parallel
    const [availabilityResponse, appointmentsResponse] = await Promise.all([
      getAvailability(dateStr),
      getAppointmentsByDate(dateStr)
    ]);
    
    const slots = availabilityResponse.data || [];
    const appointments = appointmentsResponse.data || [];
    
    const hasSlots = slots.length > 0;
    const currentApps = appointments.length;
    // If slots exist, use their count as max, otherwise default to 5
    const maxApps = hasSlots ? slots.length : 5;

    setAvailabilityData({
      current_appointments: currentApps,
      max_appointments: maxApps,
      is_available: hasSlots
    });
    
    setIsAvailable(hasSlots);
    setMaxAppointments(maxApps);
    
    setShowModal(true);
  };

  const handleSave = async () => {
    const dateStr = format(selectedDate, 'yyyy-MM-dd');
    const { error } = await setAvailability(dateStr, isAvailable, maxAppointments);
    
    if (error) {
      toast({
        title: 'Erro ao salvar',
        description: error,
        variant: 'destructive',
      });
      return;
    }
    
    toast({
      title: 'Disponibilidade atualizada!',
      description: `Data ${isAvailable ? 'disponível' : 'indisponível'} para agendamentos.`,
    });
    
    setShowModal(false);
  };

  const tileClassName = ({ date, view }) => {
    if (view === 'month') {
      // You could add logic here to color-code dates based on availability
      return null;
    }
    return null;
  };

  return (
    <>
      <Helmet>
        <title>Calendário Admin - Gestorate</title>
        <meta name="description" content="Gerencie a disponibilidade do calendário no Gestorate." />
      </Helmet>
      
      <MainLayout>
        <div className="max-w-4xl mx-auto space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Gerenciar Calendário</h1>
            <p className="text-gray-600 mt-1">Defina a disponibilidade de cada data</p>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Selecione uma data</CardTitle>
            </CardHeader>
            <CardContent>
              <Calendar
                onChange={handleDateClick}
                value={selectedDate}
                locale="pt-BR"
                tileClassName={tileClassName}
                className="w-full border-none shadow-none"
              />
              <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                <h3 className="font-medium text-gray-900 mb-2">Legenda:</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 bg-green-500 rounded"></div>
                    <span>Disponível com vagas</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 bg-red-500 rounded"></div>
                    <span>Indisponível ou sem vagas</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <Modal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          title={`Configurar: ${format(selectedDate, "dd 'de' MMMM 'de' yyyy")}`}
        >
          <div className="space-y-6">
            {availabilityData && (
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600">
                  Agendamentos atuais:{' '}
                  <span className="font-medium text-gray-900">
                    {availabilityData.current_appointments || 0}
                  </span>
                </p>
              </div>
            )}
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Status da Data
              </label>
              <div className="space-y-2">
                <button
                  onClick={() => setIsAvailable(true)}
                  className={`w-full p-4 rounded-lg border-2 transition-all ${
                    isAvailable
                      ? 'border-green-500 bg-green-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <span className="font-medium">Disponível</span>
                </button>
                <button
                  onClick={() => setIsAvailable(false)}
                  className={`w-full p-4 rounded-lg border-2 transition-all ${
                    !isAvailable
                      ? 'border-red-500 bg-red-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <span className="font-medium">Indisponível</span>
                </button>
              </div>
            </div>
            
            {isAvailable && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Máximo de Agendamentos
                </label>
                <Input
                  type="number"
                  min="1"
                  max="20"
                  value={maxAppointments}
                  onChange={(e) => setMaxAppointments(parseInt(e.target.value))}
                />
              </div>
            )}
            
            <Button
              onClick={handleSave}
              className="w-full bg-[#C94B6D] hover:bg-[#A63D5A] text-white"
            >
              Salvar Configurações
            </Button>
          </div>
        </Modal>
      </MainLayout>
    </>
  );
};

export default AdminCalendar;
