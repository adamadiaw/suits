// frontend/src/App.jsx

import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { useCartStore } from './store/cartStore';
import { useAuthStore } from './store/authStore';
import { useTenantStore } from './store/tenantStore';

// Icônes SVG
const Icons = {
  Bag: () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
    </svg>
  ),
  Cart: () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
    </svg>
  ),
  User: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
  ),
  Logout: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
    </svg>
  ),
  Star: () => (
    <svg className="w-4 h-4 fill-current text-yellow-400" viewBox="0 0 20 20">
      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
    </svg>
  ),
  Admin: () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  ),
  ChevronDown: () => (
    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
    </svg>
  ),
  BagPlaceholder: () => (
    <svg className="w-16 h-16 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
    </svg>
  ),
};

function App() {
  const [products, setProducts] = useState([]);
  const [featured, setFeatured] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const { user, isAuthenticated, logout } = useAuthStore();
  const { tenants, currentTenant, loadTenants, setCurrentTenant, loadCurrentTenant } = useTenantStore();
  const totalItems = useCartStore((state) => state.getTotalItems());

  useEffect(() => {
    const savedTenant = loadCurrentTenant();
    loadTenants().then(() => {
      if (!savedTenant && tenants.length > 0) {
        setCurrentTenant(tenants[0]);
      }
    });
  }, []);

  useEffect(() => {
    if (!currentTenant) return;

    const fetchProducts = async () => {
      try {
        setLoading(true);
        
        const productsRes = await axios.get('http://localhost:5000/api/products', {
          params: { tenantId: currentTenant.id }
        });
        setProducts(productsRes.data);
        
        const featuredRes = await axios.get('http://localhost:5000/api/products/featured', {
          params: { tenantId: currentTenant.id }
        });
        setFeatured(featuredRes.data);
        
        setError('');
      } catch (err) {
        console.error('Erreur:', err);
        setError('Impossible de charger les produits');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [currentTenant]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Chargement des sacs...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-red-600 text-xl">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* HEADER */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="text-gray-800">
                <Icons.Bag />
              </div>
              <div>
                <h1 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                  Luxe Bags
                </h1>
                <p className="text-xs text-gray-400 -mt-1">Collections exclusives</p>
              </div>
            </div>

            {/* Sélecteur de boutique */}
            <div className="flex items-center gap-4">
              <div className="relative">
                <select
                  value={currentTenant?.id || ''}
                  onChange={(e) => {
                    const tenant = tenants.find(t => t.id === e.target.value);
                    if (tenant) setCurrentTenant(tenant);
                  }}
                  className="appearance-none bg-gray-50 border border-gray-200 rounded-full px-4 py-2 pr-10 text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-gray-900"
                >
                  {tenants.map((tenant) => (
                    <option key={tenant.id} value={tenant.id}>
                      {tenant.name}
                    </option>
                  ))}
                </select>
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                  <Icons.ChevronDown />
                </div>
              </div>

              {/* Panier */}
              <Link to="/cart" className="relative p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-700">
                <Icons.Cart />
                {totalItems > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center font-bold">
                    {totalItems}
                  </span>
                )}
              </Link>

              {/* Auth */}
              {isAuthenticated ? (
                <div className="flex items-center gap-3">
                  <Link to="/account" className="flex items-center gap-1 text-sm text-gray-600 hover:text-gray-900 transition-colors">
                    <Icons.User />
                    {user?.firstName}
                  </Link>
                  {user?.role === 'admin' && (
                    <Link to="/admin" className="flex items-center gap-1 text-sm bg-gray-900 text-white px-3 py-1 rounded-full hover:bg-gray-800 transition-colors">
                      <Icons.Admin />
                      Admin
                    </Link>
                  )}
                  <button 
                    onClick={logout}
                    className="flex items-center gap-1 text-sm text-gray-400 hover:text-red-500 transition-colors"
                  >
                    <Icons.Logout />
                    Déconnexion
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Link to="/login" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
                    Connexion
                  </Link>
                  <Link to="/register" className="text-sm bg-gray-900 text-white px-4 py-2 rounded-full hover:bg-gray-800 transition-colors">
                    S'inscrire
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* CONTENU PRINCIPAL */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        
        {/* SECTION : PRODUITS EN VEDETTE */}
        {featured.length > 0 && (
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <Icons.Star />
              Nos coups de cœur
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featured.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </section>
        )}

        {/* SECTION : TOUS LES PRODUITS */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Tous nos sacs
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}

function ProductCard({ product }) {
  const hasDiscount = product.comparePrice && product.comparePrice > product.price;
  const discountPercentage = hasDiscount 
    ? Math.round(((product.comparePrice - product.price) / product.comparePrice) * 100)
    : 0;

  return (
    <div className="product-card bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 group fade-in">
      {/* Image */}
      <div className="relative h-64 bg-gray-100 overflow-hidden">
        {product.images && product.images.length > 0 ? (
          <img 
            src={product.images[0]} 
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-300">
            <Icons.BagPlaceholder />
          </div>
        )}
        
        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1">
          {product.isNew && (
            <span className="bg-emerald-500 text-white text-xs px-3 py-1 rounded-full font-medium">
              Nouveau
            </span>
          )}
          {hasDiscount && (
            <span className="bg-gradient-to-r from-red-500 to-red-600 text-white text-xs px-3 py-1 rounded-full font-bold">
              -{discountPercentage}%
            </span>
          )}
        </div>
      </div>

      {/* Contenu */}
      <div className="p-4">
        {/* Genre et tailles */}
        <div className="flex items-center justify-between text-xs text-gray-400 mb-2">
          <span>
            {product.gender === 'femme' ? 'Femme' : 
             product.gender === 'homme' ? 'Homme' : 
             'Unisexe'}
          </span>
          <span>{product.sizes?.join(' · ')}</span>
        </div>
        
        {/* Nom */}
        <h3 className="font-semibold text-gray-900 text-sm mb-1 line-clamp-2 leading-relaxed">
          {product.name}
        </h3>
        
        {/* Prix */}
        <div className="flex items-baseline justify-between mt-3">
          <div>
            <span className="text-xl font-bold text-gray-900">
              {product.price.toFixed(2)} €
            </span>
            {hasDiscount && (
              <span className="text-sm text-gray-400 line-through ml-2">
                {product.comparePrice.toFixed(2)} €
              </span>
            )}
          </div>
          <div className="flex items-center gap-1">
            <Icons.Star />
            <span className="text-sm font-medium text-gray-600">
              {product.rating?.toFixed(1) || '0'}
            </span>
          </div>
        </div>

        {/* Couleurs */}
        {product.colors && product.colors.length > 0 && (
          <div className="flex gap-1.5 mt-3">
            {product.colors.slice(0, 4).map((color) => (
              <span 
                key={color}
                className="w-5 h-5 rounded-full border-2 border-white shadow-sm ring-1 ring-gray-200"
                style={{ backgroundColor: color.toLowerCase() }}
                title={color}
              />
            ))}
            {product.colors.length > 4 && (
              <span className="text-xs text-gray-400 flex items-center ml-1">
                +{product.colors.length - 4}
              </span>
            )}
          </div>
        )}

        {/* Bouton */}
        <Link to={`/product/${product.id}`}>
          <button className="mt-4 w-full bg-gray-900 text-white py-2.5 rounded-full hover:bg-gray-800 transition-all text-sm font-medium hover:shadow-lg hover:shadow-gray-900/20">
            Voir le sac
          </button>
        </Link>
      </div>
    </div>
  );
}

export default App;