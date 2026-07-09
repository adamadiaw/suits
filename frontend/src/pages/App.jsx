// frontend/src/App.jsx

import { useState, useEffect } from 'react';
import { productService } from '../services';
import { useTenantStore } from '../store/tenantStore';
import { useCart } from '../hooks/useCart';
import ProductCard from '../components/shared/ProductCard';
import Header from '../components/layout/Header';
import { Icons } from '../icons';

function App() {
  const [products, setProducts] = useState([]);
  const [featured, setFeatured] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const { currentTenant, loadTenants, setCurrentTenant, loadCurrentTenant, tenants } = useTenantStore();
  const { initCart } = useCart();

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
      <Header />

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

export default App;