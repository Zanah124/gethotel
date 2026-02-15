import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Sur émulateur Android : utiliser 10.0.2.2 au lieu de localhost
// Sur appareil physique : utiliser l'IP de votre machine (ex: 192.168.1.10)
const API_BASE_URL = 'http://localhost:3000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use(
  async (config) => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (token) config.headers.Authorization = `Bearer ${token}`;
    } catch (_) {}
    return config;
  },
  (err) => Promise.reject(err)
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      try {
        await AsyncStorage.multiRemove(['token', 'user']);
      } catch (_) {}
    }
    return Promise.reject(error);
  }
);

export default api;
export { API_BASE_URL };
