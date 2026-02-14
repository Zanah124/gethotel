import api from '../api';

const clientService = {
  // Récupérer la liste des clients avec filtres
  getClients: async (params = {}) => {
    const response = await api.get('/employee/clients', { params });
    return response.data;
  },

  // Récupérer un client par ID
  getClientById: async (id) => {
    const response = await api.get(`/employee/clients/${id}`);
    return response.data;
  },

  // Créer un nouveau client
  createClient: async (clientData) => {
    const response = await api.post('/employee/clients', clientData);
    return response.data;
  },

  // Mettre à jour un client
  updateClient: async (id, clientData) => {
    const response = await api.patch(`/employee/clients/${id}`, clientData);
    return response.data;
  },
};

export default clientService;