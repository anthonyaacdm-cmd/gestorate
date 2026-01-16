
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { useAvailabilities } from '@/hooks/useAvailabilities';
import MainLayout from '@/layouts/MainLayout';
import AvailabilityCard from '@/components/availabilities/AvailabilityCard';
import AvailabilityForm from '@/components/availabilities/AvailabilityForm';
import { Button } from '@/components/ui/button';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter,
  DialogClose
} from '@/components/ui/dialog';
import { Plus, RefreshCw, Clock, Loader2, Edit2, Trash2 } from 'lucide-react';
import { supabase } from '@/lib/customSupabaseClient';
import { useToast } from '@/components/ui/use-toast';

const AvailabilitiesPage = () => {
  const { 
    availabilities, 
    loading, 
    getAvailabilities, 
    createAvailability, 
    updateAvailability, 
    deleteAvailability,
    toggleAvailability
  } = useAvailabilities();

  const [filter, setFilter] = useState('all');
  const [selectedAvailability, setSelectedAvailability] = useState(null);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isDeleteAlertOpen, setIsDeleteAlertOpen] = useState(false);
  const [availabilityToEdit, setAvailabilityToEdit] = useState(null);
  const { toast } = useToast();

  const days = [
    'Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado'
  ];

  useEffect(() => {
    getAvailabilities();
    
    // Real-time subscription
    const channel = supabase
      .channel('public:availabilities')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'availabilities' }, (payload) => {
        getAvailabilities();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [getAvailabilities]);

  const filteredAvailabilities = availabilities.filter(avail => {
    if (filter === 'all') return true;
    if (filter === 'active') return avail.active === true;
    if (filter === 'inactive') return avail.active === false;
    return true;
  });

  const handleCreateClick = () => {
    setAvailabilityToEdit(null);
    setIsFormModalOpen(true);
  };

  const handleEditClick = (availability) => {
    setAvailabilityToEdit(availability);
    setIsFormModalOpen(true);
  };

  const handleDeleteClick = (availability) => {
    setSelectedAvailability(availability);
    setIsDeleteAlertOpen(true);
  };

  const handleToggleClick = async (availability) => {
    const result = await toggleAvailability(availability.id, availability.active);
    if (result.success) {
      toast({
        title: !availability.active ? "Disponibilidade ativada" : "Disponibilidade desativada",
        description: "Status atualizado com sucesso no Gestorate.",
        className: "bg-green-50 border-green-200"
      });
    }
  };

  const confirmDelete = async () => {
    if (!selectedAvailability) return;
    
    const result = await deleteAvailability(selectedAvailability.id);
    if (result.success) {
      toast({
        title: "Disponibilidade removida",
        description: "O registro foi deletado com sucesso no Gestorate."
      });
    }
    setIsDeleteAlertOpen(false);
    setSelectedAvailability(null);
  };

  const handleFormSubmit = async (data) => {
    let result;
    if (availabilityToEdit) {
      result = await updateAvailability(availabilityToEdit.id, data);
    } else {
      result = await createAvailability(data);
    }

    if (result.success) {
      toast({
        title: availabilityToEdit ? "Disponibilidade atualizada" : "Disponibilidade criada",
        description: "Operação realizada com sucesso no Gestorate.",
        className: "bg-green-50 border-green-200"
      });
      setIsFormModalOpen(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Disponibilidades - Gestorate</title>
        <meta name="description" content="Configure seus horários de atendimento semanal no Gestorate." />
      </Helmet>
      
      <MainLayout>
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Minha Disponibilidade</h1>
              <p className="text-gray-600 mt-1">Configure seus horários de atendimento semanal</p>
            </div>
            <Button onClick={handleCreateClick} className="bg-[#C94B6D] hover:bg-[#A63D5A] text-white">
              <Plus className="mr-2 h-4 w-4" /> Nova Disponibilidade
            </Button>
          </div>

          {/* Filters & Actions */}
          <div className="flex flex-wrap gap-2 mb-6 items-center">
            <div className="bg-white p-1 rounded-lg border border-gray-200 flex gap-1">
              {['all', 'active', 'inactive'].map((status) => (
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
                   status === 'active' ? 'Ativos' : 'Inativos'}
                </button>
              ))}
            </div>
            
            <Button variant="ghost" size="icon" onClick={() => getAvailabilities()} className="ml-auto" title="Atualizar">
                <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            </Button>
          </div>

          {/* Content */}
          {loading && availabilities.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20">
               <Loader2 className="h-10 w-10 animate-spin text-[#C94B6D] mb-4" />
               <p className="text-gray-500">Carregando disponibilidades...</p>
            </div>
          ) : filteredAvailabilities.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-2xl shadow-sm border border-gray-100">
               <div className="bg-gray-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Clock className="h-8 w-8 text-gray-400" />
               </div>
               <h3 className="text-lg font-medium text-gray-900">Nenhuma disponibilidade encontrada</h3>
               <p className="text-gray-500 max-w-sm mx-auto mt-2 mb-6">
                 {filter !== 'all' 
                    ? `Você não tem registros com status "${filter === 'active' ? 'Ativo' : 'Inativo'}".` 
                    : "Você ainda não configurou seus horários de atendimento no Gestorate."}
               </p>
               {filter === 'all' && (
                  <Button onClick={handleCreateClick} variant="outline" className="border-[#C94B6D] text-[#C94B6D] hover:bg-pink-50">
                    Criar agora
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
                                <th className="p-4">Dia da Semana</th>
                                <th className="p-4">Horário Início</th>
                                <th className="p-4">Horário Fim</th>
                                <th className="p-4">Status</th>
                                <th className="p-4 text-right">Ações</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {filteredAvailabilities.map((avail) => (
                                <tr key={avail.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="p-4 font-medium text-gray-900">
                                        {days[avail.day_of_week]}
                                    </td>
                                    <td className="p-4 text-gray-600">{avail.start_time.slice(0, 5)}</td>
                                    <td className="p-4 text-gray-600">{avail.end_time.slice(0, 5)}</td>
                                    <td className="p-4">
                                        <button 
                                          onClick={() => handleToggleClick(avail)}
                                          className={`px-3 py-1 rounded-full text-xs font-medium cursor-pointer transition-colors ${
                                            avail.active 
                                              ? 'bg-green-100 text-green-800 hover:bg-green-200' 
                                              : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                                          }`}
                                        >
                                            {avail.active ? 'Ativo' : 'Inativo'}
                                        </button>
                                    </td>
                                    <td className="p-4 text-right space-x-2">
                                        <Button variant="ghost" size="sm" onClick={() => handleEditClick(avail)}>
                                            <Edit2 size={16} />
                                        </Button>
                                        <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-700 hover:bg-red-50" onClick={() => handleDeleteClick(avail)}>
                                            <Trash2 size={16} />
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Mobile Cards View */}
                <div className="md:hidden">
                    {filteredAvailabilities.map(avail => (
                        <AvailabilityCard 
                            key={avail.id} 
                            availability={avail} 
                            onEdit={handleEditClick}
                            onDelete={handleDeleteClick}
                            onToggle={() => handleToggleClick(avail)}
                        />
                    ))}
                </div>
            </>
          )}
        </div>
      </MainLayout>

      {/* Modals */}
      <Dialog open={isFormModalOpen} onOpenChange={setIsFormModalOpen}>
        <DialogContent className="max-w-lg">
            <DialogHeader>
                <DialogTitle>{availabilityToEdit ? 'Editar Disponibilidade' : 'Nova Disponibilidade'}</DialogTitle>
                <DialogDescription>Defina o dia e os horários que você estará disponível para atendimento no Gestorate.</DialogDescription>
            </DialogHeader>
            <AvailabilityForm 
                availability={availabilityToEdit} 
                onSuccess={() => setIsFormModalOpen(false)}
                onCancel={() => setIsFormModalOpen(false)}
                onSubmit={handleFormSubmit}
            />
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog (Replaced AlertDialog with Dialog) */}
      <Dialog open={isDeleteAlertOpen} onOpenChange={setIsDeleteAlertOpen}>
        <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
                <DialogTitle>Excluir Disponibilidade?</DialogTitle>
                <DialogDescription>
                    Tem certeza que deseja deletar esta disponibilidade? Esta ação não pode ser desfeita.
                </DialogDescription>
            </DialogHeader>
            <DialogFooter>
                <Button variant="outline" onClick={() => setIsDeleteAlertOpen(false)}>Cancelar</Button>
                <Button variant="destructive" onClick={confirmDelete} className="bg-red-600 hover:bg-red-700">
                    Sim, Excluir
                </Button>
            </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AvailabilitiesPage;
