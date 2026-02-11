import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api.js';
import { Hotel, Users, CalendarCheck, Star } from 'lucide-react';

const SuperDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    hotels: null,
    users: null,
    subscriptions: null,
    subscriptionsActive: null,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const [hotelsRes, usersRes, subsRes, subsActiveRes] = await Promise.all([
          api.get('/superadmin/hotels', { params: { page: 1, limit: 1 } }),
          api.get('/superadmin/users', { params: { page: 1, limit: 1 } }),
          api.get('/superadmin/subscriptions', { params: { page: 1, limit: 1 } }),
          api.get('/superadmin/subscriptions', { params: { status: 'active', page: 1, limit: 1 } }),
        ]);
        setStats({
          hotels: hotelsRes.data?.pagination?.total ?? 0,
          users: usersRes.data?.pagination?.total ?? 0,
          subscriptions: subsRes.data?.pagination?.total ?? 0,
          subscriptionsActive: subsActiveRes.data?.pagination?.total ?? 0,
        });
      } catch (err) {
        console.error('Erreur chargement stats dashboard:', err);
        setStats({ hotels: 0, users: 0, subscriptions: 0, subscriptionsActive: 0 });
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const formatNumber = (n) => (n != null ? n.toLocaleString('fr-FR') : '—');

  const statsCards = [
    { label: 'Hôtels', value: formatNumber(stats.hotels), icon: Hotel, color: 'from-blue-500 to-cyan-500' },
    { label: 'Utilisateurs', value: formatNumber(stats.users), icon: Users, color: 'from-purple-500 to-pink-500' },
    { label: 'Abonnements', value: formatNumber(stats.subscriptions), icon: CalendarCheck, color: 'from-green-500 to-emerald-500' },
    { label: 'Abonnements actifs', value: formatNumber(stats.subscriptionsActive), icon: Star, color: 'from-orange-500 to-red-500' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-[#0000FF] via-[#000080] to-teal-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            Bienvenue, Super Admin
          </h1>
          <p className="text-xl opacity-90">
            Gérez tous les hôtels de la plateforme GetHotel Madagascar
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="max-w-7xl mx-auto px-6 -mt-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {loading ? (
            [...Array(4)].map((_, i) => (
              <div key={i} className="bg-white rounded-2xl shadow-xl p-6 animate-pulse">
                <div className="w-14 h-14 bg-gray-200 rounded-xl mb-4" />
                <div className="h-4 bg-gray-200 rounded w-24 mb-2" />
                <div className="h-8 bg-gray-200 rounded w-16" />
              </div>
            ))
          ) : (
            statsCards.map((stat, i) => (
              <div key={i} className="bg-white rounded-2xl shadow-xl p-6 transform hover:scale-105 transition-all">
                <div className={`w-14 h-14 bg-gradient-to-r ${stat.color} rounded-xl flex items-center justify-center mb-4`}>
                  <stat.icon className="w-8 h-8 text-white" />
                </div>
                <p className="text-gray-600 text-sm">{stat.label}</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{stat.value}</p>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Actions rapides */}
      <div className="max-w-7xl mx-auto px-6 mt-16">
        <h2 className="text-3xl font-bold text-gray-900 mb-8">Actions rapides</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Link to="/super/hotels" className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-2xl transition-all text-center group">
            <Hotel className="w-16 h-16 mx-auto mb-4 text-[#7238D4] group-hover:scale-110 transition" />
            <h3 className="text-xl font-bold">Gérer les hôtels</h3>
            <p className="text-gray-600 mt-2">Voir, modifier ou supprimer les hôtels</p>
          </Link>

          <Link to="/super/users" className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-2xl transition-all text-center group">
            <Users className="w-16 h-16 mx-auto mb-4 text-[#49B9FF] group-hover:scale-110 transition" />
            <h3 className="text-xl font-bold">Gestion utilisateurs</h3>
            <p className="text-gray-600 mt-2">Admins hôtel, clients, etc.</p>
          </Link>

          <Link to="/super/subscriptions" className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-2xl transition-all text-center group">
            <Star className="w-16 h-16 mx-auto mb-4 text-yellow-500 group-hover:scale-110 transition" />
            <h3 className="text-xl font-bold">Abonnements</h3>
            <p className="text-gray-600 mt-2">Suivi des plans et paiements</p>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SuperDashboard;