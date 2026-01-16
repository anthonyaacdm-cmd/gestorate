import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { logout } from '@/services/authService';
import { useAuth } from '@/context/AuthContext';

const LogoutPage = () => {
  const navigate = useNavigate();
  const { setUser } = useAuth();

  useEffect(() => {
    const performLogout = async () => {
      await logout();
      setUser(null);
      navigate('/', { replace: true });
    };
    
    performLogout();
  }, [navigate, setUser]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 to-purple-50">
      <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-[#C94B6D]"></div>
    </div>
  );
};

export default LogoutPage;