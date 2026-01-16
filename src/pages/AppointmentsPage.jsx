
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { useAppointments } from '@/hooks/useAppointments';
import MainLayout from '@/layouts/MainLayout';
import AppointmentCard from '@/components/appointments/AppointmentCard';
import AppointmentModal from '@/components/appointments/AppointmentModal';
import AppointmentForm from '@/components/appointments/AppointmentForm';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Plus, Filter, RefreshCw, Calendar as CalendarIcon, Loader2 } from 'lucide-react';
import { supabase } from '@/lib/customSupabaseClient';
import { format } from 'date-fns';
import { useToast } from '@/components/ui/use-toast';

const AppointmentsPage = () => {
  const { 
    appointments, 
    loading, 
    error, 
    getAppointments, 
    createAppointment, 
    updateAppointment, 
    cancelAppointment,
    setAppointments 
  } = useAppointments();

  const [filter, setFilter] = useState('all');
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isCancelAlertOpen, setIsCancelAlertOpen] = useState(false);
  const [appointmentToEdit, setAppointmentToEdit] = useState(null);
  const { toast } = useToast();

  useEffect(() => {
    getAppointments();
    
    // Real-time subscription
    const channel = supabase
      .channel('public:appointments')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'appointments' }, (payload) => {
        // Simple strategy: reload list on any change to ensure consistency
        // A better strategy would be to merge payload.new into state
        getAppointments();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [getAppointments]);

  const filteredAppointments = appointments.filter(app => {
    if (filter === 'all') return true;
    return app.status === filter;
  });

  const handleCardClick = (appointment) => {
    setSelectedAppointment(appointment);
    setIsDetailModalOpen(true);
  };

  const handleCreateClick = () => {
    setAppointmentToEdit(null);
    setIsFormModalOpen(true);
  };

  const handleEditClick = (appointment) => {
    setAppointmentToEdit(appointment);
    setIsDetailModalOpen(false); // Close detail
    setIsFormModalOpen(true); // Open form
  };

  const handleCancelClick = (appointment) => {
    setSelectedAppointment(appointment);
    // If detail is open, keep it open? No, usually confirm on top.
    // Let's close detail to avoid stacking dialogs if desired, or just stack.
    // Stacking works with Radix but can be messy. Let's close detail first.
    setIsDetailModalOpen(false);
    setIsCancelAlertOpen(true);
  };

  const confirmCancel = async () => {
    if (!selectedAppointment) return;
    
    const result = await cancelAppointment(selectedAppointment.id);
    if (result.success) {
      toast({
        title: "Agendamento cancelado",
        description: "O agendamento foi cancelado com sucesso."
      });
    }
    setIsCancelAlertOpen(false);
    setSelectedAppointment(null);
  };

  const handleFormSubmit = async (data) => {
    let result;
    if (appointmentToEdit) {
      result = await updateAppointment(appointmentToEdit.id, data);
    } else {
      result = await createAppointment(data);
    }

    if (result.success) {
      toast({
        title: appointmentToEdit ? "Agendamento atualizado" : "Agendamento criado",
        description: "Operação realizada com sucesso.",
        className: "bg-green-50 border-green-200"
      });
      setIsFormModalOpen(false);
    }
  };

  const statusColors = {
    pending: 'bg-yellow-100 text-yellow-800',
    confirmed: 'bg-green-100 text-green-800',
    canceled: 'bg-red-100 text-red-800'
  };

  return (
    <>
      <Helmet>
        <title>Meus Agendamentos</title>
      </Helmet>
      
      <MainLayout>
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Meus Agendamentos</h1>
              <p className="text-gray-600 mt-1">Gerencie suas consultas e exames</p>
            </div>
            <Button onClick={handleCreateClick} className="bg-[#C94B6D] hover:bg-[#A63D5A] text-white">
              <Plus className="mr-2 h-4 w-4" /> Novo Agendamento
            </Button>
          </div>

          {/* Filters & Actions */}
          <div className="flex flex-wrap gap-2 mb-6 items-center">
            <div className="bg-white p-1 rounded-lg border border-gray-200 flex gap-1">
              {['all', 'pending', 'confirmed', 'canceled'].map((status) => (
                <button
                  key={status}
                  onClick={() => setFilter(status)}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                    filter === status
                      ? 'bg-gray-900 text-white shadow-sm'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  {status === 'all' ? 'Todos' : 
                   status === 'pending' ? 'Pendentes' :
                   status === 'confirmed' ? 'Confirmados' : 'Cancelados'}
                </button>
              ))}
            </div>
            
            <Button variant="ghost" size="icon" onClick={() => getAppointments()} className="ml-auto" title="Atualizar">
                <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            </Button>
          </div>

          {/* Content */}
          {loading && appointments.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20">
               <Loader2 className="h-10 w-10 animate-spin text-[#C94B6D] mb-4" />
               <p className="text-gray-500">Carregando agendamentos...</p>
            </div>
          ) : filteredAppointments.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-2xl shadow-sm border border-gray-100">
               <div className="bg-gray-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CalendarIcon className="h-8 w-8 text-gray-400" />
               </div>
               <h3 className="text-lg font-medium text-gray-900">Nenhum agendamento encontrado</h3>
               <p className="text-gray-500 max-w-sm mx-auto mt-2 mb-6">
                 {filter !== 'all' 
                    ? `Você não tem agendamentos com status "${filter}".` 
                    : "Você ainda não possui agendamentos marcados."}
               </p>
               {filter === 'all' && (
                  <Button onClick={handleCreateClick} variant="outline" className="border-[#C94B6D] text-[#C94B6D] hover:bg-pink-50">
                    Agendar agora
                  </Button>
               )}
            </div>
          ) : (
            <>
                {/* Desktop Table View */}
                <div className="hidden md:block bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50 border-b border-gray-200 text-xs uppercase text-gray-500 font-semibold">
                                <th className="p-4">Data</th>
                                <th className="p-4">Horário</th>
                                <th className="p-4">Descrição</th>
                                <th className="p-4">Status</th>
                                <th className="p-4 text-right">Ações</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {filteredAppointments.map((app) => (
                                <tr key={app.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="p-4 font-medium text-gray-900">
                                        {format(new Date(app.date), "dd/MM/yyyy")}
                                    </td>
                                    <td className="p-4 text-gray-600">{app.time}</td>
                                    <td className="p-4 text-gray-600 max-w-xs truncate">{app.exam_type}</td>
                                    <td className="p-4">
                                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[app.status]}`}>
                                            {app.status === 'pending' ? 'Pendente' : 
                                             app.status === 'confirmed' ? 'Confirmado' : 'Cancelado'}
                                        </span>
                                    </td>
                                    <td className="p-4 text-right space-x-2">
                                        <Button variant="ghost" size="sm" onClick={() => handleCardClick(app)}>
                                            Ver
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Mobile Cards View */}
                <div className="md:hidden">
                    {filteredAppointments.map(app => (
                        <AppointmentCard 
                            key={app.id} 
                            appointment={app} 
                            onClick={handleCardClick}
                        />
                    ))}
                </div>
            </>
          )}
        </div>
      </MainLayout>

      {/* Modals */}
      <AppointmentModal
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        appointment={selectedAppointment}
        onEdit={handleEditClick}
        onCancel={handleCancelClick}
      />

      <Dialog open={isFormModalOpen} onOpenChange={setIsFormModalOpen}>
        <DialogContent className="max-w-lg">
            <DialogHeader>
                <DialogTitle>{appointmentToEdit ? 'Editar Agendamento' : 'Novo Agendamento'}</DialogTitle>
                <DialogDescription>Preencha os dados abaixo para {appointmentToEdit ? 'atualizar' : 'criar'} seu agendamento.</DialogDescription>
            </DialogHeader>
            <AppointmentForm 
                appointment={appointmentToEdit} 
                onSuccess={() => setIsFormModalOpen(false)}
                onCancel={() => setIsFormModalOpen(false)}
                onSubmit={handleFormSubmit}
            />
        </DialogContent>
      </Dialog>

      <AlertDialog open={isCancelAlertOpen} onOpenChange={setIsCancelAlertOpen}>
        <AlertDialogContent>
            <AlertDialogHeader>
                <AlertDialogTitle>Cancelar Agendamento?</AlertDialogTitle>
                <AlertDialogDescription>
                    Você tem certeza que deseja cancelar este agendamento? Esta ação não pode ser desfeita e o horário será liberado para outros usuários.
                </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
                <AlertDialogCancel>Voltar</AlertDialogCancel>
                <AlertDialogAction onClick={confirmCancel} className="bg-red-600 hover:bg-red-700">
                    Sim, Cancelar
                </AlertDialogAction>
            </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default AppointmentsPage;
