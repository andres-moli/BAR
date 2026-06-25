import React from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { useUiStore } from '../../store/uiStore';

export const Layout: React.FC = () => {
  const { sidebarOpen, mobileMenuOpen, setMobileMenuOpen } = useUiStore();

  return (
    <div className="min-h-screen bg-gray-950">
      <Sidebar />

      {mobileMenuOpen && (
        <Sidebar mobile onClose={() => setMobileMenuOpen(false)} />
      )}

      <div
        className={`transition-all duration-300 ${
          sidebarOpen ? 'lg:ml-56' : 'lg:ml-16'
        }`}
      >
        <Header onMenuClick={() => setMobileMenuOpen(true)} />

        <main className="p-4 lg:p-6 min-h-[calc(100vh-4rem)]">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
