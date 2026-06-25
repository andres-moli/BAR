import React, { useState, useRef, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import {
  Menu,
  Bell,
  User,
  Settings,
  LogOut,
  ChevronDown,
  Search,
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useUiStore } from '../../store/uiStore';

const pageTitles: Record<string, string> = {
  '/dashboard': 'Dashboard',
  '/tables': 'Mesas',
  '/products': 'Productos',
  '/orders': 'Órdenes',
  '/billing': 'Facturación',
  '/invoices': 'Cuentas de Cobro',
  '/clients': 'Clientes',
  '/users': 'Usuarios',
  '/reports': 'Reportes',
  '/pos': 'Punto de Venta',
};

interface HeaderProps {
  onMenuClick: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onMenuClick }) => {
  const { user, logout } = useAuth();
  const { setMobileMenuOpen } = useUiStore();
  const location = useLocation();
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const notificationsRef = useRef<HTMLDivElement>(null);

  const currentTitle =
    pageTitles[location.pathname] || 'Panel de Control';

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false);
      }
      if (notificationsRef.current && !notificationsRef.current.contains(e.target as Node)) {
        setNotificationsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const notifications = [
    { id: 1, text: 'Mesa 5 solicita la cuenta', time: 'hace 2 min', unread: true },
    { id: 2, text: 'Nuevo pedido en mesa 8', time: 'hace 5 min', unread: true },
    { id: 3, text: 'Inventario bajo: Aguardiente', time: 'hace 1 hora', unread: false },
  ];

  return (
    <header className="h-16 bg-gray-900/80 backdrop-blur-xl border-b border-gray-800 flex items-center justify-between px-4 lg:px-6 sticky top-0 z-20">
      <div className="flex items-center gap-4">
        <button
          onClick={() => {
            onMenuClick();
            setMobileMenuOpen(true);
          }}
          className="lg:hidden p-2 text-gray-400 hover:text-white rounded-lg hover:bg-gray-800 transition-colors"
        >
          <Menu size={20} />
        </button>
        <h1 className="text-lg font-semibold text-white">{currentTitle}</h1>
      </div>

      <div className="flex items-center gap-2">
        <button className="hidden sm:flex p-2 text-gray-400 hover:text-white rounded-lg hover:bg-gray-800 transition-colors">
          <Search size={18} />
        </button>

        <div className="relative" ref={notificationsRef}>
          <button
            onClick={() => setNotificationsOpen(!notificationsOpen)}
            className="relative p-2 text-gray-400 hover:text-white rounded-lg hover:bg-gray-800 transition-colors"
          >
            <Bell size={18} />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-amber-500" />
          </button>
          {notificationsOpen && (
            <div className="absolute right-0 mt-2 w-72 bg-gray-800 border border-gray-700 rounded-xl shadow-xl z-50">
              <div className="px-4 py-3 border-b border-gray-700">
                <p className="text-sm font-medium text-white">Notificaciones</p>
              </div>
              <div className="max-h-64 overflow-y-auto">
                {notifications.map((n) => (
                  <div
                    key={n.id}
                    className={`px-4 py-3 hover:bg-gray-700/50 transition-colors cursor-pointer ${
                      n.unread ? 'border-l-2 border-amber-500' : ''
                    }`}
                  >
                    <p className="text-sm text-gray-300">{n.text}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{n.time}</p>
                  </div>
                ))}
              </div>
              <div className="px-4 py-2 border-t border-gray-700 text-center">
                <button className="text-xs text-amber-500 hover:text-amber-400">
                  Ver todas
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="relative" ref={userMenuRef}>
          <button
            onClick={() => setUserMenuOpen(!userMenuOpen)}
            className="flex items-center gap-2 pl-3 pr-2 py-1.5 rounded-lg hover:bg-gray-800 transition-colors"
          >
            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-xs font-bold text-gray-950">
              {user?.full_name?.charAt(0).toUpperCase() || 'U'}
            </div>
            <span className="hidden sm:block text-sm text-gray-300">
              {user?.full_name || 'Usuario'}
            </span>
            <ChevronDown size={14} className="text-gray-500" />
          </button>
          {userMenuOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-gray-800 border border-gray-700 rounded-xl shadow-xl z-50">
              <div className="px-4 py-3 border-b border-gray-700">
                <p className="text-sm font-medium text-white truncate">
                  {user?.full_name}
                </p>
                <p className="text-xs text-gray-500 capitalize">{user?.rol}</p>
              </div>
              <div className="py-1">
                <button className="w-full px-4 py-2 text-sm text-gray-300 hover:bg-gray-700/50 flex items-center gap-2 transition-colors">
                  <User size={14} />
                  Perfil
                </button>
                <button className="w-full px-4 py-2 text-sm text-gray-300 hover:bg-gray-700/50 flex items-center gap-2 transition-colors">
                  <Settings size={14} />
                  Configuración
                </button>
              </div>
              <div className="border-t border-gray-700 py-1">
                <button
                  onClick={logout}
                  className="w-full px-4 py-2 text-sm text-red-400 hover:bg-red-500/10 flex items-center gap-2 transition-colors"
                >
                  <LogOut size={14} />
                  Cerrar Sesión
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
