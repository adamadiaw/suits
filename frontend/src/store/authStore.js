// frontend/src/store/authStore.js

import { create } from 'zustand';

export const useAuthStore = create((set) => ({
  // État initial
  user: null,
  token: null,
  isAuthenticated: false,

  // Se connecter
  login: (userData, token) => {
    set({
      user: userData,
      token: token,
      isAuthenticated: true,
    });
    // Sauvegarder dans localStorage
    localStorage.setItem('auth', JSON.stringify({ user: userData, token }));
  },

  // S'inscrire
  register: (userData, token) => {
    set({
      user: userData,
      token: token,
      isAuthenticated: true,
    });
    localStorage.setItem('auth', JSON.stringify({ user: userData, token }));
  },

  // Se déconnecter
  logout: () => {
    set({
      user: null,
      token: null,
      isAuthenticated: false,
    });
    localStorage.removeItem('auth');
  },

  // Vérifier si l'utilisateur est déjà connecté (au chargement)
  checkAuth: () => {
    const saved = localStorage.getItem('auth');
    if (saved) {
      try {
        const { user, token } = JSON.parse(saved);
        set({
          user: user,
          token: token,
          isAuthenticated: true,
        });
        return true;
      } catch (e) {
        localStorage.removeItem('auth');
        return false;
      }
    }
    return false;
  },
}));