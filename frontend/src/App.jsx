// frontend/src/App.jsx

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useCartStore } from './store/cartStore';
import { useAuthStore } from './store/authStore';
import { useTenantStore } from './store/tenantStore';
import logoOmnia from './assets/logo.png';
import TenantSelector from './components/TenantSelector';
import { Icons } from './icons';
import { productService } from './services';

function App() {
  const [products, setProducts] = useState([]);
  const [featured, setFeatured] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const { user, isAuthenticated, logout } = useAuthStore();
  const { tenants, currentTenant, loadTenants, setCurrentTenant, loadCurrentTenant } = useTenantStore();
  const totalItems = useCartStore((state) => state.getTotalItems());
  const initCart = useCartStore((state) => state.initCart);

  // Charger les boutiques au démarrage
  useEffect(() => {
    const savedTenant = loadCurrentTenant();
    loadTenants().then(() => {
      if (!savedTenant && tenants.length > 0) {
        setCurrentTenant(tenants[0]);
      }
    });
  }, []);

  // Quand currentTenant change, on initialise le panier
  useEffect(() => {
    if (currentTenant) {
      initCart(currentTenant.id);
    }
  }, [currentTenant, initCart]);

  // Récupérer les produits quand la boutique change
  useEffect(() => {
    if (!currentTenant) return;

    const fetchProducts = async () => {
      try {
        setLoading(true);
        
        const [productsRes, featuredRes] = await Promise.all([
          productService.getAll(currentTenant.id),
          productService.getFeatured(currentTenant.id)
        ]);
        
        setProducts(productsRes.data);
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

  // Gestion du changement de boutique
  const handleTenantChange = (tenantId) => {
    const tenant = tenants.find(t => t.id === tenantId);
    if (tenant) {
      setCurrentTenant(tenant);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Chargement des produits...</p>
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
            className="mt-4 px-4 py-2 bg-gray-900 text-white rounded-xl hover:bg-gray-800 transition-colors"
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
              <img 
                src={logoOmnia} 
                alt="OMNIA" 
                className="w-10 h-10 object-contain"
              />
              <div>
                <h1 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                  OMNIA
                </h1>
                <p className="text-xs text-gray-400 -mt-1">Collections exclusives</p>
              </div>
            </div>

            {/* Sélecteur de boutique + Actions */}
            <div className="flex items-center gap-4">
              <TenantSelector
                tenants={tenants}
                currentTenant={currentTenant}
                onSelect={handleTenantChange}
              />

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
            Tous nos produits
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

// COMPOSANT CARTE PRODUIT
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
        <div className="flex items-center justify-between text-xs text-gray-400 mb-2">
          <span>
            {product.gender === 'femme' ? 'Femme' : 
             product.gender === 'homme' ? 'Homme' : 
             'Unisexe'}
          </span>
          <span>{product.sizes?.join(' · ')}</span>
        </div>
        
        <h3 className="font-semibold text-gray-900 text-sm mb-1 line-clamp-2 leading-relaxed">
          {product.name}
        </h3>
        
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

        <Link to={`/product/${product.id}`}>
          <button className="mt-4 w-full bg-gray-900 text-white py-2.5 rounded-full hover:bg-gray-800 transition-all text-sm font-medium hover:shadow-lg hover:shadow-gray-900/20">
            Voir le produit
          </button>
        </Link>
      </div>
    </div>
  );
}

export default App;