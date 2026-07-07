// frontend/src/store/tenantStore.js

import { create } from 'zustand';

export const useTenantStore = create((set, get) => ({
  // État initial
  tenants: [],
  currentTenant: null,
  loading: false,

  // Charger toutes les boutiques
  loadTenants: async () => {
    set({ loading: true });
    try {
      const response = await fetch('http://localhost:5000/api/tenants');
      const data = await response.json();
      
      set({ 
        tenants: data,
        currentTenant: data[0] || null,
        loading: false 
      });
    } catch (error) {
      console.error('Erreur chargement boutiques:', error);
      set({ loading: false });
    }
  },

  // Changer de boutique
  setCurrentTenant: (tenant) => {
    set({ currentTenant: tenant });
    localStorage.setItem('currentTenant', JSON.stringify(tenant));
  },

  // Charger la boutique depuis localStorage
  loadCurrentTenant: () => {
    const saved = localStorage.getItem('currentTenant');
    if (saved) {
      try {
        const tenant = JSON.parse(saved);
        set({ currentTenant: tenant });
        return tenant;
      } catch (e) {
        localStorage.removeItem('currentTenant');
        return null;
      }
    }
    return null;
  },

  // Récupérer une boutique par son ID
  getTenantById: (id) => {
    const { tenants } = get();
    return tenants.find(t => t.id === id) || null;
  },
}));