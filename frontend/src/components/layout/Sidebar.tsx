import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Grid3X3,
  Package,
  Archive,
  ClipboardList,
  Receipt,
  FileText,
  Users,
  UserCog,
  BarChart3,
  ChevronLeft,
  ChevronRight,
  LogOut,
  Tags,
  Landmark,
  Wallet,
  Calculator,
  Combine,
  History,
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useUiStore } from '../../store/uiStore';
import type { UserRole } from '../../types';

interface NavItem {
  label: string;
  path: string;
  icon: React.ReactNode;
  roles?: UserRole[];
}

const navItems: NavItem[] = [
  {
    label: 'Dashboard',
    path: '/',
    icon: <LayoutDashboard size={20} />,
    roles: ['admin', 'cajero'],
  },
  {
    label: 'Mesas',
    path: '/tables',
    icon: <Grid3X3 size={20} />,
  },
  {
    label: 'Productos',
    path: '/products',
    icon: <Package size={20} />,
    roles: ['admin'],
  },
  { label: 'Combos', path: '/combos', icon: <Combine size={20} />, roles: ['admin'] },
  {
    label: 'Inventario',
    path: '/inventory',
    icon: <Archive size={20} />,
    roles: ['admin'],
  },
  {
    label: 'Órdenes',
    path: '/orders',
    icon: <ClipboardList size={20} />,
    roles: ['admin', 'cajero'],
  },
  // {
  //   label: 'Sub-órdenes',
  //   path: '/sub-orders',
  //   icon: <ClipboardList size={20} />,
  //   roles: ['admin'],
  // },
  {
    label: 'Facturación',
    path: '/billing',
    icon: <Receipt size={20} />,
    roles: ['admin', 'cajero'],
  },
  {
    label: 'Ctas. de Cobro',
    path: '/invoices',
    icon: <FileText size={20} />,
    roles: ['admin'],
  },
  {
    label: 'Clientes',
    path: '/clients',
    icon: <Users size={20} />,
    roles: ['admin'],
  },
  {
    label: 'Usuarios',
    path: '/users',
    icon: <UserCog size={20} />,
    roles: ['admin'],
  },
  {
    label: 'Reportes',
    path: '/reports',
    icon: <BarChart3 size={20} />,
    roles: ['admin'],
  },
  { label: 'Caja', path: '/cash-register', icon: <Calculator size={20} />, roles: ['admin'] },
  { label: 'Historial Caja', path: '/cash-register/history', icon: <History size={20} />, roles: ['admin'] },
  { label: 'Categorías', path: '/categories', icon: <Tags size={20} />, roles: ['admin'] },
  { label: 'Cuentas', path: '/accounts', icon: <Landmark size={20} />, roles: ['admin'] },
  { label: 'Métodos de Pago', path: '/payment-methods', icon: <Wallet size={20} />, roles: ['admin'] },
];

interface SidebarProps {
  mobile?: boolean;
  onClose?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ mobile = false, onClose }) => {
  const { user, logout, hasRole } = useAuth();
  const { sidebarOpen, toggleSidebar } = useUiStore();
  const location = useLocation();

  const visibleItems = navItems.filter(
    (item) => !item.roles || item.roles.some((r) => hasRole(r))
  );
  const handleNavClick = () => {
    if (mobile && onClose) {
      onClose();
    }
  };

  const sidebarContent = (
    <div className="flex flex-col h-full bg-gray-900 border-r border-gray-800">
      <div className="flex items-center gap-3 px-5 h-16 border-b border-gray-800 flex-shrink-0">
        <div className="w-9 h-9 rounded-lg overflow-hidden flex-shrink-0 bg-white/10">
          <img src="/logo-bar.png" alt="Logo" className="w-full h-full object-contain" />
        </div>
        {sidebarOpen && (
          <div className="overflow-hidden">
            <h1 className="text-base font-bold text-white leading-tight">PAL DM</h1>
            <p className="text-[10px] text-gray-500 leading-tight">Boutigue Licores</p>
          </div>
        )}
      </div>

      <nav className="flex-1 overflow-y-auto py-3 px-2 space-y-1">
        {visibleItems.map((item) => {
          const isActive = location.pathname.startsWith(item.path);
          return (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={handleNavClick}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                isActive
                  ? 'bg-gradient-to-r from-amber-500/15 to-amber-600/5 text-amber-400 border border-amber-500/20'
                  : 'text-gray-400 hover:text-gray-200 hover:bg-gray-800/50'
              } ${!sidebarOpen ? 'justify-center px-2' : ''}`}
              title={!sidebarOpen ? item.label : undefined}
            >
              <span className="flex-shrink-0">{item.icon}</span>
              {sidebarOpen && <span className="truncate">{item.label}</span>}
              {isActive && sidebarOpen && (
                <div className="ml-auto w-1.5 h-1.5 rounded-full bg-amber-500" />
              )}
            </NavLink>
          );
        })}
      </nav>

      {user && (
        <div className={`border-t border-gray-800 p-3 ${!sidebarOpen ? 'flex flex-col items-center' : ''}`}>
          <div className={`flex items-center gap-3 ${!sidebarOpen ? 'flex-col' : ''}`}>
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-xs font-bold text-gray-950 flex-shrink-0">
              {user.full_name?.charAt(0).toUpperCase()}
            </div>
            {sidebarOpen && (
              <div className="flex-1 min-w-0 overflow-hidden">
                <p className="text-sm font-medium text-gray-200 truncate">
                  {user.full_name}
                </p>
                <p className="text-[10px] text-gray-500 truncate uppercase tracking-wider">
                  {user.rol}
                </p>
              </div>
            )}
          </div>
          {sidebarOpen && (
            <button
              onClick={logout}
              className="mt-3 flex items-center gap-2 w-full px-3 py-2 text-sm text-gray-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
            >
              <LogOut size={16} />
              <span>Cerrar Sesión</span>
            </button>
          )}
        </div>
      )}

      {!mobile && (
        <button
          onClick={toggleSidebar}
          className="absolute -right-3 top-20 w-6 h-6 rounded-full bg-gray-800 border border-gray-700 flex items-center justify-center text-gray-500 hover:text-white hover:border-amber-500 transition-colors z-10"
        >
          {sidebarOpen ? <ChevronLeft size={14} /> : <ChevronRight size={14} />}
        </button>
      )}
    </div>
  );

  if (mobile) {
    return (
      <>
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
          onClick={onClose}
        />
        <div className="fixed inset-y-0 left-0 w-64 z-50 lg:hidden animate-slide-in">
          {sidebarContent}
        </div>
      </>
    );
  }

  return (
    <aside
      className={`hidden lg:flex fixed inset-y-0 left-0 z-30 transition-all duration-300 ${
        sidebarOpen ? 'w-56' : 'w-16'
      }`}
    >
      {sidebarContent}
    </aside>
  );
};

export default Sidebar;
