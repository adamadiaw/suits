// frontend/src/AdminLayout.jsx

import { Link, Outlet, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { useEffect } from 'react';
import { Icons } from '../../icons';


function AdminLayout() {
  const { user, isAuthenticated, logout } = useAuthStore();
  const navigate = useNavigate();

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

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-900 min-h-screen p-4 text-white flex flex-col flex-shrink-0 sticky top-0 h-screen">
        {/* Logo */}
        <div className="flex items-center gap-2.5 mb-8 px-2">
          <div className="p-1.5 bg-white/10 rounded-lg">
            <Icons.Settings />
          </div>
          <span className="text-lg font-bold tracking-tight">Administration</span>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.to}
              to={item.to}
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
            className="flex items-center gap-3 px-4 py-2.5 rounded-xl hover:bg-white/10 transition-colors text-gray-300 hover:text-white text-sm font-medium"
          >
            <span className="text-gray-400"><Icons.Home /></span>
            Voir la boutique
          </Link>
          <button
            onClick={logout}
            className="flex items-center gap-3 px-4 py-2.5 rounded-xl hover:bg-red-500/10 transition-colors text-gray-300 hover:text-red-400 text-sm font-medium w-full"
          >
            <span className="text-gray-400"><Icons.Logout /></span>
            Déconnexion
          </button>
        </div>
      </aside>

      {/* Contenu principal */}
      <main className="flex-1 p-6 overflow-auto">
        <div className="max-w-7xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
}

export default AdminLayout;