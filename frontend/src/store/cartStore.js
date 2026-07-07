// frontend/src/store/cartStore.js

import { create } from 'zustand';

// Fonction pour sauvegarder le panier dans localStorage
const saveCart = (items) => {
  localStorage.setItem('cart', JSON.stringify(items));
};

// Fonction pour charger le panier depuis localStorage
const loadCart = () => {
  const saved = localStorage.getItem('cart');
  return saved ? JSON.parse(saved) : [];
};

// Créer le store du panier
export const useCartStore = create((set, get) => ({
  // État initial : panier vide ou chargé depuis localStorage
  items: loadCart(),

  // Ajouter un article au panier
  addItem: (product, size, color) => {
    const currentItems = get().items;
    
    // Vérifier si l'article existe déjà (même produit, même taille, même couleur)
    const existingItem = currentItems.find(
      (item) => item.id === product.id && item.size === size && item.color === color
    );

    let newItems;
    if (existingItem) {
      // Si l'article existe, augmenter la quantité
      newItems = currentItems.map((item) =>
        item.id === product.id && item.size === size && item.color === color
          ? { ...item, quantity: item.quantity + 1 }
          : item
      );
    } else {
      // Si l'article n'existe pas, l'ajouter
      newItems = [
        ...currentItems,
        {
          id: product.id,
          name: product.name,
          price: product.price,
          image: product.images?.[0] || '',
          size: size || null,
          color: color || null,
          quantity: 1,
          stock: product.stock,
        },
      ];
    }

    set({ items: newItems });
    saveCart(newItems);
  },

  // Supprimer un article du panier
  removeItem: (productId, size, color) => {
    const currentItems = get().items;
    const newItems = currentItems.filter(
      (item) => !(item.id === productId && item.size === size && item.color === color)
    );
    set({ items: newItems });
    saveCart(newItems);
  },

  // Vider le panier
  clearCart: () => {
    set({ items: [] });
    saveCart([]);
  },

  // Calculer le nombre total d'articles
  getTotalItems: () => {
    const items = get().items;
    return items.reduce((total, item) => total + item.quantity, 0);
  },

  // Calculer le prix total
  getTotalPrice: () => {
    const items = get().items;
    return items.reduce((total, item) => total + item.price * item.quantity, 0);
  },
}));