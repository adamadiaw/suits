// frontend/src/store/cartStore.js 

import { create } from 'zustand';

// Fonction pour sauvegarder le panier dans localStorage (par boutique)
const saveCart = (tenantId, items) => {
  if (tenantId) {
    localStorage.setItem(`cart_${tenantId}`, JSON.stringify(items));
  }
};

// Fonction pour charger le panier depuis localStorage (par boutique)
const loadCart = (tenantId) => {
  if (!tenantId) return [];
  const saved = localStorage.getItem(`cart_${tenantId}`);
  return saved ? JSON.parse(saved) : [];
};

export const useCartStore = create((set, get) => ({
  items: [],
  currentTenantId: null,

  // Initialiser le panier pour une boutique
  initCart: (tenantId) => {
    if (!tenantId) return;
    const items = loadCart(tenantId);
    set({ items, currentTenantId: tenantId });
  },

  // Ajouter un article au panier
  addItem: (product, size, color) => {
    const { items, currentTenantId } = get();
    if (!currentTenantId) {
      console.warn('⚠️ Aucune boutique sélectionnée');
      return;
    }

    const existingItem = items.find(
      (item) => item.id === product.id && item.size === size && item.color === color
    );

    let newItems;
    if (existingItem) {
      newItems = items.map((item) =>
        item.id === product.id && item.size === size && item.color === color
          ? { ...item, quantity: item.quantity + 1 }
          : item
      );
    } else {
      newItems = [
        ...items,
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
    saveCart(currentTenantId, newItems);
  },

  // Supprimer un article
  removeItem: (productId, size, color) => {
    const { items, currentTenantId } = get();
    const newItems = items.filter(
      (item) => !(item.id === productId && item.size === size && item.color === color)
    );
    set({ items: newItems });
    saveCart(currentTenantId, newItems);
  },

  // Vider le panier
  clearCart: () => {
    const { currentTenantId } = get();
    set({ items: [] });
    if (currentTenantId) {
      saveCart(currentTenantId, []);
    }
  },

  // Calculer le nombre total d'articles
  getTotalItems: () => {
    const { items } = get();
    return items.reduce((total, item) => total + item.quantity, 0);
  },

  // Calculer le prix total
  getTotalPrice: () => {
    const { items } = get();
    return items.reduce((total, item) => total + item.price * item.quantity, 0);
  },
}));