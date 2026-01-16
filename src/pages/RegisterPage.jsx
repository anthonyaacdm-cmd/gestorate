
import React, { useState, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { useAuth } from '@/context/AuthContext';
import { validateEmail, validatePassword, validateCPF, validatePhone, formatCPF, formatPhone, formatCEP } from '@/utils/validation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import AuthLayout from '@/layouts/AuthLayout';
import { User, Mail, Lock, Phone, MapPin, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    cpf: '',
    bairro: '',
    cep: '',
    cidade: '',
    estado: '',
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Ref for throttling requests
  const lastSubmitTime = useRef(0);
  
  const navigate = useNavigate();
  const { signup, login } = useAuth();
  const { toast } = useToast();

  const handleChange = (e) => {
    const { name, value } = e.target;
    let formattedValue = value;
    
    if (name === 'cpf') {
      formattedValue = formatCPF(value);
    } else if (name === 'phone') {
      formattedValue = formatPhone(value);
    } else if (name === 'cep') {
      formattedValue = formatCEP(value);
    }
    
    setFormData((prev) => ({ ...prev, [name]: formattedValue }));
  };

  const validate = () => {
    const newErrors = {};
    
    if (!formData.name) newErrors.name = 'Nome é obrigatório';
    
    if (!formData.email) {
      newErrors.email = 'E-mail é obrigatório';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'E-mail inválido';
    }
    
    const passwordValidation = validatePassword(formData.password);
    if (!passwordValidation.valid) {
      newErrors.password = passwordValidation.message;
    }
    
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'As senhas não coincidem';
    }
    
    if (!formData.phone) {
      newErrors.phone = 'Telefone é obrigatório';
    } else if (!validatePhone(formData.phone)) {
      newErrors.phone = 'Telefone inválido';
    }
    
    if (!formData.cpf) {
      newErrors.cpf = 'CPF é obrigatório';
    } else if (!validateCPF(formData.cpf)) {
      newErrors.cpf = 'CPF inválido';
    }
    
    if (!formData.bairro) newErrors.bairro = 'Bairro é obrigatório';
    if (!formData.cep) newErrors.cep = 'CEP é obrigatório';
    if (!formData.cidade) newErrors.cidade = 'Cidade é obrigatória';
    if (!formData.estado) newErrors.estado = 'Estado é obrigatório';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Client-side throttling (2 seconds)
    const now = Date.now();
    if (now - lastSubmitTime.current < 2000) {
      return; 
    }
    lastSubmitTime.current = now;

    if (!validate()) return;
    
    setIsSubmitting(true);
    
    try {
      // 1. Call signup from context
      const { user, session, error } = await signup(formData);
      
      if (error) {
        setIsSubmitting(false);
        toast({
          title: 'Erro ao criar conta no Gestorate',
          description: error,
          variant: 'destructive',
        });
        return;
      }
      
      // 2. If no session returned (Email Confirmation Required), prompt user
      if (!session && !user) {
         // This block might be reached if signup requires email confirmation
         setIsSubmitting(false);
         toast({
          title: 'Verifique seu e-mail',
          description: 'Enviamos um link de confirmação para o seu e-mail.',
        });
        navigate('/login');
        return;
      }

      // 3. If we have a session (Auto Confirm), we are logged in.
      // The signup function in authService already handles creating the profile in public.users
      
      toast({
        title: 'Conta criada com sucesso no Gestorate!',
        description: `Bem-vindo(a), ${formData.name}!`,
      });
      navigate('/dashboard');

    } catch (err) {
      setIsSubmitting(false);
      console.error(err);
      toast({
        title: 'Erro inesperado no Gestorate',
        description: 'Ocorreu um erro ao processar sua solicitação.',
        variant: 'destructive',
      });
    }
  };

  return (
    <>
      <Helmet>
        <title>Registro - Gestorate</title>
        <meta name="description" content="Crie sua conta no sistema de agendamentos Gestorate." />
      </Helmet>
      
      <AuthLayout heroImage="https://images.unsplash.com/photo-1533436041693-411c656d1383">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-2xl shadow-2xl p-8 max-h-[90vh] overflow-y-auto"
        >
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Criar Conta Gestorate</h2>
            <p className="text-gray-600">Preencha seus dados para começar</p>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Nome Completo</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <Input
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Seu nome completo"
                  className="pl-10"
                  error={errors.name}
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">E-mail</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <Input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="seu@email.com"
                  className="pl-10"
                  error={errors.email}
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Senha</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                  <Input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="••••••••"
                    className="pl-10"
                    error={errors.password}
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Confirmar Senha</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                  <Input
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="••••••••"
                    className="pl-10"
                    error={errors.confirmPassword}
                  />
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Telefone</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                  <Input
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="(11) 98765-4321"
                    className="pl-10"
                    error={errors.phone}
                    maxLength={15}
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">CPF</label>
                <Input
                  name="cpf"
                  value={formData.cpf}
                  onChange={handleChange}
                  placeholder="000.000.000-00"
                  error={errors.cpf}
                  maxLength={14}
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Bairro</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                  <Input
                    name="bairro"
                    value={formData.bairro}
                    onChange={handleChange}
                    placeholder="Centro"
                    className="pl-10"
                    error={errors.bairro}
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">CEP</label>
                <Input
                  name="cep"
                  value={formData.cep}
                  onChange={handleChange}
                  placeholder="00000-000"
                  error={errors.cep}
                  maxLength={9}
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Cidade</label>
                <Input
                  name="cidade"
                  value={formData.cidade}
                  onChange={handleChange}
                  placeholder="São Paulo"
                  error={errors.cidade}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Estado</label>
                <Input
                  name="estado"
                  value={formData.estado}
                  onChange={handleChange}
                  placeholder="SP"
                  error={errors.estado}
                  maxLength={2}
                />
              </div>
            </div>
            
            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full h-12 bg-[#C94B6D] hover:bg-[#A63D5A] text-white rounded-lg font-medium transition-all transform hover:scale-[1.02] mt-6"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Criando conta...
                </>
              ) : (
                'Criar Conta'
              )}
            </Button>
          </form>
          
          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Já tem uma conta?{' '}
              <Link
                to="/login"
                className="text-[#C94B6D] font-medium hover:text-[#A63D5A] transition-colors"
              >
                Faça login
              </Link>
            </p>
          </div>
        </motion.div>
      </AuthLayout>
    </>
  );
};

export default RegisterPage;
