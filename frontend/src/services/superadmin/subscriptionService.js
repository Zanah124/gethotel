import api from '../api.js';

export const subscriptionService = {
  // Récupérer toutes les subscriptions
  getAllSubscriptions: async (params = {}) => {
    const response = await api.get('/superadmin/subscriptions', { params });
    return response.data;
  },

  // Récupérer les plans disponibles
  getSubscriptionPlans: async () => {
    const response = await api.get('/superadmin/subscriptions/plans');
    return response.data;
  },

  // Mettre à jour l'abonnement d'un hôtel
  updateHotelSubscription: async (hotelId, data) => {
    const response = await api.patch(`/superadmin/subscriptions/${hotelId}`, data);
    return response.data;
  }
};

export default subscriptionService;
