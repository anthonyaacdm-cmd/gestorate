
import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import PeriodFilter from '@/components/dashboard/PeriodFilter';
import { useDashboardStats } from '@/hooks/useDashboardStats';
import { Users, Calendar, TrendingUp, DollarSign } from 'lucide-react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, AreaChart, Area } from 'recharts';
import WebhookDebugPanel from '@/components/WebhookDebugPanel';
import TopActiveUsersTable from '@/components/dashboard/TopActiveUsersTable';

const KPICard = ({ title, value, icon: Icon, color, trend, loading }) => (
  <Card className="card-hover overflow-hidden relative">
    <CardContent className="p-6">
      {loading ? (
        <div className="space-y-3">
          <Skeleton className="h-4 w-[100px]" />
          <Skeleton className="h-8 w-[60px]" />
        </div>
      ) : (
        <div className="flex justify-between items-start">
          <div>
            <p className="text-sm font-medium text-[var(--text-muted)]">{title}</p>
            <h3 className="text-2xl font-bold mt-2 text-[var(--text-primary)]">{value}</h3>
            {trend && (
              <p className={`text-xs mt-1 font-medium ${trend > 0 ? 'text-green-500' : 'text-red-500'}`}>
                {trend > 0 ? '+' : ''}{trend}% desde mês passado
              </p>
            )}
          </div>
          <div className={`p-3 rounded-xl bg-opacity-10 ${color.bg}`}>
            <Icon className={`w-6 h-6 ${color.text}`} />
          </div>
        </div>
      )}
    </CardContent>
  </Card>
);

const AdminDashboard = () => {
  const [dateRange, setDateRange] = useState({
    start: new Date(new Date().setDate(new Date().getDate() - 30)),
    end: new Date()
  });

  const {
    systemStats,
    appointmentsByMonth,
    newUsersByMonth,
    topActiveUsers,
    loading
  } = useDashboardStats(dateRange);

  return (
    <div className="space-y-8 animate-fade-in">
      <Helmet>
        <title>Dashboard Admin - Gestorate</title>
      </Helmet>

      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-[var(--radius-xl)] bg-gradient-to-r from-[var(--primary-color)] to-[var(--secondary-color)] p-8 text-white shadow-lg">
        <div className="relative z-10">
          <h1 className="text-3xl font-bold text-white mb-2">Bem-vindo de volta, Admin do Gestorate!</h1>
          <p className="text-blue-100 max-w-2xl">
            Aqui está o resumo do desempenho do sistema nos últimos 30 dias.
          </p>
        </div>
        <div className="absolute right-0 bottom-0 opacity-10 transform translate-x-10 translate-y-10">
          <TrendingUp size={200} />
        </div>
      </div>

      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <h2 className="text-xl font-semibold text-[var(--text-primary)]">Visão Geral</h2>
        <PeriodFilter onRangeChange={setDateRange} />
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <KPICard 
          title="Total de Agendamentos" 
          value={systemStats?.totalAppointments || 0} 
          icon={Calendar} 
          color={{ bg: 'bg-indigo-500', text: 'text-indigo-500' }}
          loading={loading}
        />
        <KPICard 
          title="Novos Clientes" 
          value={systemStats?.activeUsers || 0} 
          icon={Users} 
          color={{ bg: 'bg-pink-500', text: 'text-pink-500' }}
          trend={12}
          loading={loading}
        />
        <KPICard 
          title="Taxa de Ocupação" 
          value="85%" 
          icon={TrendingUp} 
          color={{ bg: 'bg-emerald-500', text: 'text-emerald-500' }}
          loading={loading}
        />
        <KPICard 
          title="Receita Mensal" 
          value="R$ 12.450" 
          icon={DollarSign} 
          color={{ bg: 'bg-amber-500', text: 'text-amber-500' }}
          loading={loading}
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Agendamentos por Mês</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
             {loading ? <Skeleton className="w-full h-full" /> : (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={appointmentsByMonth}>
                  <defs>
                    <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366F1" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#6366F1" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-color)" />
                  <XAxis dataKey="month" stroke="var(--text-secondary)" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="var(--text-secondary)" fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: 'var(--bg-secondary)', borderRadius: '8px', border: '1px solid var(--border-color)' }}
                  />
                  <Area type="monotone" dataKey="count" stroke="#6366F1" fillOpacity={1} fill="url(#colorCount)" />
                </AreaChart>
              </ResponsiveContainer>
             )}
          </CardContent>
        </Card>

        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Novos Usuários</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
             {loading ? <Skeleton className="w-full h-full" /> : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={newUsersByMonth}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-color)" />
                  <XAxis dataKey="month" stroke="var(--text-secondary)" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="var(--text-secondary)" fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip 
                    cursor={{fill: 'var(--bg-tertiary)'}}
                    contentStyle={{ backgroundColor: 'var(--bg-secondary)', borderRadius: '8px', border: '1px solid var(--border-color)' }}
                  />
                  <Bar dataKey="count" fill="#EC4899" radius={[4, 4, 0, 0]} barSize={40} />
                </BarChart>
              </ResponsiveContainer>
             )}
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity / Top Users */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
         <Card className="lg:col-span-3">
            <CardHeader>
              <CardTitle>Usuários Mais Ativos</CardTitle>
            </CardHeader>
            <CardContent>
               {loading ? (
                  <div className="space-y-2">
                    <Skeleton className="h-12 w-full" />
                    <Skeleton className="h-12 w-full" />
                    <Skeleton className="h-12 w-full" />
                  </div>
               ) : (
                 <TopActiveUsersTable users={topActiveUsers} />
               )}
            </CardContent>
         </Card>
      </div>

      {import.meta.env.MODE === 'development' && <WebhookDebugPanel />}
    </div>
  );
};

export default AdminDashboard;
