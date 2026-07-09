// frontend/src/services/endpoints/products.js

import api from '../api';

export const productService = {
  // Récupérer tous les produits
  getAll: (tenantId) => api.get('/products', { params: { tenantId } }),

  // Récupérer les produits en vedette
  getFeatured: (tenantId) => api.get('/products/featured', { params: { tenantId } }),

  // Récupérer un produit par son ID
  getById: (id) => api.get(`/products/${id}`),

  // Admin : Récupérer tous les produits
  adminGetAll: () => api.get('/admin/products'),

  // Admin : Créer un produit
  adminCreate: (data) => api.post('/admin/products', data),

  // Admin : Modifier un produit
  adminUpdate: (id, data) => api.put(`/admin/products/${id}`, data),

  // Admin : Supprimer un produit
  adminDelete: (id) => api.delete(`/admin/products/${id}`),

  // Avis
  getReviews: (productId) => api.get(`/products/${productId}/reviews`),
  addReview: (productId, data) => api.post(`/products/${productId}/reviews`, data),
  adminDeleteReview: (reviewId) => api.delete(`/admin/reviews/${reviewId}`),
};