// frontend/src/AdminLayout.jsx

import { Link, Outlet, useNavigate } from 'react-router-dom';
import { useAuthStore } from './store/authStore';
import { useEffect } from 'react';

function AdminLayout() {
  const { user, isAuthenticated, logout } = useAuthStore();
  const navigate = useNavigate();

  // Vérifier si l'utilisateur est admin
  useEffect(() => {
    if (!isAuthenticated || user?.role !== 'admin') {
      navigate('/');
    }
  }, [isAuthenticated, user, navigate]);

  if (!isAuthenticated || user?.role !== 'admin') {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Barre latérale */}
      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-gray-900 min-h-screen p-4 text-white">
          <h2 className="text-xl font-bold mb-6">🛠️ Admin</h2>
          
          <nav className="space-y-2">
            <Link to="/admin" className="block px-4 py-2 rounded hover:bg-gray-800">
              📊 Dashboard
            </Link>
            <Link to="/admin/products" className="block px-4 py-2 rounded hover:bg-gray-800">
              📦 Produits
            </Link>
            <Link to="/admin/orders" className="block px-4 py-2 rounded hover:bg-gray-800">
              📋 Commandes
            </Link>
            <Link to="/" className="block px-4 py-2 rounded hover:bg-gray-800 mt-4 border-t border-gray-700 pt-4">
              🏠 Voir la boutique
            </Link>
            <button 
              onClick={logout}
              className="block w-full text-left px-4 py-2 rounded hover:bg-gray-800 text-red-400"
            >
              🚪 Déconnexion
            </button>
          </nav>
        </aside>

        {/* Contenu principal */}
        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default AdminLayout;