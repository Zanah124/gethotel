import api from '../config/api';

export const createReservation = async (data) => {
  const res = await api.post('/client/reservations/create', data);
  return res.data;
};

export const getMyReservations = async (params = {}) => {
  const res = await api.get('/client/reservations', { params });
  return res.data;
};

export const getMyReservationById = async (id) => {
  const res = await api.get(`/client/reservations/${id}`);
  return res.data;
};

export const cancelReservation = async (id) => {
  const res = await api.put(`/client/reservations/${id}/cancel`);
  return res.data;
};
