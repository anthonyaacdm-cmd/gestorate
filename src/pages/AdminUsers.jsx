import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { useAuth } from '@/context/AuthContext';
import { getAllUsers, updateUser, deleteUser } from '@/services/userService';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Modal } from '@/components/ui/modal';
import { useToast } from '@/components/ui/use-toast';
import MainLayout from '@/layouts/MainLayout';
import { Search, Edit2, Trash2, User } from 'lucide-react';
import { motion } from 'framer-motion';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [editModal, setEditModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [editData, setEditData] = useState({});
  const { user: currentUser } = useAuth();
  const { toast } = useToast();

  const isMaster = currentUser?.role === 'master';

  useEffect(() => {
    loadUsers();
  }, []);

  useEffect(() => {
    filterUsers();
  }, [searchTerm, users]);

  const loadUsers = async () => {
    setLoading(true);
    const { data, error } = await getAllUsers();
    setLoading(false);
    
    if (error) {
      toast({
        title: 'Erro ao carregar usuários',
        description: error,
        variant: 'destructive',
      });
      return;
    }
    
    setUsers(data || []);
  };

  const filterUsers = () => {
    if (!searchTerm) {
      setFilteredUsers(users);
      return;
    }
    
    const filtered = users.filter(
      (user) =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredUsers(filtered);
  };

  const handleEdit = (user) => {
    setSelectedUser(user);
    setEditData({
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
    });
    setEditModal(true);
  };

  const handleSaveEdit = async () => {
    const { error } = await updateUser(selectedUser.id, editData);
    
    if (error) {
      toast({
        title: 'Erro ao atualizar',
        description: error,
        variant: 'destructive',
      });
      return;
    }
    
    toast({
      title: 'Usuário atualizado!',
      description: 'As informações foram atualizadas com sucesso.',
    });
    
    setEditModal(false);
    setSelectedUser(null);
    loadUsers();
  };

  const handleDelete = async (userId, userName) => {
    if (!window.confirm(`Tem certeza que deseja excluir ${userName}?`)) {
      return;
    }
    
    const { error } = await deleteUser(userId);
    
    if (error) {
      toast({
        title: 'Erro ao excluir',
        description: error,
        variant: 'destructive',
      });
      return;
    }
    
    toast({
      title: 'Usuário excluído',
      description: `${userName} foi removido do sistema.`,
    });
    
    loadUsers();
  };

  const canEdit = (user) => {
    if (isMaster) return true;
    return user.role === 'user';
  };

  const canDelete = (user) => {
    if (!isMaster) return false;
    return user.id !== currentUser.id;
  };

  return (
    <>
      <Helmet>
        <title>Usuários - Admin</title>
        <meta name="description" content="Gerencie usuários do sistema." />
      </Helmet>
      
      <MainLayout>
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Gerenciar Usuários</h1>
            <p className="text-gray-600 mt-1">Visualize e edite informações dos usuários</p>
          </div>
          
          <Card>
            <CardContent className="p-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <Input
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Buscar por nome ou e-mail..."
                  className="pl-10"
                />
              </div>
            </CardContent>
          </Card>
          
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#C94B6D]"></div>
            </div>
          ) : filteredUsers.length === 0 ? (
            <Card>
              <CardContent className="py-12">
                <div className="text-center">
                  <User size={48} className="mx-auto text-gray-400 mb-4" />
                  <p className="text-gray-600 text-lg">Nenhum usuário encontrado</p>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {filteredUsers.map((user, index) => (
                <motion.div
                  key={user.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                >
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-gray-900">{user.name}</h3>
                          <p className="text-sm text-gray-600">{user.email}</p>
                          <p className="text-sm text-gray-600">{user.phone}</p>
                          <div className="mt-2">
                            <span
                              className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                                user.role === 'master'
                                  ? 'bg-purple-100 text-purple-800'
                                  : user.role === 'admin'
                                  ? 'bg-blue-100 text-blue-800'
                                  : 'bg-gray-100 text-gray-800'
                              }`}
                            >
                              {user.role === 'master'
                                ? 'Master'
                                : user.role === 'admin'
                                ? 'Admin'
                                : 'Usuário'}
                            </span>
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          {canEdit(user) && (
                            <Button
                              onClick={() => handleEdit(user)}
                              className="bg-blue-500 hover:bg-blue-600 text-white"
                            >
                              <Edit2 size={18} />
                            </Button>
                          )}
                          {canDelete(user) && (
                            <Button
                              onClick={() => handleDelete(user.id, user.name)}
                              className="bg-red-500 hover:bg-red-600 text-white"
                            >
                              <Trash2 size={18} />
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </div>
        
        <Modal
          isOpen={editModal}
          onClose={() => {
            setEditModal(false);
            setSelectedUser(null);
          }}
          title="Editar Usuário"
        >
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Nome</label>
              <Input
                value={editData.name || ''}
                onChange={(e) => setEditData({ ...editData, name: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">E-mail</label>
              <Input
                value={editData.email || ''}
                onChange={(e) => setEditData({ ...editData, email: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Telefone</label>
              <Input
                value={editData.phone || ''}
                onChange={(e) => setEditData({ ...editData, phone: e.target.value })}
              />
            </div>
            {isMaster && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Função</label>
                <Select
                  value={editData.role || 'user'}
                  onChange={(e) => setEditData({ ...editData, role: e.target.value })}
                >
                  <option value="user">Usuário</option>
                  <option value="admin">Admin</option>
                  <option value="master">Master</option>
                </Select>
              </div>
            )}
            <Button
              onClick={handleSaveEdit}
              className="w-full bg-[#C94B6D] hover:bg-[#A63D5A] text-white"
            >
              Salvar Alterações
            </Button>
          </div>
        </Modal>
      </MainLayout>
    </>
  );
};

export default AdminUsers;