
import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';
import { 
  LogOut, Calendar, Users, Settings, Home, CheckSquare, 
  KeyRound, Clock, CalendarDays, LogIn, BarChart3, Timer,
  Menu, X, Bell, Moon, Sun, ChevronDown
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import NotificationCenter from '@/components/NotificationCenter';
import HeroImage from '@/components/HeroImage'; // Import the HeroImage component

const MainLayout = ({ children }) => {
  const { user } = useAuth();
  const { isDarkMode, toggleDarkMode } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const isAdmin = user?.role === 'admin' || user?.role === 'master';

  const publicLinks = [
    { to: '/', label: 'Home', icon: Home },
    { to: '/book', label: 'Agendar', icon: CalendarDays },
    { to: '/login', label: 'Entrar', icon: LogIn },
  ];

  const userLinks = [
    { to: '/dashboard', label: 'Início', icon: Home },
    { to: '/calendar', label: 'Calendário', icon: CalendarDays },
    { to: '/appointments', label: 'Novo Agendamento', icon: Calendar },
    { to: '/availabilities', label: 'Disponibilidade', icon: Clock },
    { to: '/profile', label: 'Perfil', icon: Settings },
  ];

  const adminLinks = [
    { to: '/dashboard', label: 'Dashboard', icon: Home },
    { to: '/admin/confirm', label: 'Confirmar', icon: CheckSquare },
    { to: '/admin/calendar', label: 'Calendário', icon: Calendar },
    { to: '/users', label: 'Usuários', icon: Users },
    { to: '/reports', label: 'Relatórios', icon: BarChart3 }, 
    { to: '/scheduled-reports', label: 'Agendamentos', icon: Timer },
  ];

  const links = user ? (isAdmin ? adminLinks : userLinks) : publicLinks;

  // Helper functions for safe user data access
  const getUserDisplayName = () => {
    if (!user) return '';
    return user.name || user.email || 'Usuário';
  };

  const getUserInitials = () => {
    const displayName = getUserDisplayName();
    return displayName ? displayName.charAt(0).toUpperCase() : 'U';
  };

  const getUserEmail = () => {
    return user?.email || '';
  };

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] transition-colors duration-300">
      {/* Sticky Header */}
      <nav className="sticky top-0 z-50 w-full border-b border-[var(--border-color)] bg-[var(--bg-secondary)]/80 backdrop-blur-md shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            
            {/* Logo & Mobile Menu Toggle */}
            <div className="flex items-center gap-4">
              <Button 
                variant="ghost" 
                size="icon" 
                className="md:hidden"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                <Menu className="h-6 w-6" />
              </Button>
              <Link to={user ? "/dashboard" : "/"} className="flex items-center space-x-2">
                <HeroImage /> {/* Using the new HeroImage for branding */}
                <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[var(--primary-color)] to-[var(--secondary-color)] hidden sm:block">
                  Gestorate
                </span>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-1">
              {links.map((link) => {
                const Icon = link.icon;
                const isActive = location.pathname === link.to;
                return (
                  <Link key={link.to} to={link.to}>
                    <Button
                      variant={isActive ? "secondary" : "ghost"}
                      className={`flex items-center gap-2 ${isActive ? 'bg-[var(--bg-tertiary)] text-[var(--primary-color)]' : ''}`}
                    >
                      <Icon size={16} />
                      {link.label}
                    </Button>
                  </Link>
                );
              })}
            </div>

            {/* Right Side Actions */}
            <div className="flex items-center space-x-2 sm:space-x-4">
              <Button variant="ghost" size="icon" onClick={toggleDarkMode}>
                {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
              </Button>

              {user ? (
                <>
                  <NotificationCenter />
                  <div className="border-l pl-4 border-[var(--border-color)] ml-2">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                          <Avatar className="h-10 w-10 border-2 border-[var(--border-color)]">
                            <AvatarImage 
                              src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${getUserDisplayName()}`} 
                              alt={getUserDisplayName()} 
                            />
                            <AvatarFallback>{getUserInitials()}</AvatarFallback>
                          </Avatar>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="w-56" align="end" forceMount>
                        <DropdownMenuLabel className="font-normal">
                          <div className="flex flex-col space-y-1">
                            <p className="text-sm font-medium leading-none">{getUserDisplayName()}</p>
                            <p className="text-xs leading-none text-muted-foreground">{getUserEmail()}</p>
                          </div>
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => navigate('/profile')}>
                          <Settings className="mr-2 h-4 w-4" />
                          <span>Perfil</span>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => navigate('/logout')} className="text-red-600 focus:text-red-600">
                          <LogOut className="mr-2 h-4 w-4" />
                          <span>Sair</span>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </>
              ) : (
                <div className="flex items-center space-x-2">
                  <Link to="/login">
                     <Button variant="ghost">Entrar</Button>
                  </Link>
                  <Link to="/book">
                     <Button>Agendar</Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>
      
      {/* Mobile Slide-out Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
             <motion.div 
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               exit={{ opacity: 0 }}
               className="fixed inset-0 bg-black/50 z-40 md:hidden"
               onClick={() => setIsMobileMenuOpen(false)}
             />
             <motion.div
               initial={{ x: '-100%' }}
               animate={{ x: 0 }}
               exit={{ x: '-100%' }}
               transition={{ type: "spring", damping: 20 }}
               className="fixed top-0 left-0 bottom-0 w-3/4 max-w-sm bg-[var(--bg-secondary)] z-50 shadow-2xl p-6 md:hidden overflow-y-auto"
             >
                <div className="flex justify-between items-center mb-8">
                  <span className="text-xl font-bold text-[var(--primary-color)]">Menu Gestorate</span>
                  <Button variant="ghost" size="icon" onClick={() => setIsMobileMenuOpen(false)}>
                    <X className="h-6 w-6" />
                  </Button>
                </div>
                <div className="flex flex-col space-y-4">
                  {links.map((link) => {
                    const Icon = link.icon;
                    const isActive = location.pathname === link.to;
                    return (
                      <Link 
                        key={link.to} 
                        to={link.to} 
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                         <div className={`flex items-center space-x-4 p-3 rounded-lg transition-colors ${isActive ? 'bg-[var(--primary-color)] text-white' : 'hover:bg-[var(--bg-tertiary)] text-[var(--text-primary)]'}`}>
                            <Icon size={20} />
                            <span className="font-medium">{link.label}</span>
                         </div>
                      </Link>
                    );
                  })}
                  {user && (
                     <div className="pt-6 mt-6 border-t border-[var(--border-color)]">
                        <Button 
                          variant="destructive" 
                          className="w-full justify-start"
                          onClick={() => {
                            navigate('/logout');
                            setIsMobileMenuOpen(false);
                          }}
                        >
                          <LogOut size={20} className="mr-2" /> Sair
                        </Button>
                     </div>
                  )}
                </div>
             </motion.div>
          </>
        )}
      </AnimatePresence>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
        {children}
      </main>
    </div>
  );
};

export default MainLayout;
