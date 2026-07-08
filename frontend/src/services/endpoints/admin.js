// frontend/src/services/endpoints/admin.js

import api from '../api';

export const adminService = {
  getStats: () => api.get('/admin/stats'),
  getTenants: () => api.get('/admin/tenants'),
  createTenant: (data) => api.post('/admin/tenants', data),
};