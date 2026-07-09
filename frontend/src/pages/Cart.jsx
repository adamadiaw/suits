// frontend/src/Cart.jsx

import { Link } from 'react-router-dom';
import { useCart } from '../hooks/useCart';
import { Icons } from '../icons';


function Cart() {
  const { items, removeItem, clearCart, getTotalPrice } = useCart();
  const totalPrice = getTotalPrice();

  // Si le panier est vide
  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white border-b border-gray-100">
          <div className="max-w-7xl mx-auto px-4 py-4">
            <Link to="/" className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors">
              <Icons.ArrowLeft />
              Retour à la boutique
            </Link>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 py-20">
          <div className="text-center">
            <Icons.CartEmpty />
            <h2 className="text-2xl font-bold text-gray-900 mt-6">Votre panier est vide</h2>
            <p className="text-gray-500 mt-2">Découvrez nos magnifiques collections</p>
            <Link to="/">
              <button className="mt-6 bg-gray-900 text-white px-8 py-3 rounded-full hover:bg-gray-800 transition-all hover:shadow-lg hover:shadow-gray-900/20 font-medium">
                Découvrir les sacs
              </button>
            </Link>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors text-sm">
              <Icons.ArrowLeft />
              Retour
            </Link>
            <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <Icons.Cart />
              Mon panier
            </h1>
            <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
              {items.length} article{items.length > 1 ? 's' : ''}
            </span>
          </div>
        </div>
      </header>

      {/* Contenu du panier */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          {/* Liste des articles */}
          {items.map((item) => (
            <div key={`${item.id}-${item.size}-${item.color}`} className="flex items-center gap-4 p-4 border-b border-gray-100 hover:bg-gray-50/50 transition-colors">
              {/* Image */}
              <div className="w-20 h-20 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                <img 
                  src={item.image || 'https://via.placeholder.com/80'} 
                  alt={item.name}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Infos */}
              <div className="flex-1 min-w-0">
                <h3 className="font-medium text-gray-900 truncate">{item.name}</h3>
                <div className="flex flex-wrap gap-2 text-sm text-gray-500 mt-0.5">
                  {item.color && <span>Couleur: {item.color}</span>}
                  {item.size && <span>Taille: {item.size}</span>}
                </div>
                <p className="text-gray-900 font-semibold mt-1">{item.price.toFixed(2)} €</p>
              </div>

              {/* Quantité et suppression */}
              <div className="flex items-center gap-4 flex-shrink-0">
                <span className="text-gray-500 text-sm">× {item.quantity}</span>
                <button 
                  onClick={() => removeItem(item.id, item.size, item.color)}
                  className="text-gray-400 hover:text-red-500 transition-colors p-1 hover:bg-red-50 rounded-full"
                  aria-label="Supprimer"
                >
                  <Icons.Trash />
                </button>
              </div>
            </div>
          ))}

          {/* Total */}
          <div className="p-6 bg-gray-50/80">
            <div className="flex justify-between items-center">
              <span className="text-lg font-medium text-gray-700">Total</span>
              <span className="text-2xl font-bold text-gray-900">{totalPrice.toFixed(2)} €</span>
            </div>

            <div className="grid grid-cols-2 gap-4 mt-4">
              <button 
                onClick={clearCart}
                className="px-4 py-3 bg-white border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all font-medium text-sm"
              >
                Vider le panier
              </button>
              <Link to="/checkout" className="block">
                <button className="w-full px-4 py-3 bg-gray-900 text-white rounded-xl hover:bg-gray-800 transition-all font-medium text-sm hover:shadow-lg hover:shadow-gray-900/20">
                  Passer la commande
                </button>
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Cart;