// frontend/src/ProductDetail.jsx

import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useCartStore } from '../store/cartStore';
import { productService } from '../services';
import Toast from '../components/Toast';
import { Icons } from '../icons';

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
    addItem(product, selectedSize, selectedColor);
    
    setToast({
      message: `${product.name} ajouté au panier !`,
      type: 'success'
    });
    
    setTimeout(() => {
      navigate('/');
    }, 1500);
  };

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const response = await productService.getById(id);
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
          <p className="text-red-600 text-xl">{error || 'Produit non trouvé'}</p>
          <Link to="/" className="mt-4 inline-block px-4 py-2 bg-gray-900 text-white rounded-xl hover:bg-gray-800 transition-colors">
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
      
      {/* Header */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <Link to="/" className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors text-sm">
            <Icons.ArrowLeft />
            Retour à la boutique
          </Link>
        </div>
      </header>

      {/* Contenu */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="grid md:grid-cols-2 gap-8 p-6 md:p-8">
            
            {/* Image */}
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

            {/* Infos produit */}
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

              {/* Ajouter au panier */}
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