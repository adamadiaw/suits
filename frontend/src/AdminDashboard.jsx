// frontend/src/AdminDashboard.jsx

import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuthStore } from './store/authStore';

function AdminDashboard() {
  const { token } = useAuthStore();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/admin/stats', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
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
    return <div className="text-center py-8">Chargement...</div>;
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-8">📊 Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <p className="text-sm text-gray-500">Total produits</p>
          <p className="text-3xl font-bold text-gray-900">{stats?.totalProducts || 0}</p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <p className="text-sm text-gray-500">Commandes</p>
          <p className="text-3xl font-bold text-gray-900">{stats?.totalOrders || 0}</p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <p className="text-sm text-gray-500">Utilisateurs</p>
          <p className="text-3xl font-bold text-gray-900">{stats?.totalUsers || 0}</p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <p className="text-sm text-gray-500">Chiffre d'affaires</p>
          <p className="text-3xl font-bold text-green-600">
            {stats?.revenue ? stats.revenue.toFixed(2) : '0.00'} €
          </p>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;