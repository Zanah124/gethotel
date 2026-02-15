import api from '../config/api';

export const getHotels = async (searchTerm = '') => {
  const params = searchTerm ? { search: searchTerm } : {};
  const res = await api.get('/client/hotels', { params });
  return res.data?.data ?? [];
};

export const getHotelById = async (id) => {
  const res = await api.get(`/client/hotels/${id}`);
  return res.data?.data;
};

export const getAvailableRooms = async (hotelId, filters = {}) => {
  const res = await api.get(`/client/hotels/${hotelId}/rooms`, { params: filters });
  return res.data?.data ?? [];
};
