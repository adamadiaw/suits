// frontend/src/pages/admin/AdminLayout.jsx

import { useState } from 'react'; // ← AJOUT
import { Link, Outlet, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { useEffect } from 'react';
import { Icons } from '../../icons';

function AdminLayout() {
  const { user, isAuthenticated, logout } = useAuthStore();
  const navigate = useNavigate();
  
  // 👇 AJOUT : État pour le menu mobile
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    if (!isAuthenticated || user?.role !== 'admin') {
      navigate('/');
    }
  }, [isAuthenticated, user, navigate]);

  if (!isAuthenticated || user?.role !== 'admin') {
    return null;
  }

  const navItems = [
    { to: '/admin', label: 'Tableau de bord', icon: <Icons.Dashboard /> },
    { to: '/admin/products', label: 'Produits', icon: <Icons.Package /> },
    { to: '/admin/orders', label: 'Commandes', icon: <Icons.ShoppingBag /> },
    { to: '/admin/tenants', label: 'Boutiques', icon: <Icons.Store /> },
  ];

  // Fonction pour fermer la sidebar sur mobile
  const closeSidebar = () => setIsSidebarOpen(false);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col md:flex-row">
      {/* Bouton menu hamburger (mobile) */}
      <div className="md:hidden bg-white border-b border-gray-100 px-4 py-3 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-gray-900 rounded-lg text-white">
            <Icons.Settings />
          </div>
          <span className="text-lg font-bold tracking-tight">Administration</span>
        </div>
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="p-1.5 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
        >
          {isSidebarOpen ? <Icons.X /> : <Icons.Menu />}
        </button>
      </div>

      {/* Overlay pour fermer la sidebar en cliquant dehors (mobile) */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/30 z-40 md:hidden"
          onClick={closeSidebar}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed md:sticky top-0 h-full w-64 bg-gray-900 text-white p-4 flex flex-col z-50 transition-transform duration-300
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        md:min-h-screen md:flex-shrink-0
      `}>
        {/* Logo (bureau) */}
        <div className="hidden md:flex items-center gap-2.5 mb-8 px-2">
          <div className="p-1.5 bg-white/10 rounded-lg">
            <Icons.Settings />
          </div>
          <span className="text-lg font-bold tracking-tight">Administration</span>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 overflow-y-auto">
          {navItems.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              onClick={closeSidebar}
              className="flex items-center gap-3 px-4 py-2.5 rounded-xl hover:bg-white/10 transition-colors text-gray-300 hover:text-white text-sm font-medium"
            >
              <span className="text-gray-400">{item.icon}</span>
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Bas de la sidebar */}
        <div className="pt-4 border-t border-gray-800 space-y-1">
          <Link
            to="/"
            onClick={closeSidebar}
            className="flex items-center gap-3 px-4 py-2.5 rounded-xl hover:bg-white/10 transition-colors text-gray-300 hover:text-white text-sm font-medium"
          >
            <span className="text-gray-400"><Icons.Home /></span>
            Voir la boutique
          </Link>
          <button
            onClick={() => {
              logout();
              closeSidebar();
            }}
            className="flex items-center gap-3 px-4 py-2.5 rounded-xl hover:bg-red-500/10 transition-colors text-gray-300 hover:text-red-400 text-sm font-medium w-full"
          >
            <span className="text-gray-400"><Icons.Logout /></span>
            Déconnexion
          </button>
        </div>
      </aside>

      {/* Contenu principal */}
      <main className="flex-1 p-3 sm:p-4 md:p-6 overflow-auto">
        <div className="max-w-7xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
}

export default AdminLayout;