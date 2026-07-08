// frontend/src/Account.jsx

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuthStore } from './store/authStore';
import { orderService } from './services';
import { Icons } from './icons';

function Account() {
  const { user, isAuthenticated, logout } = useAuthStore();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) return;

    const fetchOrders = async () => {
      try {
        setLoading(true);
        const response = await orderService.getByUser(user.id);
        setOrders(response.data);
      } catch (error) {
        console.error('Erreur:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [isAuthenticated, user?.id]);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="text-center">
          <div className="inline-flex p-6 bg-gray-100 rounded-full mb-4">
            <Icons.User />
          </div>
          <p className="text-xl text-gray-600 mb-4">Veuillez vous connecter</p>
          <Link to="/login" className="inline-block bg-gray-900 text-white px-8 py-3 rounded-xl hover:bg-gray-800 transition-all font-medium hover:shadow-lg hover:shadow-gray-900/20">
            Se connecter
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors text-sm">
              <Icons.ArrowLeft />
              Retour
            </Link>
            <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <Icons.User />
              Mon compte
            </h1>
            <button 
              onClick={logout}
              className="inline-flex items-center gap-1.5 text-sm text-gray-400 hover:text-red-500 transition-colors"
            >
              <Icons.Logout />
              Déconnexion
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* Infos utilisateur */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Icons.User />
            Mes informations
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 bg-gray-50 rounded-xl">
              <p className="text-xs text-gray-400 uppercase tracking-wider">Prénom</p>
              <p className="font-medium text-gray-900 mt-1">{user?.firstName}</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-xl">
              <p className="text-xs text-gray-400 uppercase tracking-wider">Nom</p>
              <p className="font-medium text-gray-900 mt-1">{user?.lastName}</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-xl">
              <p className="text-xs text-gray-400 uppercase tracking-wider">Email</p>
              <p className="font-medium text-gray-900 mt-1 flex items-center gap-1.5">
                <Icons.Envelope />
                {user?.email}
              </p>
            </div>
          </div>
        </div>

        {/* Historique des commandes */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Icons.Package />
            Mes commandes
          </h2>

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Icons.Loading />
              <span className="ml-2 text-gray-500">Chargement...</span>
            </div>
          ) : orders.length === 0 ? (
            <div className="text-center py-12">
              <div className="inline-flex p-4 bg-gray-100 rounded-full mb-4">
                <Icons.ShoppingBag />
              </div>
              <p className="text-gray-500">Aucune commande pour le moment</p>
              <Link to="/" className="mt-4 inline-block bg-gray-900 text-white px-6 py-2.5 rounded-xl hover:bg-gray-800 transition-all text-sm font-medium">
                Découvrir les sacs
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {orders.map((order) => (
                <div key={order.id} className="border border-gray-100 rounded-xl p-4 hover:border-gray-200 transition-colors">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <div className="flex items-center gap-4">
                      <div className="p-2 bg-gray-100 rounded-lg">
                        <Icons.Package />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 text-sm">{order.orderNumber}</p>
                        <p className="text-xs text-gray-400 flex items-center gap-1">
                          <Icons.Calendar />
                          {new Date(order.createdAt).toLocaleDateString('fr-FR', {
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric'
                          })}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="font-bold text-gray-900 text-sm flex items-center gap-1">
                          <Icons.Euro />
                          {order.total.toFixed(2)}
                        </p>
                        <p className="text-xs text-gray-400">{order.items.length} article(s)</p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        order.status === 'paid' ? 'bg-blue-100 text-blue-800' :
                        order.status === 'shipped' ? 'bg-purple-100 text-purple-800' :
                        order.status === 'delivered' ? 'bg-emerald-100 text-emerald-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {order.status === 'pending' ? 'En attente' :
                         order.status === 'paid' ? 'Payée' :
                         order.status === 'shipped' ? 'Expédiée' :
                         order.status === 'delivered' ? 'Livrée' :
                         'Annulée'}
                      </span>
                    </div>
                  </div>
                  
                  {/* Affichage de l'adresse */}
                  {order.address && (
                    <div className="mt-2 pt-2 border-t border-gray-50">
                      <p className="text-xs text-gray-400 flex items-center gap-1">
                        <Icons.Home />
                        {(() => {
                          try {
                            const addr = JSON.parse(order.address);
                            return `${addr.address}, ${addr.postalCode} ${addr.city}, ${addr.country}`;
                          } catch (e) {
                            return order.address;
                          }
                        })()}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default Account;