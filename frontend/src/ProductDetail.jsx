// frontend/src/ProductDetail.jsx

import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { useCartStore } from './store/cartStore';

function ProductDetail() {
  // useParams permet de récupérer l'ID dans l'URL
  // Exemple : /product/123 → id = "123"
  const { id } = useParams();
  
  // États pour gérer les données
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const addItem = useCartStore((state) => state.addItem);

  //fonction pour gérer le clic 
  const handleAddToCart = () => {
  addItem(product, null, null);
    // Pour l'instant on passe null pour taille et couleur
    // On améliorera plus tard avec une sélection
    };

  // Fonction pour récupérer le produit
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

  // useEffect : se lance quand la page s'ouvre ou quand l'ID change
  useEffect(() => {
    fetchProduct();
  }, [id]);

  // Affichage pendant le chargement
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-gray-600">Chargement du sac...</p>
      </div>
    );
  }

  // Affichage en cas d'erreur
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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header avec bouton retour */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <Link to="/" className="text-gray-600 hover:text-gray-900">
            ← Retour à la boutique
          </Link>
        </div>
      </header>

      {/* Contenu de la page */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="grid md:grid-cols-2 gap-8 p-6">
            
            {/* Colonne 1 : Image */}
            <div className="bg-gray-100 rounded-lg h-96 flex items-center justify-center">
              {product.images && product.images.length > 0 ? (
                <img 
                  src={product.images[0]} 
                  alt={product.name}
                  className="w-full h-full object-cover rounded-lg"
                />
              ) : (
                <span className="text-6xl">👜</span>
              )}
            </div>

            {/* Colonne 2 : Infos du produit */}
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {product.name}
              </h1>

              <div className="flex items-center gap-2 mb-4">
                <span className="text-yellow-400 text-xl">★</span>
                <span className="text-lg font-semibold">{product.rating?.toFixed(1) || '0'}</span>
              </div>

              <p className="text-gray-600 mb-6 leading-relaxed">
                {product.description}
              </p>


                <div className="mb-4">
                <span className="text-3xl font-bold text-gray-900">
                    {product.price.toFixed(2)} €
                </span>
                {product.comparePrice && product.comparePrice > product.price && (
                    <span className="text-xl text-gray-400 line-through ml-3">
                    {product.comparePrice.toFixed(2)} €
                    </span>
                )}
                </div>

                {/* Couleurs */}
                {product.colors && product.colors.length > 0 && (
                <div className="mb-4">
                    <h3 className="font-semibold mb-2">Couleurs disponibles</h3>
                    <div className="flex gap-2">
                    {product.colors.map((color) => (
                        <span key={color} className="px-3 py-1 border rounded-full text-sm">
                        {color}
                        </span>
                    ))}
                    </div>
                </div>
                )}

                {/* Tailles */}
                {product.sizes && product.sizes.length > 0 && (
                <div className="mb-4">
                    <h3 className="font-semibold mb-2">Tailles</h3>
                    <div className="flex gap-2">
                    {product.sizes.map((size) => (
                        <span key={size} className="px-3 py-1 border rounded-full text-sm">
                        {size}
                        </span>
                    ))}
                    </div>
                </div>
                )}

                {/* Stock */}
                <div className="mb-6">
                <p className={`text-sm ${product.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {product.stock > 0 ? `✅ En stock (${product.stock} disponibles)` : '❌ Rupture de stock'}
                </p>
                </div>

                {/* Bouton Ajouter au panier (pour plus tard) */}
                <button 
                    onClick={handleAddToCart}
                    className="w-full bg-gray-900 text-white py-3 rounded-lg hover:bg-gray-800 transition-colors font-semibold"
                    disabled={product.stock === 0}
                    >
                    {product.stock > 0 ? '🛒 Ajouter au panier' : 'Rupture de stock'}
                    </button>
              {/* Bouton de retour (temporaire) */}
              {/* <Link to="/">
                <button className="bg-gray-900 text-white px-6 py-2 rounded hover:bg-gray-800">
                  ← Retour
                </button>
              </Link> */}
            </div>

          </div>
        </div>
      </main>
    </div>
  );
}

export default ProductDetail;