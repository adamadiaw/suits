// frontend/src/services/endpoints/orders.js

import api from '../api';

export const orderService = {
  create: (orderData) => api.post('/orders', orderData),
  getByUser: (userId) => api.get(`/orders/user/${userId}`),
  adminGetAll: () => api.get('/admin/orders'),
  adminUpdateStatus: (orderId, status) => api.put(`/admin/orders/${orderId}/status`, { status }),
};