
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { Calendar, CheckCircle, Clock, ShieldCheck } from 'lucide-react';

const HomePage = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Redirect if already logged in
  if (isAuthenticated) {
    navigate('/dashboard');
    return null;
  }

  return (
    <>
      <Helmet>
        <title>Gestorate - Sistema de Gestão de Agendamentos</title>
        <meta name="description" content="Gestorate: A plataforma completa para agendamento e gestão de serviços." />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-pink-50">
        <header className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex justify-between items-center">
          <div className="text-2xl font-bold text-[#C94B6D]">Gestorate</div>
          <Button 
            onClick={() => navigate('/login')}
            variant="outline"
            className="border-[#C94B6D] text-[#C94B6D] hover:bg-pink-50"
          >
            Fazer Login
          </Button>
        </header>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 leading-tight mb-6">
                Gestorate: Agende seus serviços com <span className="text-[#C94B6D]">facilidade e rapidez</span>.
              </h1>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                Nosso sistema simplificado permite que você gerencie seus horários, confirme presenças e acompanhe seu histórico de serviços em um só lugar.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  onClick={() => navigate('/login')}
                  className="h-14 px-8 text-lg bg-[#C94B6D] hover:bg-[#A63D5A] text-white rounded-full shadow-lg shadow-pink-200"
                >
                  Acessar Sistema
                </Button>
              </div>

              <div className="mt-12 grid grid-cols-2 gap-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-100 rounded-lg text-green-600">
                    <CheckCircle size={24} />
                  </div>
                  <span className="font-medium text-gray-700">Confirmação Instantânea</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
                    <Clock size={24} />
                  </div>
                  <span className="font-medium text-gray-700">Disponibilidade 24/7</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-purple-100 rounded-lg text-purple-600">
                    <Calendar size={24} />
                  </div>
                  <span className="font-medium text-gray-700">Gestão Inteligente</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-orange-100 rounded-lg text-orange-600">
                    <ShieldCheck size={24} />
                  </div>
                  <span className="font-medium text-gray-700">Dados Seguros</span>
                </div>
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-white p-8 rounded-3xl shadow-2xl border border-gray-100 relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-pink-50 rounded-bl-full -mr-8 -mt-8"></div>
              
              <h3 className="text-xl font-bold text-gray-800 mb-6 relative z-10">Acesso Rápido</h3>
              
              <div className="space-y-4">
                 <div className="p-4 rounded-xl bg-gray-50 border border-gray-100 hover:border-pink-200 transition-colors cursor-pointer group" onClick={() => navigate('/login')}>
                    <div className="flex justify-between items-center mb-1">
                       <span className="font-semibold text-gray-900 group-hover:text-[#C94B6D]">Login de Paciente/Cliente</span>
                       <span className="text-xs bg-white px-2 py-1 rounded border text-gray-500">Acessar</span>
                    </div>
                    <p className="text-sm text-gray-500">Visualize seus agendamentos no Gestorate.</p>
                 </div>

                 <div className="p-4 rounded-xl bg-gray-50 border border-gray-100 hover:border-blue-200 transition-colors cursor-pointer group" onClick={() => navigate('/login')}>
                    <div className="flex justify-between items-center mb-1">
                       <span className="font-semibold text-gray-900 group-hover:text-blue-600">Área Administrativa</span>
                       <span className="text-xs bg-white px-2 py-1 rounded border text-gray-500">Restrito</span>
                    </div>
                    <p className="text-sm text-gray-500">Gestão de calendário e usuários no Gestorate.</p>
                 </div>
              </div>
              
              <div className="mt-8 pt-6 border-t text-center">
                 <p className="text-sm text-gray-400">Gestorate Seguro v2.0</p>
              </div>
            </motion.div>

          </div>
        </main>
      </div>
    </>
  );
};

export default HomePage;
