import React, { createContext, useState, useEffect, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../config/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const stored = await AsyncStorage.getItem('user');
        if (stored) setUser(JSON.parse(stored));
      } catch (_) {}
      setLoading(false);
    };
    loadUser();
  }, []);

  const login = async (email, password) => {
    const res = await api.post('/auth/login', { email, password });
    const data = res.data?.data || res.data;
    const token = data?.token || data?.accessToken;
    const userData = data?.user || data;
    if (token) await AsyncStorage.setItem('token', token);
    if (userData) {
      await AsyncStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);
    }
    return data;
  };

  const register = async (payload) => {
    const res = await api.post('/auth/register', payload);
    const data = res.data?.data || res.data;
    const token = data?.token || data?.accessToken;
    const userData = data?.user || data;
    if (token) await AsyncStorage.setItem('token', token);
    if (userData) {
      await AsyncStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);
    }
    return data;
  };

  const logout = async () => {
    await AsyncStorage.multiRemove(['token', 'user']);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
