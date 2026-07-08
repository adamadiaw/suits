// frontend/src/AdminOrders.jsx

import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuthStore } from './store/authStore';

// Icônes SVG
const Icons = {
  ShoppingBag: () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
    </svg>
  ),
  User: () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
  ),
  Euro: () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.121 15.536c-1.171 1.952-3.07 1.952-4.242 0-1.172-1.953-1.172-5.119 0-7.072 1.171-1.952 3.07-1.952 4.242 0M8 10.5h4m-4 3h4m9-1.5a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  Calendar: () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
  ),
  Package: () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10" />
    </svg>
  ),
  Truck: () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 17a2 2 0 11-4 0 2 2 0 014 0zm10 0a2 2 0 11-4 0 2 2 0 014 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" />
    </svg>
  ),
  Home: () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
    </svg>
  ),
  Loading: () => (
    <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
    </svg>
  ),
};

function AdminOrders() {
  const { token } = useAuthStore();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const fetchOrders = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/admin/orders', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setOrders(response.data);
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [token]);

  const updateStatus = async (orderId, newStatus) => {
    try {
      await axios.put(
        `http://localhost:5000/api/admin/orders/${orderId}/status`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      fetchOrders();
      
      if (selectedOrder && selectedOrder.id === orderId) {
        setSelectedOrder(null);
      }
    } catch (error) {
      console.error('Erreur:', error);
      alert('Erreur lors du changement de statut');
    }
  };

  const getStatusLabel = (status) => {
    const labels = {
      'pending': 'En attente',
      'paid': 'Payée',
      'shipped': 'Expédiée',
      'delivered': 'Livrée',
      'cancelled': 'Annulée',
    };
    return labels[status] || status;
  };

  const getStatusColor = (status) => {
    const colors = {
      'pending': 'bg-yellow-50 text-yellow-700 border-yellow-200',
      'paid': 'bg-blue-50 text-blue-700 border-blue-200',
      'shipped': 'bg-purple-50 text-purple-700 border-purple-200',
      'delivered': 'bg-emerald-50 text-emerald-700 border-emerald-200',
      'cancelled': 'bg-red-50 text-red-700 border-red-200',
    };
    return colors[status] || 'bg-gray-50 text-gray-700 border-gray-200';
  };

  const statusOptions = [
    { value: 'pending', label: 'En attente' },
    { value: 'paid', label: 'Payée' },
    { value: 'shipped', label: 'Expédiée' },
    { value: 'delivered', label: 'Livrée' },
    { value: 'cancelled', label: 'Annulée' },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Icons.Loading />
        <span className="ml-2 text-gray-500">Chargement des commandes...</span>
      </div>
    );
  }

  return (
    <div>
      {/* En-tête */}
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2.5 bg-gray-900 rounded-xl text-white">
          <Icons.ShoppingBag />
        </div>
        <h1 className="text-2xl font-bold text-gray-900">Commandes</h1>
        <span className="text-sm text-gray-400 bg-gray-100 px-3 py-1 rounded-full">
          {orders.length} commande{orders.length > 1 ? 's' : ''}
        </span>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Liste des commandes */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50/80">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">N°</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Client</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {orders.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="px-4 py-12 text-center text-gray-400">
                        <div className="flex flex-col items-center gap-2">
                          <Icons.ShoppingBag />
                          <span>Aucune commande</span>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    orders.map((order) => (
                      <tr 
                        key={order.id} 
                        className={`hover:bg-gray-50/50 transition-colors cursor-pointer ${
                          selectedOrder?.id === order.id ? 'bg-gray-50' : ''
                        }`}
                        onClick={() => setSelectedOrder(order)}
                      >
                        <td className="px-4 py-3 text-sm font-medium text-gray-900">
                          {order.orderNumber}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-600">
                          <span className="inline-flex items-center gap-1.5">
                            <Icons.User />
                            {order.user.firstName} {order.user.lastName}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm font-semibold text-gray-900">
                          <span className="inline-flex items-center gap-1">
                            <Icons.Euro />
                            {order.total.toFixed(2)}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${getStatusColor(order.status)}`}>
                            {getStatusLabel(order.status)}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-400">
                          <span className="inline-flex items-center gap-1.5">
                            <Icons.Calendar />
                            {new Date(order.createdAt).toLocaleDateString('fr-FR')}
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

        {/* Détail de la commande */}
        <div className="lg:col-span-1">
          {selectedOrder ? (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sticky top-4">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Icons.Package />
                Détail commande
              </h2>
              
              <div className="flex items-center justify-between text-sm mb-4">
                <span className="font-medium text-gray-900">{selectedOrder.orderNumber}</span>
                <span className="text-gray-400 flex items-center gap-1.5">
                  <Icons.Calendar />
                  {new Date(selectedOrder.createdAt).toLocaleDateString('fr-FR')}
                </span>
              </div>

              {/* Client */}
              <div className="border-t border-gray-100 pt-4 mb-4">
                <h3 className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-2">Client</h3>
                <p className="text-sm font-medium text-gray-900">
                  {selectedOrder.user.firstName} {selectedOrder.user.lastName}
                </p>
                <p className="text-sm text-gray-500">{selectedOrder.user.email}</p>
              </div>

              {/* 👇 CORRECTION : Adresse parsée */}
              <div className="border-t border-gray-100 pt-4 mb-4">
                <h3 className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <Icons.Home />
                  Livraison
                </h3>
                {(() => {
                  try {
                    const address = JSON.parse(selectedOrder.address);
                    return (
                      <div className="text-sm text-gray-600 space-y-0.5">
                        <p>{address.address || ''}</p>
                        <p>{address.postalCode || ''} {address.city || ''}</p>
                        <p>{address.country || ''}</p>
                      </div>
                    );
                  } catch (e) {
                    return (
                      <p className="text-sm text-gray-600 whitespace-pre-line">
                        {selectedOrder.address}
                      </p>
                    );
                  }
                })()}
              </div>

              {/* 👇 CORRECTION : Articles avec affichage sécurisé */}
              <div className="border-t border-gray-100 pt-4 mb-4">
                <h3 className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <Icons.Package />
                  Articles
                </h3>
                <div className="space-y-1.5">
                  {selectedOrder.items.map((item) => (
                    <div key={item.id} className="flex justify-between text-sm py-1.5 border-b border-gray-50">
                      <span className="text-gray-600">
                        {item.product?.name || 'Produit supprimé'} 
                        {item.size && <span className="text-gray-400"> ({item.size})</span>}
                        {item.color && <span className="text-gray-400"> - {item.color}</span>}
                        <span className="text-gray-400 ml-1">×{item.quantity}</span>
                      </span>
                      <span className="font-medium text-gray-900">
                        {(item.price * item.quantity).toFixed(2)} €
                      </span>
                    </div>
                  ))}
                </div>
                <div className="flex justify-between font-bold text-base mt-3 pt-3 border-t border-gray-200">
                  <span>Total</span>
                  <span className="flex items-center gap-1">
                    <Icons.Euro />
                    {selectedOrder.total.toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Changer le statut */}
              <div className="border-t border-gray-100 pt-4">
                <h3 className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <Icons.Truck />
                  Statut
                </h3>
                <div className="flex flex-wrap gap-2">
                  {statusOptions.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => updateStatus(selectedOrder.id, option.value)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                        selectedOrder.status === option.value
                          ? 'bg-gray-900 text-white shadow-sm'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center">
              <div className="inline-flex p-4 bg-gray-100 rounded-full mb-3">
                <Icons.ShoppingBag />
              </div>
              <p className="text-gray-500 font-medium">Sélectionnez une commande</p>
              <p className="text-sm text-gray-400">pour voir les détails</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default AdminOrders;