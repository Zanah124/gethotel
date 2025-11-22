// frontend-web/src/services/employee/stockService.js
import api from '../api';

const stockService = {
  // Consultation articles
  getAllStock: async (params = {}) => {
    const response = await api.get('/employee/stock', { params });
    return response.data;
  },

  getStockById: async (id) => {
    const response = await api.get(`/employee/stock/${id}`);
    return response.data;
  },

  // Mouvements (entrée/sortie uniquement)
  createMouvement: async (data) => {
    const response = await api.post('/employee/stock/mouvements', data);
    return response.data;
  },

  getMouvementsByStockId: async (stockId, params = {}) => {
    const response = await api.get(`/employee/stock/${stockId}/mouvements`, { params });
    return response.data;
  },

  // Alertes
  getLowStockAlerts: async () => {
    const response = await api.get('/employee/stock/alerts');
    return response.data;
  }
};

export default stockService;