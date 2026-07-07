// frontend/src/App.jsx
import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { useCartStore } from './store/cartStore';
import { useAuthStore } from './store/authStore';

function App() {
  const [products, setProducts] = useState([]);
  const [featured, setFeatured] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user, isAuthenticated, logout } = useAuthStore();
  const totalItems = useCartStore((state) => state.getTotalItems());

  // Fonction pour récupérer les produits
  const fetchProducts = async () => {
    try {
      setLoading(true);
      
      // Récupérer tous les produits
      const productsRes = await axios.get('http://localhost:5000/api/products');
      setProducts(productsRes.data);
      
      // Récupérer les produits en vedette
      const featuredRes = await axios.get('http://localhost:5000/api/products/featured');
      setFeatured(featuredRes.data);
      
      setError('');
    } catch (err) {
      console.error('Erreur:', err);
      setError('Impossible de charger les produits');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Affichage pendant le chargement
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

  // Affichage en cas d'erreur
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-red-600 text-xl">❌ {error}</p>
          <button 
            onClick={fetchProducts}
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
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-6 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">👜 Luxe Bags</h1>
            <p className="text-gray-600 mt-1">{products.length} sacs disponibles</p>
          </div>
          
          {/* Icône du panier */}
          <div className="relative">
            <Link to="/cart" className="relative">
              <button className="text-2xl p-2 hover:bg-gray-100 rounded-full transition-colors">
                🛒
                {totalItems > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                    {totalItems}
                  </span>
                )}
              </button>
            </Link>
          </div>

          <div className="flex items-center gap-4">
            {isAuthenticated ? (
              <>
               <Link to="/account" className="text-sm text-gray-600 hover:text-gray-900">
                👤 {user?.firstName}
              </Link>
                <button 
                  onClick={logout}
                  className="text-sm text-gray-600 hover:text-gray-900"
                >
                  Déconnexion
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-sm text-gray-600 hover:text-gray-900">
                  Connexion
                </Link>
                <Link to="/register" className="text-sm bg-gray-900 text-white px-4 py-2 rounded hover:bg-gray-800">
                  Inscription
                </Link>
              </>
            )}
          </div>

        </div>
      </header>

      {/* CONTENU PRINCIPAL */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        
        {/* SECTION : PRODUITS EN VEDETTE */}
        {featured.length > 0 && (
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              ⭐ Nos coups de cœur
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
            🛍️ Tous nos sacs
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

// COMPOSANT : Carte produit
function ProductCard({ product }) {
  // Prix barré (si promotion)
  const hasDiscount = product.comparePrice && product.comparePrice > product.price;
  
  // Calcul du pourcentage de réduction
  const discountPercentage = hasDiscount 
    ? Math.round(((product.comparePrice - product.price) / product.comparePrice) * 100)
    : 0;

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      {/* Image */}
      <div className="relative h-48 bg-gray-200">
        {product.images && product.images.length > 0 ? (
          <img 
            src={product.images[0]} 
            alt={product.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            👜
          </div>
        )}
        
        {/* Badge "Nouveauté" */}
        {product.isNew && (
          <span className="absolute top-2 left-2 bg-green-500 text-white text-xs px-2 py-1 rounded">
            Nouveau
          </span>
        )}
        
        {/* Badge "Promo" */}
        {hasDiscount && (
          <span className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded">
            -{discountPercentage}%
          </span>
        )}
      </div>

      {/* Infos produit */}
      <div className="p-4">
        <div className="flex items-center justify-between mb-1">
          <span className="text-xs text-gray-500 uppercase">
            {product.gender === 'femme' ? '👩 Femme' : 
             product.gender === 'homme' ? '👨 Homme' : 
             '👤 Unisexe'}
          </span>
          <span className="text-xs text-gray-400">
            {product.sizes?.join(', ')}
          </span>
        </div>
        
        <h3 className="font-semibold text-gray-900 text-sm mb-1 line-clamp-2">
          {product.name}
        </h3>
        
        <div className="flex items-center justify-between mt-2">
          <div>
            <span className="text-lg font-bold text-gray-900">
              {product.price.toFixed(2)} €
            </span>
            {hasDiscount && (
              <span className="text-sm text-gray-400 line-through ml-2">
                {product.comparePrice.toFixed(2)} €
              </span>
            )}
          </div>
          <div className="flex items-center">
            <span className="text-yellow-400">★</span>
            <span className="text-sm text-gray-600 ml-1">
              {product.rating?.toFixed(1) || '0'}
            </span>
          </div>
        </div>

       {/* Couleurs disponibles */}
{product.colors && product.colors.length > 0 && (
  <div className="flex gap-1 mt-2">
    {product.colors.slice(0, 4).map((color) => {
      // Convertir le nom de la couleur en code hexadécimal
      const colorMap = {
        'Noir': '#1a1a1a',
        'Marron': '#8B4513',
        'Beige': '#F5F5DC',
        'Kaki': '#BDB76B',
        'Rose': '#FFB6C1',
        'Blanc': '#FFFFFF',
        'Gris': '#808080',
        'Vert': '#006400',
        'Or': '#FFD700',
        'Bordeaux': '#800020',
        'Rouge': '#FF0000',
        'Bleu': '#0000FF',
        'Jaune': '#FFFF00',
      };
      
      const bgColor = colorMap[color] || '#cccccc';
      
      return (
        <span 
          key={color}
          className="w-5 h-5 rounded-full border border-gray-300 inline-flex items-center justify-center text-[8px]"
          style={{ backgroundColor: bgColor }}
          title={color}
        >
          {color === 'Blanc' && <span className="text-gray-400">⬜</span>}
        </span>
      );
    })}
    {product.colors.length > 4 && (
      <span className="text-xs text-gray-400 ml-1 flex items-center">
        +{product.colors.length - 4}
      </span>
    )}
  </div>
)}

        {/* Bouton Voir détails */}
        <Link to={`/product/${product.id}`}>
          <button className="mt-3 w-full bg-gray-900 text-white py-2 rounded hover:bg-gray-800 transition-colors text-sm">
            Voir le sac
          </button>
        </Link>
      </div>
    </div>
  );
}

export default App;