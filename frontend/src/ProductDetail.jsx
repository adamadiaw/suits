// frontend/src/ProductDetail.jsx

import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useCartStore } from './store/cartStore';
import Toast from './components/Toast';

// Icônes SVG
const Icons = {
  ArrowLeft: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
    </svg>
  ),
  Star: () => (
    <svg className="w-6 h-6 fill-current text-yellow-400" viewBox="0 0 20 20">
      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
    </svg>
  ),
  Cart: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
    </svg>
  ),
  Check: () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
    </svg>
  ),
  X: () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
    </svg>
  ),
  Package: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10" />
    </svg>
  ),
  Ruler: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
    </svg>
  ),
  Palette: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
    </svg>
  ),
  Loading: () => (
    <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
    </svg>
  ),
};

function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);
  const [toast, setToast] = useState(null);
  const addItem = useCartStore((state) => state.addItem);

  const handleAddToCart = () => {
    // Si taille ou couleur sont requises mais non sélectionnées
    // (optionnel : on peut laisser passer sans)
    addItem(product, selectedSize, selectedColor);
    
    // Afficher la notification
    setToast({
      message: ` ${product.name} ajouté au panier !`,
      type: 'success'
    });
    
    // Rediriger vers l'accueil après 1.5s
    setTimeout(() => {
      navigate('/');
    }, 1500);
  };

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`http://localhost:5000/api/products/${id}`);
      setProduct(response.data);
      setError('');
    } catch (err) {
      setError('Produit non trouvé');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProduct();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Chargement du produit...</p>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-red-600 text-xl">❌ {error || 'Produit non trouvé'}</p>
          <Link to="/" className="mt-4 inline-block px-4 py-2 bg-gray-900 text-white rounded">
            Retour à la boutique
          </Link>
        </div>
      </div>
    );
  }

  const hasDiscount = product.comparePrice && product.comparePrice > product.price;
  const discountPercentage = hasDiscount 
    ? Math.round(((product.comparePrice - product.price) / product.comparePrice) * 100)
    : 0;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Notification */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
      
      {/* Header avec bouton retour */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <Link to="/" className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors text-sm">
            <Icons.ArrowLeft />
            Retour à la boutique
          </Link>
        </div>
      </header>

      {/* Contenu de la page */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="grid md:grid-cols-2 gap-8 p-6 md:p-8">
            
            {/* Colonne 1 : Image */}
            <div className="bg-gray-100 rounded-2xl h-96 md:h-[500px] flex items-center justify-center overflow-hidden">
              {product.images && product.images.length > 0 ? (
                <img 
                  src={product.images[0]} 
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <Icons.Package />
              )}
            </div>

            {/* Colonne 2 : Infos du produit */}
            <div className="flex flex-col">
              <div className="flex items-start justify-between">
                <h1 className="text-3xl font-bold text-gray-900">
                  {product.name}
                </h1>
                {hasDiscount && (
                  <span className="bg-gradient-to-r from-red-500 to-red-600 text-white text-sm px-3 py-1 rounded-full font-bold">
                    -{discountPercentage}%
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2 mt-2">
                <Icons.Star />
                <span className="text-lg font-semibold text-gray-900">{product.rating?.toFixed(1) || '0'}</span>
                <span className="text-gray-400 text-sm">· {product.reviewsCount || 0} avis</span>
              </div>

              <div className="mt-4">
                <span className="text-3xl font-bold text-gray-900">
                  {product.price.toFixed(2)} €
                </span>
                {hasDiscount && (
                  <span className="text-xl text-gray-400 line-through ml-3">
                    {product.comparePrice.toFixed(2)} €
                  </span>
                )}
              </div>

              <div className="mt-4">
                <p className="text-gray-600 leading-relaxed">
                  {product.description}
                </p>
              </div>

              <div className="mt-6 space-y-4">
                {/* Couleurs */}
                {product.colors && product.colors.length > 0 && (
                  <div>
                    <h3 className="font-medium text-gray-700 mb-2 flex items-center gap-2">
                      <Icons.Palette />
                      Couleurs disponibles
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {product.colors.map((color) => (
                        <button
                          key={color}
                          onClick={() => setSelectedColor(color)}
                          className={`px-4 py-2 rounded-xl text-sm border transition-all ${
                            selectedColor === color
                              ? 'border-gray-900 bg-gray-900 text-white'
                              : 'border-gray-200 hover:border-gray-400 text-gray-700'
                          }`}
                        >
                          {color}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Tailles */}
                {product.sizes && product.sizes.length > 0 && (
                  <div>
                    <h3 className="font-medium text-gray-700 mb-2 flex items-center gap-2">
                      <Icons.Ruler />
                      Tailles
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {product.sizes.map((size) => (
                        <button
                          key={size}
                          onClick={() => setSelectedSize(size)}
                          className={`px-4 py-2 rounded-xl text-sm border transition-all ${
                            selectedSize === size
                              ? 'border-gray-900 bg-gray-900 text-white'
                              : 'border-gray-200 hover:border-gray-400 text-gray-700'
                          }`}
                        >
                          {size}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Stock */}
                <div className="pt-2">
                  <p className={`text-sm ${product.stock > 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                    {product.stock > 0 ? (
                      <span className="flex items-center gap-1">
                        <Icons.Check />
                        En stock ({product.stock} disponibles)
                      </span>
                    ) : (
                      <span className="flex items-center gap-1">
                        <Icons.X />
                        Rupture de stock
                      </span>
                    )}
                  </p>
                </div>
              </div>

              {/* Bouton Ajouter au panier */}
              <div className="mt-6 pt-6 border-t border-gray-100">
                <button 
                  onClick={handleAddToCart}
                  className="w-full bg-gray-900 text-white py-3.5 rounded-xl hover:bg-gray-800 transition-all font-semibold flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg hover:shadow-gray-900/20"
                  disabled={product.stock === 0}
                >
                  <Icons.Cart />
                  {product.stock > 0 ? 'Ajouter au panier' : 'Rupture de stock'}
                </button>
                {selectedColor && selectedSize && product.stock > 0 && (
                  <p className="text-xs text-gray-400 text-center mt-2">
                    ✓ {selectedColor} · {selectedSize}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default ProductDetail;