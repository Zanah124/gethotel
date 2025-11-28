import api from '../api';

const stockService = {
  // Articles
  getAllStock: async (params = {}) => {
    const response = await api.get('/admin/stock', { params });
    return response.data;
  },

  getStockById: async (id) => {
    const response = await api.get(`/admin/stock/${id}`);
    return response.data;
  },

  createStock: async (data) => {
    const response = await api.post('/admin/stock', data);
    return response.data;
  },

  updateStock: async (id, data) => {
    const response = await api.put(`/admin/stock/${id}`, data);
    return response.data;
  },

  deleteStock: async (id) => {
    const response = await api.delete(`/admin/stock/${id}`);
    return response.data;
  },

  // Mouvements
  createMouvement: async (data) => {
    const response = await api.post('/admin/stock/mouvements', data);
    return response.data;
  },

  getMouvementsByStockId: async (stockId, params = {}) => {
    const response = await api.get(`/admin/stock/${stockId}/mouvements`, { params });
    return response.data;
  },

  // Alertes et statistiques
  getLowStockAlerts: async () => {
    const response = await api.get('/admin/stock/alerts');
    return response.data;
  },

  getStockStats: async () => {
    const response = await api.get('/admin/stock/stats');
    return response.data;
  },

  exportStockReport: async () => {
    const response = await api.get('/admin/stock/export', {
      responseType: 'blob'
    });
    
    // Créer un lien de téléchargement
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `stock-export-${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    link.remove();
    
    return response.data;
  },

  // Catégories
  getCategories: async () => {
    const response = await api.get('/admin/stock/categories');
    return response.data;
  }
};

export default stockService;