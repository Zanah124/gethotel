import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api', 
  withCredentials: true, // important si tu utilises les cookies/session ou JWT dans httpOnly
});

// Intercepteur pour ajouter le token automatiquement si tu l'as dans localStorage
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;