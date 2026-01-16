
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { useAuth } from '@/context/AuthContext';
import { getPendingAppointments, confirmAppointment, cancelAppointment } from '@/services/appointmentService';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Modal } from '@/components/ui/modal';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import MainLayout from '@/layouts/MainLayout';
import { Calendar, Clock, FileText, User, Phone, Mail, CheckCircle, XCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const AdminConfirm = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancelModal, setCancelModal] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [cancelReason, setCancelReason] = useState('');
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    loadPendingAppointments();
    
    // Set up real-time listener (simulated with interval for now)
    const interval = setInterval(loadPendingAppointments, 30000);
    return () => clearInterval(interval);
  }, []);

  const loadPendingAppointments = async () => {
    setLoading(true);
    const { data, error } = await getPendingAppointments();
    setLoading(false);
    
    if (error) {
      toast({
        title: 'Erro ao carregar agendamentos',
        description: error,
        variant: 'destructive',
      });
      return;
    }
    
    setAppointments(data || []);
  };

  const handleConfirm = async (appointmentId) => {
    const { data, error } = await confirmAppointment(appointmentId);
    
    if (error) {
      toast({
        title: 'Erro ao confirmar',
        description: error,
        variant: 'destructive',
      });
      return;
    }
    
    toast({
      title: 'Agendamento confirmado!',
      description: 'WhatsApp enviado ao paciente pelo Gestorate.',
    });
    
    // Simulate WhatsApp notification
    console.log('WhatsApp: Sua consulta foi confirmada');
    
    loadPendingAppointments();
  };

  const handleCancelClick = (appointment) => {
    setSelectedAppointment(appointment);
    setCancelModal(true);
  };

  const handleCancelConfirm = async () => {
    if (!cancelReason) {
      toast({
        title: 'Motivo obrigatório',
        description: 'Por favor, informe o motivo do cancelamento.',
        variant: 'destructive',
      });
      return;
    }
    
    const { data, error } = await cancelAppointment(selectedAppointment.id);
    
    if (error) {
      toast({
        title: 'Erro ao cancelar',
        description: error,
        variant: 'destructive',
      });
      return;
    }
    
    toast({
      title: 'Agendamento cancelado',
      description: 'WhatsApp enviado ao paciente pelo Gestorate.',
    });
    
    // Simulate WhatsApp notification
    console.log(`WhatsApp: Sua consulta foi cancelada. Motivo: ${cancelReason}`);
    
    setCancelModal(false);
    setCancelReason('');
    setSelectedAppointment(null);
    loadPendingAppointments();
  };

  return (
    <>
      <Helmet>
        <title>Confirmar Agendamentos - Gestorate</title>
        <meta name="description" content="Gerencie agendamentos pendentes no Gestorate." />
      </Helmet>
      
      <MainLayout>
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Agendamentos Pendentes</h1>
            <p className="text-gray-600 mt-1">Confirme ou cancele agendamentos</p>
          </div>
          
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#C94B6D]"></div>
            </div>
          ) : appointments.length === 0 ? (
            <Card>
              <CardContent className="py-12">
                <div className="text-center">
                  <CheckCircle size={48} className="mx-auto text-gray-400 mb-4" />
                  <p className="text-gray-600 text-lg">Nenhum agendamento pendente</p>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {appointments.map((appointment, index) => (
                <motion.div
                  key={appointment.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-xl">Novo Agendamento</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-3">
                        <div className="flex items-center space-x-3 text-gray-700">
                          <User size={18} className="text-[#C94B6D]" />
                          <span className="font-medium">{appointment.users?.name}</span>
                        </div>
                        <div className="flex items-center space-x-3 text-gray-700">
                          <Phone size={18} className="text-[#C94B6D]" />
                          <span>{appointment.users?.phone}</span>
                        </div>
                        <div className="flex items-center space-x-3 text-gray-700">
                          <Mail size={18} className="text-[#C94B6D]" />
                          <span>{appointment.users?.email}</span>
                        </div>
                        <div className="flex items-center space-x-3 text-gray-700">
                          <Calendar size={18} className="text-[#C94B6D]" />
                          <span>
                            {format(new Date(appointment.date + 'T00:00:00'), "dd 'de' MMMM 'de' yyyy", {
                              locale: ptBR,
                            })}
                          </span>
                        </div>
                        <div className="flex items-center space-x-3 text-gray-700">
                          <Clock size={18} className="text-[#C94B6D]" />
                          <span>{appointment.time}</span>
                        </div>
                        <div className="flex items-center space-x-3 text-gray-700">
                          <FileText size={18} className="text-[#C94B6D]" />
                          <span>{appointment.exam_type}</span>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-3 pt-4 border-t">
                        <Button
                          onClick={() => handleConfirm(appointment.id)}
                          className="bg-green-500 hover:bg-green-600 text-white flex items-center justify-center space-x-2"
                        >
                          <CheckCircle size={18} />
                          <span>Confirmar</span>
                        </Button>
                        <Button
                          onClick={() => handleCancelClick(appointment)}
                          className="bg-red-500 hover:bg-red-600 text-white flex items-center justify-center space-x-2"
                        >
                          <XCircle size={18} />
                          <span>Cancelar</span>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </div>
        
        <Modal
          isOpen={cancelModal}
          onClose={() => {
            setCancelModal(false);
            setCancelReason('');
            setSelectedAppointment(null);
          }}
          title="Cancelar Agendamento"
        >
          <div className="space-y-4">
            <p className="text-gray-600">
              Informe o motivo do cancelamento para o paciente:
            </p>
            <Input
              value={cancelReason}
              onChange={(e) => setCancelReason(e.target.value)}
              placeholder="Motivo do cancelamento"
            />
            <div className="flex space-x-3">
              <Button
                onClick={handleCancelConfirm}
                className="flex-1 bg-red-500 hover:bg-red-600 text-white"
              >
                Confirmar Cancelamento
              </Button>
              <Button
                onClick={() => {
                  setCancelModal(false);
                  setCancelReason('');
                  setSelectedAppointment(null);
                }}
                className="flex-1 bg-gray-500 hover:bg-gray-600 text-white"
              >
                Voltar
              </Button>
            </div>
          </div>
        </Modal>
      </MainLayout>
    </>
  );
};

export default AdminConfirm;
