import api from '../api';

const notificationService = {
  getMyNotifications: async (params = {}) => {
    const response = await api.get('/client/notifications', { params });
    return response.data;
  },

  markAsRead: async (id) => {
    const response = await api.patch(`/client/notifications/${id}/read`);
    return response.data;
  },

  markAllAsRead: async () => {
    const response = await api.patch('/client/notifications/read-all');
    return response.data;
  },
};

export default notificationService;
