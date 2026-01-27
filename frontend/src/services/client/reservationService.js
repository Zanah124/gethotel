import api from '../api';

const reservationService = {
  // Créer une nouvelle réservation
  createReservation: async (reservationData) => {
    const response = await api.post('/client/reservations/create', reservationData);
    return response.data;
  },

  // Récupérer toutes les réservations du client connecté
  getMyReservations: async (params = {}) => {
    const response = await api.get('/client/reservations', { params });
    return response.data;
  },

  // Récupérer une réservation spécifique
  getMyReservationById: async (id) => {
    const response = await api.get(`/client/reservations/${id}`);
    return response.data;
  },

  // Annuler une réservation
  cancelReservation: async (id) => {
    const response = await api.put(`/client/reservations/${id}/cancel`);
    return response.data;
  }
};

export default reservationService;
