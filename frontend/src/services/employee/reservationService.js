// src/services/employee/reservationService.js
import api from '../api';

const reservationService = {
  // Récupérer toutes les réservations
  getReservations: async (params = {}) => {
    const response = await api.get('/employee/reservations', { params });
    return response.data;
  },

  // Récupérer une réservation par ID
  getReservationById: async (id) => {
    const response = await api.get(`/employee/reservations/${id}`);
    return response.data;
  },

  // Créer une nouvelle réservation
  createReservation: async (reservationData) => {
    const response = await api.post('/employee/reservations', reservationData);
    return response.data;
  },

  // Confirmer une réservation
  confirmReservation: async (id) => {
    const response = await api.patch(`/employee/reservations/${id}/confirm`);
    return response.data;
  },

  // Check-in
  checkIn: async (id) => {
    const response = await api.patch(`/employee/reservations/${id}/checkin`);
    return response.data;
  },

  // Check-out
  checkOut: async (id) => {
    const response = await api.patch(`/employee/reservations/${id}/checkout`);
    return response.data;
  },

  // Annuler une réservation
  cancelReservation: async (id, motif) => {
    const response = await api.patch(`/employee/reservations/${id}/cancel`, { motif });
    return response.data;
  },
};

export default reservationService;