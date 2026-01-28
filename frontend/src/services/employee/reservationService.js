import api from '../api';

const employeeReservationService = {
  getReservations: async (params = {}) => {
    const response = await api.get('/employee/reservations', { params });
    return response.data;
  },

  getReservationById: async (id) => {
    const response = await api.get(`/employee/reservations/${id}`);
    return response.data;
  },

  confirm: async (id) => {
    const response = await api.patch(`/employee/reservations/${id}/confirm`);
    return response.data;
  },

  checkIn: async (id) => {
    const response = await api.patch(`/employee/reservations/${id}/checkin`);
    return response.data;
  },

  checkOut: async (id) => {
    const response = await api.patch(`/employee/reservations/${id}/checkout`);
    return response.data;
  },

  cancel: async (id, motif) => {
    const response = await api.patch(`/employee/reservations/${id}/cancel`, {
      motif,
    });
    return response.data;
  },
};

export default employeeReservationService;
