
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { ChevronLeft, Calendar, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import { usePublicBooking } from '@/hooks/usePublicBooking';
import AdminProfileCard from '@/components/booking/AdminProfileCard';
import AvailabilitySelector from '@/components/booking/AvailabilitySelector';
import BookingForm from '@/components/booking/BookingForm';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { motion, AnimatePresence } from 'framer-motion';

const PublicBookingPage = () => {
  const { adminId } = useParams();
  const {
    admin,
    availabilities,
    loading,
    error,
    success,
    fetchAdminData,
    fetchAvailabilities,
    createGuestAppointment,
    validateEmail,
    validatePhone
  } = usePublicBooking();

  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [appointmentResult, setAppointmentResult] = useState(null);
  const [step, setStep] = useState(1); // 1: Date/Time, 2: Form, 3: Success

  useEffect(() => {
    if (adminId) {
      fetchAdminData(adminId);
      fetchAvailabilities(adminId);
    }
  }, [adminId, fetchAdminData, fetchAvailabilities]);

  const handleSlotSelect = (date, time) => {
    setSelectedDate(date);
    setSelectedTime(time);
    if (date && time) {
        setTimeout(() => setStep(2), 300); // Smooth transition
    }
  };

  const handleSubmit = async (formData) => {
    const result = await createGuestAppointment({
      ...formData,
      admin_id: adminId
    });
    
    if (result) {
      setAppointmentResult(result);
      setStep(3);
    }
  };

  if (loading && !admin) {
    return (
      <div className="min-h-screen bg-[var(--bg-primary)] p-8 space-y-8">
        <Skeleton className="h-40 w-full rounded-2xl" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <Skeleton className="h-64 rounded-2xl" />
          <Skeleton className="h-96 rounded-2xl lg:col-span-2" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--bg-primary)] p-4">
        <div className="text-center max-w-md bg-[var(--bg-secondary)] p-8 rounded-2xl shadow-lg">
          <AlertCircle className="mx-auto h-16 w-16 text-[var(--error-color)] mb-4" />
          <h1 className="text-2xl font-bold text-[var(--text-primary)] mb-2">Ops! Algo deu errado no Gestorate.</h1>
          <p className="text-[var(--text-muted)] mb-6">{error}</p>
          <Link to="/book">
            <Button>Ver outros profissionais</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] pb-12">
      <Helmet>
        <title>{admin ? `Agendar com ${admin.name} - Gestorate` : 'Agendamento Online - Gestorate'}</title>
      </Helmet>

      {/* Header / Hero */}
      <div className="bg-gradient-to-br from-[var(--primary-color)] to-[var(--secondary-color)] text-white py-12 px-4 sm:px-6 mb-8 shadow-md">
        <div className="max-w-4xl mx-auto">
            <Link to="/book" className="text-white/80 hover:text-white flex items-center gap-1 transition-colors mb-4 text-sm">
                <ChevronLeft size={16} /> Voltar para lista
            </Link>
            <h1 className="text-3xl font-bold mb-2">Agendamento Online com Gestorate</h1>
            <p className="text-white/90">Escolha o melhor horário para o seu atendimento.</p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        {step === 3 && appointmentResult ? (
           <motion.div 
             initial={{ opacity: 0, scale: 0.9 }} 
             animate={{ opacity: 1, scale: 1 }}
             className="bg-[var(--bg-secondary)] p-8 rounded-[var(--radius-xl)] shadow-xl text-center max-w-2xl mx-auto border border-[var(--border-color)]"
           >
             <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
               <CheckCircle className="w-10 h-10 text-green-600" />
             </div>
             <h2 className="text-3xl font-bold text-[var(--text-primary)] mb-2">Agendamento Confirmado!</h2>
             <p className="text-[var(--text-secondary)] mb-8">
               Enviamos os detalhes para o seu email.
             </p>
             <div className="bg-[var(--bg-tertiary)] p-6 rounded-xl text-left space-y-4 mb-8">
                <div className="flex justify-between border-b border-[var(--border-color)] pb-2">
                    <span className="text-[var(--text-muted)]">Profissional</span>
                    <span className="font-semibold">{admin.name}</span>
                </div>
                <div className="flex justify-between border-b border-[var(--border-color)] pb-2">
                    <span className="text-[var(--text-muted)]">Data</span>
                    <span className="font-semibold">{new Date(appointmentResult.date).toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between">
                    <span className="text-[var(--text-muted)]">Horário</span>
                    <span className="font-semibold">{appointmentResult.time}</span>
                </div>
             </div>
             <Button onClick={() => window.location.reload()} size="lg">Novo Agendamento</Button>
           </motion.div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1 space-y-6">
              <AdminProfileCard admin={admin} />
              
              {/* Progress Steps */}
              <div className="hidden lg:block bg-[var(--bg-secondary)] p-6 rounded-xl border border-[var(--border-color)]">
                 <div className="flex flex-col space-y-4">
                    <div className={`flex items-center gap-3 ${step >= 1 ? 'text-[var(--primary-color)]' : 'text-[var(--text-muted)]'}`}>
                       <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${step >= 1 ? 'border-[var(--primary-color)] bg-[var(--primary-color)] text-white' : 'border-gray-300'}`}>1</div>
                       <span className="font-medium">Escolher Horário</span>
                    </div>
                    <div className="h-6 w-0.5 bg-[var(--border-color)] ml-4"></div>
                    <div className={`flex items-center gap-3 ${step >= 2 ? 'text-[var(--primary-color)]' : 'text-[var(--text-muted)]'}`}>
                       <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${step >= 2 ? 'border-[var(--primary-color)] bg-[var(--primary-color)] text-white' : 'border-gray-300'}`}>2</div>
                       <span className="font-medium">Seus Dados</span>
                    </div>
                 </div>
              </div>
            </div>

            <div className="lg:col-span-2">
              <AnimatePresence mode="wait">
                 {step === 1 && (
                    <motion.div
                       key="step1"
                       initial={{ opacity: 0, x: -20 }}
                       animate={{ opacity: 1, x: 0 }}
                       exit={{ opacity: 0, x: 20 }}
                       className="bg-[var(--bg-secondary)] p-6 rounded-[var(--radius-xl)] shadow-sm border border-[var(--border-color)]"
                    >
                       <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                          <Calendar className="text-[var(--primary-color)]" /> Selecione uma Data
                       </h2>
                       <AvailabilitySelector 
                         availabilities={availabilities}
                         selectedDate={selectedDate}
                         selectedTime={selectedTime}
                         onSelect={handleSlotSelect}
                       />
                    </motion.div>
                 )}

                 {step === 2 && (
                    <motion.div
                       key="step2"
                       initial={{ opacity: 0, x: 20 }}
                       animate={{ opacity: 1, x: 0 }}
                       exit={{ opacity: 0, x: -20 }}
                       className="bg-[var(--bg-secondary)] p-6 rounded-[var(--radius-xl)] shadow-sm border border-[var(--border-color)]"
                    >
                       <div className="flex items-center justify-between mb-6">
                           <h2 className="text-xl font-semibold flex items-center gap-2">
                              <Clock className="text-[var(--primary-color)]" /> Confirme seus dados
                           </h2>
                           <Button variant="ghost" size="sm" onClick={() => setStep(1)}>Mudar Horário</Button>
                       </div>
                       
                       <div className="bg-[var(--bg-tertiary)] p-4 rounded-lg mb-6 flex items-center gap-4">
                          <div className="text-center bg-[var(--bg-secondary)] p-2 rounded-md border border-[var(--border-color)] min-w-[80px]">
                              <p className="text-xs text-[var(--text-muted)] uppercase">Data</p>
                              <p className="font-bold text-[var(--text-primary)]">{selectedDate?.toLocaleDateString()}</p>
                          </div>
                          <div className="text-center bg-[var(--bg-secondary)] p-2 rounded-md border border-[var(--border-color)] min-w-[80px]">
                              <p className="text-xs text-[var(--text-muted)] uppercase">Hora</p>
                              <p className="font-bold text-[var(--text-primary)]">{selectedTime}</p>
                          </div>
                       </div>

                       <BookingForm 
                         onSubmit={handleSubmit} 
                         loading={loading}
                         selectedDate={selectedDate}
                         selectedTime={selectedTime}
                         validateEmail={validateEmail}
                         validatePhone={validatePhone}
                       />
                    </motion.div>
                 )}
              </AnimatePresence>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PublicBookingPage;
