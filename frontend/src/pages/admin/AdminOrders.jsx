// frontend/src/AdminOrders.jsx

import { useState, useEffect } from 'react';
import { useAuthStore } from '../../store/authStore';
import { orderService } from '../../services';
import { Icons } from '../../icons';

function AdminOrders() {
  const { token } = useAuthStore();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await orderService.adminGetAll();
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
      await orderService.adminUpdateStatus(orderId, newStatus);
      
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

              {/* Adresse parsée */}
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

              {/* Articles avec affichage sécurisé */}
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