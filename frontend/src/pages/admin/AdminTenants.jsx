// frontend/src/AdminTenants.jsx

import { useState, useEffect } from 'react';
import { useAuthStore } from '../../store/authStore';
import { adminService } from '../../services';
import { Icons } from '../../icons';

function AdminTenants() {
  const { token } = useAuthStore();
  const [tenants, setTenants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    subdomain: '',
    logo: '',
  });

  const fetchTenants = async () => {
    try {
      setLoading(true);
      const response = await adminService.getTenants();
      setTenants(response.data);
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTenants();
  }, [token]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      await adminService.createTenant(formData);
      
      fetchTenants();
      setShowForm(false);
      setFormData({ name: '', subdomain: '', logo: '' });
    } catch (error) {
      console.error('Erreur:', error);
      alert('Erreur lors de la création');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Icons.Loading />
        <span className="ml-2 text-gray-500">Chargement...</span>
      </div>
    );
  }

  return (
    <div>
      {/* En-tête */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gray-900 rounded-xl text-white">
            <Icons.Store />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Boutiques</h1>
          <span className="text-sm text-gray-400 bg-gray-100 px-3 py-1 rounded-full">
            {tenants.length}
          </span>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
            showForm 
              ? 'bg-gray-100 text-gray-700 hover:bg-gray-200' 
              : 'bg-gray-900 text-white hover:bg-gray-800 hover:shadow-lg hover:shadow-gray-900/20'
          }`}
        >
          {showForm ? <Icons.X /> : <Icons.Plus />}
          {showForm ? 'Fermer' : 'Créer une boutique'}
        </button>
      </div>

      {/* Formulaire de création */}
      {showForm && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6 fade-in">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Nouvelle boutique</h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Nom *</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder="Ma boutique"
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-gray-900 focus:border-transparent outline-none transition-all bg-gray-50/50 placeholder:text-gray-400"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Sous-domaine *</label>
              <input
                type="text"
                name="subdomain"
                value={formData.subdomain}
                onChange={handleChange}
                required
                placeholder="ma-boutique"
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-gray-900 focus:border-transparent outline-none transition-all bg-gray-50/50 placeholder:text-gray-400"
              />
              <p className="text-xs text-gray-400 mt-1">.votredomaine.com</p>
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Logo (URL)</label>
              <input
                type="text"
                name="logo"
                value={formData.logo}
                onChange={handleChange}
                placeholder="https://exemple.com/logo.png"
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-gray-900 focus:border-transparent outline-none transition-all bg-gray-50/50 placeholder:text-gray-400"
              />
            </div>
            <div className="md:col-span-2 flex gap-3">
              <button
                type="submit"
                className="px-6 py-2.5 bg-gray-900 text-white rounded-xl hover:bg-gray-800 transition-all font-medium text-sm flex items-center gap-2 hover:shadow-lg hover:shadow-gray-900/20"
              >
                <Icons.Check />
                Créer
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  setFormData({ name: '', subdomain: '', logo: '' });
                }}
                className="px-6 py-2.5 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-all font-medium text-sm"
              >
                Annuler
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Liste des boutiques */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50/80">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nom</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sous-domaine</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Produits</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Créée le</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {tenants.length === 0 ? (
                <tr>
                  <td colSpan="4" className="px-4 py-12 text-center text-gray-400">
                    <div className="flex flex-col items-center gap-2">
                      <Icons.Store />
                      <span>Aucune boutique</span>
                      <button
                        onClick={() => setShowForm(true)}
                        className="text-sm text-gray-900 font-medium hover:underline"
                      >
                        Créer votre première boutique
                      </button>
                    </div>
                  </td>
                </tr>
              ) : (
                tenants.map((tenant) => (
                  <tr key={tenant.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-4 py-3 text-sm font-medium text-gray-900">{tenant.name}</td>
                    <td className="px-4 py-3 text-sm text-gray-500">{tenant.subdomain}</td>
                    <td className="px-4 py-3 text-sm">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-gray-100 rounded-full text-gray-600 text-xs">
                        <Icons.Package />
                        {tenant._count?.products || 0}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-400">
                      <span className="inline-flex items-center gap-1.5">
                        <Icons.Calendar />
                        {new Date(tenant.createdAt).toLocaleDateString('fr-FR')}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default AdminTenants;