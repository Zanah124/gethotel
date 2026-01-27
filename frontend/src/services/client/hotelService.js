import api from '../api';

const hotelService = {
  // Récupérer la liste des hôtels
  getHotels: async (searchTerm = '') => {
    try {
      const params = searchTerm ? { search: searchTerm } : {};
      const response = await api.get('/client/hotels', { params });
      return response.data.data || [];
    } catch (error) {
      console.error('Erreur lors de la récupération des hôtels:', error);
      throw error;
    }
  },

  // Récupérer les détails d'un hôtel
  getHotelById: async (id) => {
    const response = await api.get(`/client/hotels/${id}`);
    return response.data.data;
  },

  // Récupérer les chambres disponibles d'un hôtel
  getAvailableRooms: async (hotelId, filters = {}) => {
    try {
      const response = await api.get(`/client/hotels/${hotelId}/rooms`, { params: filters });
      return response.data.data || [];
    } catch (error) {
      console.error('Erreur lors de la récupération des chambres:', error);
      throw error;
    }
  },

  // Récupérer les hôtels populaires
  getPopularHotels: async () => {
    const response = await api.get('/client/hotels/popular');
    return response.data.data || [];
  },

  // Récupérer les destinations populaires
  getPopularDestinations: async () => {
    const response = await api.get('/client/hotels/destinations');
    return response.data.data || [];
  }
};

export default hotelService;