// frontend/src/hooks/useCart.js

import { useCartStore } from '../store/cartStore';

export function useCart() {
  const items = useCartStore((state) => state.items);
  const addItem = useCartStore((state) => state.addItem);
  const removeItem = useCartStore((state) => state.removeItem);
  const clearCart = useCartStore((state) => state.clearCart);
  const getTotalItems = useCartStore((state) => state.getTotalItems);
  const getTotalPrice = useCartStore((state) => state.getTotalPrice);
  const initCart = useCartStore((state) => state.initCart);

  return {
    items,
    addItem,
    removeItem,
    clearCart,
    getTotalItems,
    getTotalPrice,
    initCart,
  };
}