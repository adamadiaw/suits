// frontend/src/AdminDashboard.jsx

import { useState, useEffect } from 'react';
import { useAuthStore } from './store/authStore';
import { adminService } from './services';
import { Icons } from './icons';

function AdminDashboard() {
  const { token } = useAuthStore();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const response = await adminService.getStats();
        setStats(response.data);
      } catch (error) {
        console.error('Erreur:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [token]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Icons.Loading />
        <span className="ml-2 text-gray-500">Chargement des statistiques...</span>
      </div>
    );
  }

  const statCards = [
    {
      label: 'Total produits',
      value: stats?.totalProducts || 0,
      icon: <Icons.Package />,
      color: 'bg-blue-50 text-blue-600',
      borderColor: 'border-blue-100'
    },
    {
      label: 'Commandes',
      value: stats?.totalOrders || 0,
      icon: <Icons.ShoppingBag />,
      color: 'bg-purple-50 text-purple-600',
      borderColor: 'border-purple-100'
    },
    {
      label: 'Utilisateurs',
      value: stats?.totalUsers || 0,
      icon: <Icons.Users />,
      color: 'bg-emerald-50 text-emerald-600',
      borderColor: 'border-emerald-100'
    },
    {
      label: 'Chiffre d\'affaires',
      value: `${(stats?.revenue || 0).toFixed(2)} €`,
      icon: <Icons.Euro />,
      color: 'bg-amber-50 text-amber-600',
      borderColor: 'border-amber-100'
    },
  ];

  return (
    <div>
      {/* En-tête */}
      <div className="flex items-center gap-3 mb-8">
        <div className="p-2.5 bg-gray-900 rounded-xl text-white">
          <Icons.Dashboard />
        </div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <span className="text-sm text-gray-400 bg-gray-100 px-3 py-1 rounded-full">
          Vue d'ensemble
        </span>
      </div>

      {/* Cartes de statistiques */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => (
          <div
            key={index}
            className={`bg-white rounded-2xl border ${stat.borderColor} p-6 shadow-sm hover:shadow-md transition-shadow`}
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-gray-500 font-medium">{stat.label}</p>
                <p className="text-3xl font-bold text-gray-900 mt-1.5">
                  {stat.value}
                </p>
              </div>
              <div className={`p-3 rounded-xl ${stat.color}`}>
                {stat.icon}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Message de bas de page */}
      <div className="mt-8 p-4 bg-gray-50/80 rounded-xl border border-gray-100">
        <p className="text-xs text-gray-400 text-center">
          📊 Données mises à jour en temps réel
        </p>
      </div>
    </div>
  );
}

export default AdminDashboard;