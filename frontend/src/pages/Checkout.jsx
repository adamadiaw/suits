// frontend/src/Checkout.jsx

import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCartStore } from '../store/cartStore';
import { useAuthStore } from '../store/authStore';
import { useTenantStore } from '../store/tenantStore';
import { orderService } from '../services';
import { Icons } from '../icons';
import { logger } from '../utils/logger';

function Checkout() {
  const navigate = useNavigate();
  const { items, getTotalPrice, clearCart } = useCartStore();
  const totalPrice = getTotalPrice();
  const { user, isAuthenticated } = useAuthStore();
  const { currentTenant } = useTenantStore();

  // Pré-remplir le formulaire si l'utilisateur est connecté
  useEffect(() => {
    if (isAuthenticated && user) {
      setFormData(prev => ({
        ...prev,
        firstName: user.firstName || prev.firstName,
        lastName: user.lastName || prev.lastName,
        email: user.email || prev.email,
      }));
    }
  }, [isAuthenticated, user]);

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    postalCode: '',
    country: 'France',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Si le panier est vide, rediriger vers l'accueil
  if (items.length === 0 && !loading) {
    navigate('/');
    return null;
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const orderData = {
        items: items.map(item => ({
          productId: item.id,
          quantity: item.quantity,
          price: item.price,
          size: item.size,
          color: item.color,
        })),
        total: totalPrice,
        customer: formData,
        userId: isAuthenticated ? user.id : null,
        tenantId: currentTenant?.id,
      };

      logger.log('📦 Envoi de la commande...', orderData);

      const response = await orderService.create(orderData);
      
      logger.log('✅ Commande créée :', response.data);

      const orderId = response.data.order.orderNumber;
      const customerName = formData.firstName + ' ' + formData.lastName;

      clearCart();

      navigate('/confirmation', { 
        state: { 
          orderId: orderId,
          customerName: customerName
        }
      });

    } catch (err) {
      console.error('❌ Erreur:', err);
      setError('Une erreur est survenue. Veuillez réessayer.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <Link to="/cart" className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors text-sm">
            <Icons.ArrowLeft />
            Retour au panier
          </Link>
        </div>
      </header>

      {/* Contenu */}
      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex items-center gap-3 mb-8">
          <div className="p-3 bg-gray-900 rounded-xl text-white">
            <Icons.Checkout />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Finaliser ma commande</h1>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Formulaire */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
                <Icons.Truck />
                Informations de livraison
              </h2>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl mb-6 flex items-center gap-2 text-sm">
                  <span>⚠️</span>
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit}>
                {/* Prénom + Nom */}
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Prénom *
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                        <Icons.User />
                      </div>
                      <input
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        required
                        className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-gray-900 focus:border-transparent outline-none transition-all bg-gray-50/50"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Nom *
                    </label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-gray-900 focus:border-transparent outline-none transition-all bg-gray-50/50"
                    />
                  </div>
                </div>

                {/* Email + Téléphone */}
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Email *
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                        <Icons.Mail />
                      </div>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-gray-900 focus:border-transparent outline-none transition-all bg-gray-50/50"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Téléphone
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                        <Icons.Phone />
                      </div>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-gray-900 focus:border-transparent outline-none transition-all bg-gray-50/50"
                      />
                    </div>
                  </div>
                </div>

                {/* Adresse */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Adresse *
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                      <Icons.Home />
                    </div>
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      required
                      className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-gray-900 focus:border-transparent outline-none transition-all bg-gray-50/50"
                    />
                  </div>
                </div>

                {/* Ville + Code postal + Pays */}
                <div className="grid grid-cols-3 gap-4 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Ville *
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                        <Icons.MapPin />
                      </div>
                      <input
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleChange}
                        required
                        className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-gray-900 focus:border-transparent outline-none transition-all bg-gray-50/50"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Code postal *
                    </label>
                    <input
                      type="text"
                      name="postalCode"
                      value={formData.postalCode}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-gray-900 focus:border-transparent outline-none transition-all bg-gray-50/50"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Pays *
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                        <Icons.Globe />
                      </div>
                      <select
                        name="country"
                        value={formData.country}
                        onChange={handleChange}
                        className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-gray-900 focus:border-transparent outline-none transition-all bg-gray-50/50 appearance-none"
                      >
                        <option value="France">France</option>
                        <option value="Belgique">Belgique</option>
                        <option value="Suisse">Suisse</option>
                        <option value="Canada">Canada</option>
                      </select>
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gray-900 text-white py-3.5 rounded-xl hover:bg-gray-800 transition-all font-semibold text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg hover:shadow-gray-900/20 flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <Icons.Loading />
                      Traitement...
                    </>
                  ) : (
                    <>
                      <Icons.CreditCard />
                      Confirmer la commande
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>

          {/* Résumé de la commande */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sticky top-24">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Icons.Package />
                Résumé
              </h2>
              
              <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                {items.map((item) => (
                  <div key={item.id} className="flex justify-between text-sm py-2 border-b border-gray-100">
                    <span className="text-gray-600">{item.name} <span className="text-gray-400">×{item.quantity}</span></span>
                    <span className="font-medium text-gray-900">{(item.price * item.quantity).toFixed(2)} €</span>
                  </div>
                ))}
              </div>

              <div className="flex justify-between font-bold text-lg mt-4 pt-4 border-t border-gray-200">
                <span className="text-gray-900">Total</span>
                <span className="text-gray-900">{totalPrice.toFixed(2)} €</span>
              </div>

              <div className="mt-4 p-3 bg-gray-50 rounded-xl">
                <p className="text-xs text-gray-500 flex items-center gap-1">
                  <span>🔒</span>
                  Paiement sécurisé
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Checkout;