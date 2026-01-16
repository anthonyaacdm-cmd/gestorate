
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from '@/context/AuthContext';
import { ThemeProvider } from '@/context/ThemeContext';
import { Toaster } from '@/components/ui/toaster';
import ProtectedRoute from '@/components/ProtectedRoute';
import AdminRoute from '@/components/AdminRoute';
import MainLayout from '@/layouts/MainLayout';

// Pages
import HomePage from '@/pages/HomePage';
import LoginPage from '@/pages/LoginPage';
import RegisterPage from '@/pages/RegisterPage';
import UserDashboard from '@/pages/UserDashboard';
import AdminDashboard from '@/pages/AdminDashboard';
import AppointmentBooking from '@/pages/AppointmentBooking';
import AvailabilitiesPage from '@/pages/AvailabilitiesPage';
import NotificationsPage from '@/pages/NotificationsPage';
import CalendarPage from '@/pages/CalendarPage';
import AdminConfirm from '@/pages/AdminConfirm';
import AdminCalendar from '@/pages/AdminCalendar';
import AdminUsersPage from '@/pages/AdminUsersPage';
import AdminPasswordReset from '@/pages/AdminPasswordReset';
import ReportsPage from '@/pages/ReportsPage';
import ScheduledReportsPage from '@/pages/ScheduledReportsPage';
import ProfilePage from '@/pages/ProfilePage';
import LogoutPage from '@/pages/LogoutPage';
import DebugAuth from '@/pages/DebugAuth';
import DebugAutoRepair from '@/pages/DebugAutoRepair';
import PublicAdminListPage from '@/pages/PublicAdminListPage';
import PublicBookingPage from '@/pages/PublicBookingPage';

const DashboardRouter = () => {
    const { user, loading } = useAuth();
    if (loading) return null;
    if (user?.role === 'admin' || user?.role === 'master') return <AdminDashboard />;
    return <UserDashboard />;
};

function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <Router>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/logout" element={<LogoutPage />} />
            <Route path="/book" element={<MainLayout><PublicAdminListPage /></MainLayout>} />
            <Route path="/book/:adminId" element={<MainLayout><PublicBookingPage /></MainLayout>} />
            
            {/* Debug Routes */}
            <Route path="/debug-auth" element={<DebugAuth />} />
            <Route path="/debug-auto-repair" element={<DebugAutoRepair />} />
            
            {/* Protected Dashboard */}
            <Route path="/dashboard" element={<ProtectedRoute><DashboardRouter /></ProtectedRoute>} />
            
            {/* User Routes */}
            <Route path="/appointments" element={<ProtectedRoute><MainLayout><AppointmentBooking /></MainLayout></ProtectedRoute>} />
            <Route path="/calendar" element={<ProtectedRoute><MainLayout><CalendarPage /></MainLayout></ProtectedRoute>} />
            <Route path="/availabilities" element={<ProtectedRoute><MainLayout><AvailabilitiesPage /></MainLayout></ProtectedRoute>} />
            <Route path="/notifications" element={<ProtectedRoute><MainLayout><NotificationsPage /></MainLayout></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute><MainLayout><ProfilePage /></MainLayout></ProtectedRoute>} />

            {/* Admin Routes */}
            <Route path="/admin/confirm" element={<ProtectedRoute allowedRoles={['admin', 'master']}><MainLayout><AdminConfirm /></MainLayout></ProtectedRoute>} />
            <Route path="/admin/calendar" element={<ProtectedRoute allowedRoles={['admin', 'master']}><MainLayout><AdminCalendar /></MainLayout></ProtectedRoute>} />
            <Route path="/users" element={<AdminRoute><MainLayout><AdminUsersPage /></MainLayout></AdminRoute>} />
            <Route path="/admin/users" element={<Navigate to="/users" replace />} />
            <Route path="/reports" element={<AdminRoute><MainLayout><ReportsPage /></MainLayout></AdminRoute>} />
            <Route path="/scheduled-reports" element={<AdminRoute><MainLayout><ScheduledReportsPage /></MainLayout></AdminRoute>} />
            <Route path="/admin/reset-password" element={<ProtectedRoute allowedRoles={['admin', 'master']}><MainLayout><AdminPasswordReset /></MainLayout></ProtectedRoute>} />
            
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
          <Toaster />
        </Router>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;
