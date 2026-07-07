// frontend/src/Cart.jsx

import { Link } from 'react-router-dom';
import { useCartStore } from './store/cartStore';

// Icônes SVG
const Icons = {
  CartEmpty: () => (
    <svg className="w-24 h-24 mx-auto text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
    </svg>
  ),
  Cart: () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
    </svg>
  ),
  Trash: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
    </svg>
  ),
  ArrowLeft: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
    </svg>
  ),
};

function Cart() {
  const { items, removeItem, clearCart, getTotalPrice } = useCartStore();
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