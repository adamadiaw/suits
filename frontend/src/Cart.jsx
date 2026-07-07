// frontend/src/Cart.jsx

import { Link } from 'react-router-dom';
import { useCartStore } from './store/cartStore';


function Cart() {
  const { items, removeItem, clearCart, getTotalPrice } = useCartStore();
  const totalPrice = getTotalPrice();

  // Si le panier est vide
  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 py-4">
            <Link to="/" className="text-gray-600 hover:text-gray-900">
              ← Retour à la boutique
            </Link>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 py-16">
          <div className="text-center">
            <span className="text-6xl">🛒</span>
            <h2 className="text-2xl font-bold text-gray-900 mt-4">Votre panier est vide</h2>
            <p className="text-gray-600 mt-2">Découvrez nos magnifiques sacs !</p>
            <Link to="/">
              <button className="mt-6 bg-gray-900 text-white px-6 py-3 rounded hover:bg-gray-800">
                Voir les sacs
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
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <Link to="/" className="text-gray-600 hover:text-gray-900">
            ← Retour à la boutique
          </Link>
          <h1 className="text-xl font-bold text-gray-900">🛒 Mon panier</h1>
          <span className="text-gray-600">{items.length} article(s)</span>
        </div>
      </header>

      {/* Contenu du panier */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {/* Liste des articles */}
          {items.map((item) => (
            <div key={`${item.id}-${item.size}-${item.color}`} className="flex items-center gap-4 p-4 border-b">
              {/* Image */}
              <img 
                src={item.image || 'https://via.placeholder.com/80'} 
                alt={item.name}
                className="w-20 h-20 object-cover rounded"
              />

              {/* Infos */}
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900">{item.name}</h3>
                <div className="flex gap-2 text-sm text-gray-500">
                  {item.color && <span>Couleur: {item.color}</span>}
                  {item.size && <span>Taille: {item.size}</span>}
                </div>
                <p className="text-gray-900 font-semibold">{item.price.toFixed(2)} €</p>
              </div>

              {/* Quantité et suppression */}
              <div className="flex items-center gap-4">
                <span className="text-gray-600">x{item.quantity}</span>
                <button 
                  onClick={() => removeItem(item.id, item.size, item.color)}
                  className="text-red-500 hover:text-red-700 text-sm"
                >
                  Supprimer
                </button>
              </div>
            </div>
          ))}

          {/* Total */}
          <div className="p-4 bg-gray-50">
            <div className="flex justify-between items-center">
              <span className="text-lg font-semibold text-gray-900">Total</span>
              <span className="text-2xl font-bold text-gray-900">{totalPrice.toFixed(2)} €</span>
            </div>

            <div className="flex gap-4 mt-4">
              <button 
                onClick={clearCart}
                className="flex-1 bg-gray-200 text-gray-700 py-3 rounded hover:bg-gray-300 transition-colors"
              >
                Vider le panier
              </button>
              <Link to="/checkout" className="flex-1">
                <button className="w-full bg-gray-900 text-white py-3 rounded hover:bg-gray-800 transition-colors">
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