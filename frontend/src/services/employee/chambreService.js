import api from '../api';

const chambreService = {
  // Récupérer toutes les chambres de l'hôtel
  getChambres: async () => {
    const response = await api.get('/employee/chambres');
    return response.data;
  },

  // Récupérer une chambre par ID
  getChambreById: async (id) => {
    const response = await api.get(`/employee/chambres/${id}`);
    return response.data;
  },

  // Récupérer les chambres disponibles pour une période
  getAvailableChambres: async (params) => {
    const response = await api.get('/employee/chambres/available', { params });
    return response.data;
  },
};

export default chambreService;