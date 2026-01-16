
import React, { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/components/ui/use-toast';

const AdminRoute = ({ children }) => {
  const { user, loading } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (!loading && user) {
      const isAdmin = user.role === 'admin' || user.role === 'master';
      if (!isAdmin) {
        toast({
          title: "Acesso negado",
          description: "Apenas administradores podem acessar esta página.",
          variant: "destructive"
        });
      }
    }
  }, [user, loading, toast]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 to-purple-50">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-[#C94B6D]"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/" replace />;
  }

  const isAdmin = user.role === 'admin' || user.role === 'master';
  if (!isAdmin) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export default AdminRoute;
