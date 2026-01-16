
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { useUsers } from '@/hooks/useUsers';
import MainLayout from '@/layouts/MainLayout';
import UserCard from '@/components/users/UserCard';
import UserModal from '@/components/users/UserModal';
import UserForm from '@/components/users/UserForm';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
import { Plus, RefreshCw, Loader2, Edit2, Trash2, Search, Filter } from 'lucide-react';
import { supabase } from '@/lib/customSupabaseClient';
import { useToast } from '@/components/ui/use-toast';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const AdminUsersPage = () => {
  const { 
    users, 
    loading, 
    error, 
    getUsers, 
    createUser, 
    updateUser, 
    deleteUser,
    toggleUserStatus,
    setUsers
  } = useUsers();

  const [filterRole, setFilterRole] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isDeleteAlertOpen, setIsDeleteAlertOpen] = useState(false);
  const [userToEdit, setUserToEdit] = useState(null);
  const { toast } = useToast();

  useEffect(() => {
    getUsers();
    
    // Real-time subscription
    const channel = supabase
      .channel('public:users')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'users' }, (payload) => {
        getUsers();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [getUsers]);

  const filteredUsers = users.filter(user => {
    const matchesRole = filterRole === 'all' || user.role === filterRole;
    
    let matchesStatus = true;
    if (filterStatus === 'active') matchesStatus = user.active === true;
    if (filterStatus === 'inactive') matchesStatus = user.active === false;

    const matchesSearch = 
        user.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
        user.email?.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesRole && matchesStatus && matchesSearch;
  });

  const handleCreateClick = () => {
    setUserToEdit(null);
    setIsFormModalOpen(true);
  };

  const handleEditClick = (user) => {
    setUserToEdit(user);
    setIsDetailModalOpen(false);
    setIsFormModalOpen(true);
  };

  const handleDeleteClick = (user) => {
    setSelectedUser(user);
    setIsDetailModalOpen(false);
    setIsDeleteAlertOpen(true);
  };

  const handleToggleClick = async (user) => {
    const result = await toggleUserStatus(user);
    if (result.success) {
      toast({
        title: !user.active ? "Usuário ativado" : "Usuário desativado",
        description: "Status atualizado com sucesso.",
        className: "bg-green-50 border-green-200"
      });
    }
  };

  const confirmDelete = async () => {
    if (!selectedUser) return;
    
    const result = await deleteUser(selectedUser.id);
    if (result.success) {
      toast({
        title: "Usuário removido",
        description: "O registro foi deletado com sucesso."
      });
    }
    setIsDeleteAlertOpen(false);
    setSelectedUser(null);
  };

  const handleFormSubmit = async (data) => {
    let result;
    if (userToEdit) {
      result = await updateUser(userToEdit.id, data);
    } else {
      result = await createUser(data);
    }

    if (result.success) {
      toast({
        title: userToEdit ? "Usuário atualizado" : "Usuário criado",
        description: "Operação realizada com sucesso pelo Gestorate.",
        className: "bg-green-50 border-green-200"
      });
      setIsFormModalOpen(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Gerenciar Usuários - Gestorate</title>
        <meta name="description" content="Administre os usuários do sistema Gestorate, suas permissões e status." />
      </Helmet>
      
      <MainLayout>
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Gerenciar Usuários</h1>
              <p className="text-gray-600 mt-1">Administre os usuários do sistema, suas permissões e status.</p>
            </div>
            <Button onClick={handleCreateClick} className="bg-[#C94B6D] hover:bg-[#A63D5A] text-white">
              <Plus className="mr-2 h-4 w-4" /> Novo Usuário
            </Button>
          </div>

          {/* Filters & Search */}
          <div className="flex flex-col md:flex-row gap-4 mb-6 items-center justify-between bg-white p-4 rounded-lg shadow-sm border border-gray-100">
             <div className="relative w-full md:w-96">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <Input 
                   placeholder="Buscar por nome ou e-mail..." 
                   value={searchTerm}
                   onChange={(e) => setSearchTerm(e.target.value)}
                   className="pl-10"
                />
             </div>

             <div className="flex flex-wrap gap-3 w-full md:w-auto items-center">
                <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-gray-500">Função:</span>
                    <div className="bg-gray-100 p-1 rounded-lg flex">
                        {['all', 'admin', 'user'].map((role) => (
                            <button
                                key={role}
                                onClick={() => setFilterRole(role)}
                                className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                                    filterRole === role
                                    ? 'bg-white text-gray-900 shadow-sm'
                                    : 'text-gray-600 hover:text-gray-900'
                                }`}
                            >
                                {role === 'all' ? 'Todos' : role === 'admin' ? 'Admin' : 'Usuário'}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-gray-500">Status:</span>
                    <div className="bg-gray-100 p-1 rounded-lg flex">
                        {['all', 'active', 'inactive'].map((status) => (
                            <button
                                key={status}
                                onClick={() => setFilterStatus(status)}
                                className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                                    filterStatus === status
                                    ? 'bg-white text-gray-900 shadow-sm'
                                    : 'text-gray-600 hover:text-gray-900'
                                }`}
                            >
                                {status === 'all' ? 'Todos' : status === 'active' ? 'Ativo' : 'Inativo'}
                            </button>
                        ))}
                    </div>
                </div>
                
                <Button variant="ghost" size="icon" onClick={() => getUsers()} title="Atualizar">
                    <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                </Button>
             </div>
          </div>

          {/* Content */}
          {loading && users.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20">
               <Loader2 className="h-10 w-10 animate-spin text-[#C94B6D] mb-4" />
               <p className="text-gray-500">Carregando usuários...</p>
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-2xl shadow-sm border border-gray-100">
               <p className="text-gray-500">Nenhum usuário encontrado com os filtros selecionados.</p>
            </div>
          ) : (
            <>
                {/* Desktop Table View */}
                <div className="hidden md:block bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50 border-b border-gray-200 text-xs uppercase text-gray-500 font-semibold">
                                <th className="p-4">Nome / E-mail</th>
                                <th className="p-4">Telefone</th>
                                <th className="p-4">Função</th>
                                <th className="p-4">Status</th>
                                <th className="p-4">Criado em</th>
                                <th className="p-4 text-right">Ações</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {filteredUsers.map((user, index) => (
                                <tr key={user.id} className={`hover:bg-gray-50 transition-colors ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}`}>
                                    <td className="p-4">
                                        <div className="flex flex-col">
                                            <span className="font-medium text-gray-900">{user.name}</span>
                                            <span className="text-sm text-gray-500">{user.email}</span>
                                        </div>
                                    </td>
                                    <td className="p-4 text-gray-600">{user.phone || '-'}</td>
                                    <td className="p-4">
                                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                            user.role === 'admin' || user.role === 'master' 
                                            ? 'bg-red-100 text-red-800' 
                                            : 'bg-blue-100 text-blue-800'
                                        }`}>
                                            {user.role}
                                        </span>
                                    </td>
                                    <td className="p-4">
                                        <button 
                                          onClick={() => handleToggleClick(user)}
                                          className={`px-3 py-1 rounded-full text-xs font-medium cursor-pointer transition-colors ${
                                            user.active 
                                              ? 'bg-green-100 text-green-800 hover:bg-green-200' 
                                              : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                                          }`}
                                        >
                                            {user.active ? 'Ativo' : 'Inativo'}
                                        </button>
                                    </td>
                                    <td className="p-4 text-sm text-gray-600">
                                        {user.created_at ? format(new Date(user.created_at), "dd/MM/yyyy", { locale: ptBR }) : '-'}
                                    </td>
                                    <td className="p-4 text-right space-x-2">
                                        <Button variant="ghost" size="sm" onClick={() => handleEditClick(user)}>
                                            <Edit2 size={16} />
                                        </Button>
                                        <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-700 hover:bg-red-50" onClick={() => handleDeleteClick(user)}>
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
                    {filteredUsers.map(user => (
                        <UserCard 
                            key={user.id} 
                            user={user} 
                            onEdit={handleEditClick}
                            onDelete={handleDeleteClick}
                            onToggle={handleToggleClick}
                        />
                    ))}
                </div>
            </>
          )}
        </div>
      </MainLayout>

      {/* Modals */}
      <UserModal
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        user={selectedUser}
        onEdit={handleEditClick}
        onDelete={handleDeleteClick}
      />

      <Dialog open={isFormModalOpen} onOpenChange={setIsFormModalOpen}>
        <DialogContent className="max-w-lg">
            <DialogHeader>
                <DialogTitle>{userToEdit ? 'Editar Usuário' : 'Novo Usuário'}</DialogTitle>
                <DialogDescription>
                    {userToEdit ? 'Atualize as informações do usuário.' : 'Preencha os dados para criar um novo usuário.'}
                </DialogDescription>
            </DialogHeader>
            <UserForm 
                user={userToEdit} 
                onSuccess={() => setIsFormModalOpen(false)}
                onCancel={() => setIsFormModalOpen(false)}
                onSubmit={handleFormSubmit}
            />
        </DialogContent>
      </Dialog>

      <AlertDialog open={isDeleteAlertOpen} onOpenChange={setIsDeleteAlertOpen}>
        <AlertDialogContent>
            <AlertDialogHeader>
                <AlertDialogTitle>Excluir Usuário?</AlertDialogTitle>
                <AlertDialogDescription>
                    Tem certeza que deseja deletar este usuário? 
                    <br/><br/>
                    <span className="font-bold text-red-600">Atenção:</span> Todos os agendamentos e notificações relacionados a este usuário também serão permanentemente excluídos.
                </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                <AlertDialogAction onClick={confirmDelete} className="bg-red-600 hover:bg-red-700">
                    Sim, Excluir
                </AlertDialogAction>
            </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default AdminUsersPage;
