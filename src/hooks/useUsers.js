
import { useState, useCallback } from 'react';
import { useAuth } from '@/context/AuthContext';
import { 
  getAllUsers, 
  getUserById, 
  createUser as createUserService, 
  updateUser as updateUserService, 
  deleteUserCascade,
  toggleUserStatus as toggleUserStatusService
} from '@/services/userService';
import { useToast } from '@/components/ui/use-toast';

export const useUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { user: currentUser } = useAuth();
  const { toast } = useToast();

  const isAdmin = currentUser?.role === 'admin' || currentUser?.role === 'master';

  const getUsers = useCallback(async () => {
    if (!isAdmin) return;
    
    setLoading(true);
    setError(null);
    try {
      const { data, error: apiError } = await getAllUsers();
      if (apiError) throw new Error(apiError);
      setUsers(data || []);
    } catch (err) {
      setError(err.message);
      toast({
        title: "Erro ao carregar usuários",
        description: err.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  }, [isAdmin, toast]);

  const createUser = async (userData) => {
    if (!isAdmin) return { success: false, error: 'Unauthorized' };
    
    setLoading(true);
    try {
      const { data, error: apiError } = await createUserService(userData);
      if (apiError) throw new Error(apiError);
      
      setUsers(prev => [data, ...prev]);
      return { success: true, data };
    } catch (err) {
      toast({
        title: "Erro ao criar usuário",
        description: err.message,
        variant: "destructive"
      });
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  const updateUser = async (id, updates) => {
    if (!isAdmin) return { success: false, error: 'Unauthorized' };

    setLoading(true);
    try {
      const { data, error: apiError } = await updateUserService(id, updates);
      if (apiError) throw new Error(apiError);

      setUsers(prev => prev.map(u => u.id === id ? data : u));
      return { success: true, data };
    } catch (err) {
      toast({
        title: "Erro ao atualizar usuário",
        description: err.message,
        variant: "destructive"
      });
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  const deleteUser = async (id) => {
    if (!isAdmin) return { success: false, error: 'Unauthorized' };

    try {
      const { error: apiError } = await deleteUserCascade(id);
      if (apiError) throw new Error(apiError);

      setUsers(prev => prev.filter(u => u.id !== id));
      return { success: true };
    } catch (err) {
      toast({
        title: "Erro ao deletar usuário",
        description: err.message,
        variant: "destructive"
      });
      return { success: false, error: err.message };
    }
  };

  const toggleUserStatus = async (userToToggle) => {
    if (!isAdmin) return { success: false, error: 'Unauthorized' };

    // Optimistic update
    setUsers(prev => prev.map(u => u.id === userToToggle.id ? { ...u, active: !u.active } : u));

    try {
      const { error: apiError } = await toggleUserStatusService(userToToggle.id, userToToggle.active);
      if (apiError) throw new Error(apiError);
      
      return { success: true };
    } catch (err) {
      // Revert on error
      setUsers(prev => prev.map(u => u.id === userToToggle.id ? { ...u, active: userToToggle.active } : u));
      
      toast({
        title: "Erro ao alterar status",
        description: err.message,
        variant: "destructive"
      });
      return { success: false, error: err.message };
    }
  };

  return {
    users,
    loading,
    error,
    getUsers,
    createUser,
    updateUser,
    deleteUser,
    toggleUserStatus,
    setUsers
  };
};
