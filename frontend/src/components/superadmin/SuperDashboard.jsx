import React from 'react';
import { Link } from 'react-router-dom';
import { Hotel, Users, TrendingUp, DollarSign, Calendar, Star } from 'lucide-react';

const SuperDashboard = () => {
  const stats = [
    { label: 'Hôtels actifs', value: '48', icon: Hotel, color: 'from-blue-500 to-cyan-500' },
    { label: 'Utilisateurs', value: '1 284', icon: Users, color: 'from-purple-500 to-pink-500' },
    { label: 'Revenus mois', value: '127 400 000 Ar', icon: DollarSign, color: 'from-green-500 to-emerald-500' },
    { label: 'Croissance', value: '+23%', icon: TrendingUp, color: 'from-orange-500 to-red-500' },
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
          {stats.map((stat, i) => (
            <div key={i} className="bg-white rounded-2xl shadow-xl p-6 transform hover:scale-105 transition-all">
              <div className={`w-14 h-14 bg-gradient-to-r ${stat.color} rounded-xl flex items-center justify-center mb-4`}>
                <stat.icon className="w-8 h-8 text-white" />
              </div>
              <p className="text-gray-600 text-sm">{stat.label}</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">{stat.value}</p>
            </div>
          ))}
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

          <Link to="/super/users" className="bg-white rounded-2xl shadow-lg P-8 hover:shadow-2xl transition-all text-center group">
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