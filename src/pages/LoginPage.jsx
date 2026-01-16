
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { useAuth } from '@/context/AuthContext';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { Mail, Lock, Loader2, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();
  const { toast } = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast({
        title: "Campos obrigatórios",
        description: "Por favor, preencha e-mail e senha.",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const { user, error } = await login(email, password);
      
      if (error) {
        // Translate common Supabase errors if needed
        let errorMessage = error;
        if (error.includes('Invalid login credentials')) {
          errorMessage = 'E-mail ou senha inválidos.';
        }

        toast({
          title: "Falha no login - Gestorate",
          description: errorMessage,
          variant: "destructive"
        });
      } else if (user) {
        toast({
          title: "Bem-vindo ao Gestorate!",
          description: "Login realizado com sucesso.",
          className: "bg-green-50 border-green-200 text-green-900"
        });
        navigate('/dashboard');
      }
    } catch (err) {
      toast({
        title: "Erro - Gestorate",
        description: "Ocorreu um erro inesperado. Tente novamente.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Login - Gestorate</title>
        <meta name="description" content="Faça login na sua conta Gestorate para gerenciar seus agendamentos." />
      </Helmet>
      
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50 flex flex-col justify-center items-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8"
        >
          <div className="flex items-center mb-6">
             <Button variant="ghost" size="sm" onClick={() => navigate('/')} className="mr-2 -ml-2">
               <ArrowLeft size={20} />
             </Button>
             <h2 className="text-2xl font-bold text-gray-900">Acessar Conta Gestorate</h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                E-mail
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="seu@email.com"
                  className="pl-10 h-12"
                  autoComplete="email"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Senha
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="pl-10 h-12"
                  autoComplete="current-password"
                />
              </div>
            </div>
            
            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full h-12 bg-[#C94B6D] hover:bg-[#A63D5A] text-white text-lg rounded-lg font-medium transition-all"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Entrando...
                </>
              ) : (
                'Entrar'
              )}
            </Button>
          </form>
          
          <div className="mt-8 pt-6 border-t border-gray-100 text-center text-sm text-gray-500">
             Não tem uma conta? <span className="text-[#C94B6D] cursor-pointer hover:underline" onClick={() => navigate('/register')}>Cadastre-se</span>
          </div>
        </motion.div>
      </div>
    </>
  );
};

export default LoginPage;
