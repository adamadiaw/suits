// frontend/src/AdminOrders.jsx

import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuthStore } from './store/authStore';

function AdminOrders() {
  const { token } = useAuthStore();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);

  // Récupérer toutes les commandes
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

  // Changer le statut d'une commande
  const updateStatus = async (orderId, newStatus) => {
    try {
      await axios.put(
        `http://localhost:5000/api/admin/orders/${orderId}/status`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      // Recharger la liste
      fetchOrders();
      
      // Mettre à jour le détail si ouvert
      if (selectedOrder && selectedOrder.id === orderId) {
        setSelectedOrder(null);
      }
    } catch (error) {
      console.error('Erreur:', error);
      alert('Erreur lors du changement de statut');
    }
  };

  // Traduire le statut en français
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

  // Couleur du statut
  const getStatusColor = (status) => {
    const colors = {
      'pending': 'bg-yellow-100 text-yellow-800',
      'paid': 'bg-blue-100 text-blue-800',
      'shipped': 'bg-purple-100 text-purple-800',
      'delivered': 'bg-green-100 text-green-800',
      'cancelled': 'bg-red-100 text-red-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  // Statuts disponibles
  const statusOptions = [
    { value: 'pending', label: 'En attente' },
    { value: 'paid', label: 'Payée' },
    { value: 'shipped', label: 'Expédiée' },
    { value: 'delivered', label: 'Livrée' },
    { value: 'cancelled', label: 'Annulée' },
  ];

  if (loading) {
    return <div className="text-center py-8">Chargement...</div>;
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-6">📋 Commandes</h1>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Liste des commandes */}
        <div className="md:col-span-2">
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">N° Commande</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Client</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Total</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Statut</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {orders.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="px-4 py-8 text-center text-gray-500">
                      Aucune commande pour le moment
                    </td>
                  </tr>
                ) : (
                  orders.map((order) => (
                    <tr 
                      key={order.id} 
                      className={`hover:bg-gray-50 cursor-pointer ${
                        selectedOrder?.id === order.id ? 'bg-blue-50' : ''
                      }`}
                      onClick={() => setSelectedOrder(order)}
                    >
                      <td className="px-4 py-3 text-sm font-medium text-gray-900">
                        {order.orderNumber}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">
                        {order.user.firstName} {order.user.lastName}
                      </td>
                      <td className="px-4 py-3 text-sm font-semibold text-gray-900">
                        {order.total.toFixed(2)} €
                      </td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 rounded text-xs ${getStatusColor(order.status)}`}>
                          {getStatusLabel(order.status)}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-500">
                        {new Date(order.createdAt).toLocaleDateString('fr-FR')}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Détail de la commande */}
        <div className="md:col-span-1">
          {selectedOrder ? (
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                Détail commande
              </h2>
              
              <p className="text-sm text-gray-500 mb-1">
                {selectedOrder.orderNumber}
              </p>
              <p className="text-sm text-gray-500 mb-4">
                {new Date(selectedOrder.createdAt).toLocaleDateString('fr-FR')}
              </p>

              {/* Client */}
              <div className="border-t pt-4 mb-4">
                <h3 className="font-semibold text-gray-700 mb-2">Client</h3>
                <p className="text-sm">
                  {selectedOrder.user.firstName} {selectedOrder.user.lastName}
                </p>
                <p className="text-sm text-gray-600">{selectedOrder.user.email}</p>
              </div>

              {/* Adresse */}
              <div className="border-t pt-4 mb-4">
                <h3 className="font-semibold text-gray-700 mb-2">Livraison</h3>
                <p className="text-sm text-gray-600 whitespace-pre-line">
                  {selectedOrder.address}
                </p>
              </div>

              {/* Articles */}
              <div className="border-t pt-4 mb-4">
                <h3 className="font-semibold text-gray-700 mb-2">Articles</h3>
                {selectedOrder.items.map((item) => (
                  <div key={item.id} className="flex justify-between text-sm py-1 border-b">
                    <span>
                      {item.product.name} 
                      {item.size && ` (${item.size})`}
                      {item.color && ` - ${item.color}`}
                      <span className="text-gray-500"> x{item.quantity}</span>
                    </span>
                    <span className="font-semibold">
                      {(item.price * item.quantity).toFixed(2)} €
                    </span>
                  </div>
                ))}
                <div className="flex justify-between font-bold text-lg mt-2 pt-2 border-t">
                  <span>Total</span>
                  <span>{selectedOrder.total.toFixed(2)} €</span>
                </div>
              </div>

              {/* Changer le statut */}
              <div className="border-t pt-4">
                <h3 className="font-semibold text-gray-700 mb-2">Statut</h3>
                <div className="flex flex-wrap gap-2">
                  {statusOptions.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => updateStatus(selectedOrder.id, option.value)}
                      className={`px-3 py-1 rounded text-sm transition-colors ${
                        selectedOrder.status === option.value
                          ? 'bg-gray-900 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <p className="text-gray-500">Sélectionnez une commande</p>
              <p className="text-sm text-gray-400">pour voir les détails</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default AdminOrders;