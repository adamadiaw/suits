// frontend/src/App.jsx

import { useState, useEffect } from 'react';
import { productService } from '../services';
import { useTenantStore } from '../store/tenantStore';
import { useCart } from '../hooks/useCart';
import ProductCard from '../components/shared/ProductCard';
import Header from '../components/layout/Header';
import { Icons } from '../icons';
import ProductFilters from '../components/shared/ProductFilters';

function App() {
  const [products, setProducts] = useState([]);
  const [featured, setFeatured] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    gender: 'all',
    minPrice: '',
    maxPrice: '',
    sizes: [],
  });
  const [isFilterOpen, setIsFilterOpen] = useState(false); // 👈 AJOUT

  const { currentTenant, loadTenants, setCurrentTenant, loadCurrentTenant, tenants } = useTenantStore();
  const { initCart } = useCart();

  // Fonction pour filtrer les produits
  const applyFilters = (products) => {
    return products.filter(product => {
      // Filtre genre
      if (filters.gender !== 'all' && product.gender !== filters.gender) {
        return false;
      }

      // Filtre prix min
      if (filters.minPrice && product.price < parseFloat(filters.minPrice)) {
        return false;
      }

      // Filtre prix max
      if (filters.maxPrice && product.price > parseFloat(filters.maxPrice)) {
        return false;
      }

      // Filtre tailles
      if (filters.sizes.length > 0) {
        const hasMatchingSize = product.sizes?.some(size => 
          filters.sizes.includes(size)
        );
        if (!hasMatchingSize) {
          return false;
        }
      }

      return true;
    });
  };

  // Appliquer les filtres ET la recherche
  const filteredProducts = applyFilters(
    products.filter(product =>
      product.name.toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  const filteredFeatured = applyFilters(
    featured.filter(product =>
      product.name.toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

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

  // Compter les filtres actifs
  const activeFiltersCount = 
    (filters.gender !== 'all' ? 1 : 0) + 
    (filters.minPrice || filters.maxPrice ? 1 : 0) + 
    filters.sizes.length;

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
      <Header onSearch={setSearchQuery} />

      <main className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 py-4 md:py-8">
        
        {/* SECTION : PRODUITS EN VEDETTE */}
        {filteredFeatured.length > 0 && (
          <section className="mb-12">
            <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-4 md:mb-6 flex items-center gap-2">
              <Icons.Star />
              Nos coups de cœur
              {searchQuery && (
                <span className="text-sm font-normal text-gray-400">
                  ({filteredFeatured.length} résultat{filteredFeatured.length > 1 ? 's' : ''})
                </span>
              )}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
              {filteredFeatured.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </section>
        )}

        {/* SECTION : TOUS LES PRODUITS */}
        <section>
          {/* En-tête avec titre et filtres */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4 md:mb-6">
            <h2 className="text-xl md:text-2xl font-bold text-gray-900">
              Tous nos produits
              {searchQuery && (
                <span className="text-sm font-normal text-gray-400 ml-2">
                  ({filteredProducts.length} résultat{filteredProducts.length > 1 ? 's' : ''})
                </span>
              )}
            </h2>
            <div className="flex items-center gap-2">
              <ProductFilters
                filters={filters}
                setFilters={setFilters}
                isOpen={isFilterOpen}
                onOpen={() => setIsFilterOpen(true)}
                onClose={() => setIsFilterOpen(false)}
                activeCount={activeFiltersCount}
              />
            </div>
          </div>

          {filteredProducts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">Aucun produit ne correspond à votre recherche</p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setFilters({
                    gender: 'all',
                    minPrice: '',
                    maxPrice: '',
                    sizes: [],
                  });
                }}
                className="mt-4 text-sm text-gray-900 font-medium hover:underline"
              >
                Voir tous les produits
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

export default App;