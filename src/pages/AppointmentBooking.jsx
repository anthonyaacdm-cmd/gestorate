
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { useAuth } from '@/context/AuthContext';
import { createAppointment, getAvailability } from '@/services/appointmentService';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';
import MainLayout from '@/layouts/MainLayout';
import { Calendar } from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { Loader2, Phone } from 'lucide-react';
import { format } from 'date-fns';
import { formatPhone, validatePhone } from '@/utils/validation';

const AppointmentBooking = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState('');
  const [examType, setExamType] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [availabilityInfo, setAvailabilityInfo] = useState(null);
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const timeSlots = [
    '08:00', '08:30', '09:00', '09:30', '10:00', '10:30',
    '11:00', '11:30', '14:00', '14:30', '15:00', '15:30',
    '16:00', '16:30', '17:00', '17:30'
  ];

  useEffect(() => {
    if (user && user.phone) {
      setPhoneNumber(user.phone);
    }
  }, [user]);

  useEffect(() => {
    if (selectedDate) {
      checkAvailability();
    }
  }, [selectedDate]);

  const checkAvailability = async () => {
    const dateStr = format(selectedDate, 'yyyy-MM-dd');
    const { data } = await getAvailability(dateStr);
    setAvailabilityInfo(data);
  };

  const handlePhoneChange = (e) => {
    setPhoneNumber(formatPhone(e.target.value));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!selectedDate || !selectedTime || !examType || !phoneNumber) {
      toast({
        title: 'Campos obrigatórios',
        description: 'Por favor, preencha todos os campos, incluindo telefone.',
        variant: 'destructive',
      });
      return;
    }

    if (!validatePhone(phoneNumber)) {
      toast({
        title: 'Telefone inválido',
        description: 'Por favor, insira um número de telefone válido.',
        variant: 'destructive',
      });
      return;
    }
    
    const dateStr = format(selectedDate, 'yyyy-MM-dd');
    
    // Check availability
    if (availabilityInfo && !availabilityInfo.is_available) {
      toast({
        title: 'Data indisponível',
        description: 'Esta data não está disponível para agendamentos.',
        variant: 'destructive',
      });
      return;
    }
    
    if (availabilityInfo && availabilityInfo.current_appointments >= availabilityInfo.max_appointments) {
      toast({
        title: 'Data sem vagas',
        description: 'Esta data já atingiu o limite de agendamentos.',
        variant: 'destructive',
      });
      return;
    }
    
    setLoading(true);
    const { data, error } = await createAppointment({
      user_id: user.id,
      date: dateStr,
      time: selectedTime,
      exam_type: examType,
      phone: phoneNumber,
      status: 'pending',
    });
    setLoading(false);
    
    if (error) {
      toast({
        title: 'Erro ao criar agendamento',
        description: error,
        variant: 'destructive',
      });
      return;
    }
    
    toast({
      title: 'Agendamento criado no Gestorate!',
      description: 'Sua consulta foi agendada. Aguardando confirmação.',
    });
    
    navigate('/dashboard');
  };

  const tileClassName = ({ date, view }) => {
    if (view === 'month') {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (date < today) {
        return 'react-calendar__tile--disabled';
      }
    }
    return null;
  };

  const isDateAvailable = availabilityInfo
    ? availabilityInfo.is_available && availabilityInfo.current_appointments < availabilityInfo.max_appointments
    : true;

  return (
    <>
      <Helmet>
        <title>Agendar Consulta - Gestorate</title>
        <meta name="description" content="Agende sua consulta de forma rápida e fácil no Gestorate." />
      </Helmet>
      
      <MainLayout>
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Novo Agendamento</h1>
            <p className="text-gray-600 mt-1">Selecione a data, horário e tipo de exame</p>
          </div>
          
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Selecione a Data</CardTitle>
                </CardHeader>
                <CardContent>
                  <Calendar
                    onChange={setSelectedDate}
                    value={selectedDate}
                    minDate={new Date()}
                    locale="pt-BR"
                    tileClassName={tileClassName}
                    className="w-full border-none shadow-none"
                  />
                  {availabilityInfo && (
                    <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                      <p className="text-sm font-medium text-gray-700">
                        Status:{' '}
                        <span
                          className={
                            isDateAvailable ? 'text-green-600' : 'text-red-600'
                          }
                        >
                          {isDateAvailable ? 'Disponível' : 'Indisponível'}
                        </span>
                      </p>
                      <p className="text-sm text-gray-600 mt-1">
                        Agendamentos: {availabilityInfo.current_appointments || 0} /{' '}
                        {availabilityInfo.max_appointments || 5}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
              
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Detalhes da Consulta</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Horário
                      </label>
                      <Select
                        value={selectedTime}
                        onChange={(e) => setSelectedTime(e.target.value)}
                        disabled={!isDateAvailable}
                      >
                        <option value="">Selecione um horário</option>
                        {timeSlots.map((time) => (
                          <option key={time} value={time}>
                            {time}
                          </option>
                        ))}
                      </Select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Tipo de Exame
                      </label>
                      <Input
                        value={examType}
                        onChange={(e) => setExamType(e.target.value)}
                        placeholder="Ex: Consulta Geral, Exame de Sangue..."
                        disabled={!isDateAvailable}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Telefone para Contato
                      </label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <Input
                          value={phoneNumber}
                          onChange={handlePhoneChange}
                          placeholder="(99) 99999-9999"
                          disabled={!isDateAvailable}
                          className="pl-10"
                          maxLength={15}
                        />
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        Usaremos este número para enviar confirmações via WhatsApp.
                      </p>
                    </div>
                  </CardContent>
                </Card>
                
                <Button
                  type="submit"
                  disabled={loading || !isDateAvailable}
                  className="w-full h-12 bg-[#C94B6D] hover:bg-[#A63D5A] text-white font-medium text-lg shadow-lg hover:shadow-xl transition-all"
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Processando...
                    </>
                  ) : (
                    'Confirmar Agendamento'
                  )}
                </Button>
              </div>
            </div>
          </form>
        </div>
      </MainLayout>
    </>
  );
};

export default AppointmentBooking;
