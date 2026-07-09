// frontend/src/components/shared/ProductCard.jsx

import { Link } from 'react-router-dom';
import { Icons } from '../../icons';

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

export default ProductCard;