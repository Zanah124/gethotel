import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, LineChart, Line } from 'recharts';
import { 
  Users, 
  Bed, 
  Calendar, 
  TrendingUp, 
  Package, 
  DollarSign,
  UserCheck,
  AlertCircle,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import api from '../../services/api';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const [stockStats, setStockStats] = useState(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Récupérer les stats de l'hôtel
      const hotelStatsRes = await api.get('/admin/hotel/stats');
      console.log('📊 Stats hôtel reçues:', hotelStatsRes.data);
      setStats(hotelStatsRes.data);

      // Récupérer les stats du stock
      try {
        const stockStatsRes = await api.get('/admin/stock/stats');
        if (stockStatsRes.data.success) {
          setStockStats(stockStatsRes.data.data);
        }
      } catch (err) {
        console.warn('Stats stock non disponibles:', err);
      }
    } catch (error) {
      console.error('Erreur chargement dashboard:', error);
      setStats({
        totalChambres: 0,
        chambresDisponibles: 0,
        chambresOccupees: 0,
        totalReservations: 0,
        reservationsActives: 0,
        totalClients: 0,
        totalEmployees: 0,
        tauxOccupation: 0,
        occupancyData: []
      });
    } finally {
      setLoading(false);
    }
  };

  // Données pour les graphiques (utilise les données réelles si disponibles)
  const occupancyData = stats?.occupancyData || [
    { month: 'Jan', rate: 0 },
    { month: 'Fev', rate: 0 },
    { month: 'Mar', rate: 0 },
    { month: 'Avr', rate: 0 },
    { month: 'Mai', rate: 0 },
    { month: 'Juin', rate: 0 },
    { month: 'Juil', rate: 0 },
  ];

  // Données de revenu (exemple pour l'instant, à remplacer par de vraies données plus tard)
  const revenueData = [
    { month: 'Jan', revenue: 120 },
    { month: 'Fev', revenue: 145 },
    { month: 'Mar', revenue: 160 },
    { month: 'Avr', revenue: 155 },
    { month: 'Mai', revenue: 170 },
    { month: 'Juin', revenue: 180 },
    { month: 'Juil', revenue: 195 },
  ];

  const formatCurrency = (num) => {
    if (!num) return '0 Ar';
    return new Intl.NumberFormat('fr-FR').format(num) + ' Ar';
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-28 md:pt-32" style={{ backgroundColor: 'white' }}>
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2" style={{ borderColor: '#A62609' }}></div>
          <p className="mt-4" style={{ color: '#131114' }}>Chargement des données...</p>
        </div>
      </div>
    );
  }

  const tauxOccupation = stats?.tauxOccupation || 0;
  const chambresOccupees = stats?.chambresOccupees || ((stats?.totalChambres || 0) - (stats?.chambresDisponibles || 0));

  return (
    <div className="min-h-screen pt-28 md:pt-32" style={{ backgroundColor: '#f8fafc' }}>
      <div className="p-6 md:p-8 max-w-7xl mx-auto">
        {/* Header moderne */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold mb-2" style={{ color: '#131114' }}>
                Tableau de bord
          </h1>
              <p className="text-gray-600">Vue d'ensemble de votre hôtel</p>
        </div>
            <div className="flex gap-3">
              <button
                onClick={() => navigate('/admin/stock')}
                className="px-4 py-2 rounded-lg flex items-center gap-2 transition hover:shadow-lg"
                style={{ backgroundColor: '#E6EED6', color: '#131114' }}
              >
                <Package size={20} />
            Stock
          </button>
              <button
                onClick={() => navigate('/admin/chambres')}
                className="px-4 py-2 rounded-lg flex items-center gap-2 transition hover:shadow-lg"
                style={{ backgroundColor: '#E6EED6', color: '#131114' }}
              >
                <Bed size={20} />
                Chambres
          </button>
            </div>
          </div>
        </div>

        {/* Métriques principales avec icônes et animations */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Chambres totales */}
          <div 
            className="p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
            style={{ 
              background: 'linear-gradient(135deg, #E6EED6 0%, #d4e0c4 100%)',
            }}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-xl" style={{ backgroundColor: 'rgba(166, 38, 9, 0.1)' }}>
                <Bed size={28} style={{ color: '#A62609' }} />
              </div>
              <ArrowUpRight size={20} style={{ color: '#131114', opacity: 0.3 }} />
            </div>
            <p className="text-sm mb-2 font-medium" style={{ color: '#131114', opacity: 0.7 }}>
              Chambres totales
            </p>
            <p className="text-4xl font-bold" style={{ color: '#131114' }}>
              {stats?.totalChambres || 0}
            </p>
            <p className="text-xs mt-2" style={{ color: '#131114', opacity: 0.6 }}>
              {stats?.chambresDisponibles || 0} disponibles
            </p>
          </div>

          {/* Réservations actives */}
          <div 
            className="p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
            style={{ 
              background: 'linear-gradient(135deg, #E6EED6 0%, #d4e0c4 100%)',
            }}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-xl" style={{ backgroundColor: 'rgba(166, 38, 9, 0.1)' }}>
                <Calendar size={28} style={{ color: '#A62609' }} />
              </div>
              <ArrowUpRight size={20} style={{ color: '#131114', opacity: 0.3 }} />
            </div>
            <p className="text-sm mb-2 font-medium" style={{ color: '#131114', opacity: 0.7 }}>
              Réservations actives
            </p>
            <p className="text-4xl font-bold" style={{ color: '#131114' }}>
              {stats?.reservationsActives || 0}
            </p>
            <p className="text-xs mt-2" style={{ color: '#131114', opacity: 0.6 }}>
              {stats?.totalReservations || 0} au total
            </p>
        </div>

          {/* Taux d'occupation */}
          <div 
            className="p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
            style={{ 
              background: 'linear-gradient(135deg, #E6EED6 0%, #d4e0c4 100%)',
            }}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-xl" style={{ backgroundColor: 'rgba(166, 38, 9, 0.1)' }}>
                <TrendingUp size={28} style={{ color: '#A62609' }} />
            </div>
              <ArrowUpRight size={20} style={{ color: '#131114', opacity: 0.3 }} />
            </div>
            <p className="text-sm mb-2 font-medium" style={{ color: '#131114', opacity: 0.7 }}>
              Taux d'occupation
            </p>
            <p className="text-4xl font-bold" style={{ color: '#A62609' }}>
              {parseFloat(tauxOccupation).toFixed(1)}%
            </p>
            <p className="text-xs mt-2" style={{ color: '#131114', opacity: 0.6 }}>
              {chambresOccupees} chambres occupées
            </p>
            </div>

          {/* Clients */}
          <div 
            className="p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
            style={{ 
              background: 'linear-gradient(135deg, #E6EED6 0%, #d4e0c4 100%)',
            }}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-xl" style={{ backgroundColor: 'rgba(166, 38, 9, 0.1)' }}>
                <Users size={28} style={{ color: '#A62609' }} />
            </div>
              <ArrowUpRight size={20} style={{ color: '#131114', opacity: 0.3 }} />
            </div>
            <p className="text-sm mb-2 font-medium" style={{ color: '#131114', opacity: 0.7 }}>
              Clients
            </p>
            <p className="text-4xl font-bold" style={{ color: '#131114' }}>
              {stats?.totalClients || 0}
            </p>
            <p className="text-xs mt-2" style={{ color: '#131114', opacity: 0.6 }}>
              {stats?.totalEmployees || 0} employés
            </p>
          </div>
        </div>

        {/* Métriques secondaires - Stock */}
        {stockStats && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <div 
              className="p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300"
              style={{ 
                background: 'linear-gradient(135deg, #E6EED6 0%, #d4e0c4 100%)',
              }}
            >
              <div className="flex items-center gap-3 mb-3">
                <Package size={24} style={{ color: '#A62609' }} />
                <p className="text-sm font-medium" style={{ color: '#131114', opacity: 0.7 }}>
                  Articles en stock
                </p>
              </div>
              <p className="text-3xl font-bold" style={{ color: '#131114' }}>
                {stockStats.total_articles || 0}
              </p>
            </div>

            <div 
              className="p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300"
              style={{ 
                background: 'linear-gradient(135deg, #E6EED6 0%, #d4e0c4 100%)',
              }}
            >
              <div className="flex items-center gap-3 mb-3">
                <DollarSign size={24} style={{ color: '#A62609' }} />
                <p className="text-sm font-medium" style={{ color: '#131114', opacity: 0.7 }}>
                  Valeur du stock
                </p>
              </div>
              <p className="text-3xl font-bold" style={{ color: '#A62609' }}>
                {formatCurrency(stockStats.valeur_totale || 0)}
              </p>
            </div>

            <div 
              className="p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300"
              style={{ 
                background: stockStats.articles_stock_faible > 0 
                  ? 'linear-gradient(135deg, #fee2e2 0%, #fecaca 100%)'
                  : 'linear-gradient(135deg, #E6EED6 0%, #d4e0c4 100%)',
              }}
            >
              <div className="flex items-center gap-3 mb-3">
                <AlertCircle size={24} style={{ color: stockStats.articles_stock_faible > 0 ? '#dc2626' : '#A62609' }} />
                <p className="text-sm font-medium" style={{ color: '#131114', opacity: 0.7 }}>
                  Alertes stock faible
                </p>
              </div>
              <p className="text-3xl font-bold" style={{ color: stockStats.articles_stock_faible > 0 ? '#dc2626' : '#131114' }}>
                {stockStats.articles_stock_faible || 0}
              </p>
            </div>
                </div>
        )}

        {/* Graphiques */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Graphique d'occupation */}
          <div 
            className="p-6 rounded-2xl shadow-lg"
            style={{ backgroundColor: '#E6EED6' }}
          >
            <div className="flex items-center justify-between mb-6">
                <div>
                <h3 className="text-xl font-bold mb-1" style={{ color: '#131114' }}>
                  Taux d'occupation
                </h3>
                <p className="text-3xl font-bold" style={{ color: '#A62609' }}>
                  {parseFloat(tauxOccupation).toFixed(1)}%
                </p>
                </div>
              <div className="text-right">
                <p className="text-sm" style={{ color: '#131114', opacity: 0.7 }}>
                  Chambres occupées
                </p>
                <p className="text-2xl font-bold" style={{ color: '#131114' }}>
                  {chambresOccupees} / {stats?.totalChambres || 0}
                </p>
                </div>
              </div>
            {occupancyData && occupancyData.length > 0 ? (
              <ResponsiveContainer width="100%" height={250}>
                <AreaChart data={occupancyData}>
                  <defs>
                    <linearGradient id="colorRate" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#A62609" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="#A62609" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#131114" opacity={0.1} />
                  <XAxis dataKey="month" stroke="#131114" opacity={0.5} />
                  <YAxis 
                    stroke="#131114" 
                    opacity={0.5}
                    domain={[0, 100]}
                    tickFormatter={(value) => `${value}%`}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'white', 
                      border: '1px solid #E6EED6',
                      borderRadius: '8px'
                    }}
                    formatter={(value) => [`${value}%`, 'Taux d\'occupation']}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="rate" 
                    stroke="#A62609" 
                    strokeWidth={3} 
                    fillOpacity={1} 
                    fill="url(#colorRate)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-64 flex items-center justify-center">
                <p className="text-gray-500">Aucune donnée disponible</p>
              </div>
            )}
            </div>

          {/* Graphique de revenu */}
          <div 
            className="p-6 rounded-2xl shadow-lg"
            style={{ backgroundColor: '#E6EED6' }}
          >
            <div className="flex items-center justify-between mb-6">
                <div>
                <h3 className="text-xl font-bold mb-1" style={{ color: '#131114' }}>
                  Revenus mensuels
                </h3>
                <p className="text-sm" style={{ color: '#131114', opacity: 0.7 }}>
                  (Données d'exemple)
                </p>
                </div>
              </div>
            <ResponsiveContainer width="100%" height={250}>
                <BarChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#131114" opacity={0.1} />
                  <XAxis dataKey="month" stroke="#131114" opacity={0.5} />
                  <YAxis stroke="#131114" opacity={0.5} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'white', 
                    border: '1px solid #E6EED6',
                    borderRadius: '8px'
                  }} 
                />
                <Bar 
                  dataKey="revenue" 
                  fill="#A62609" 
                  radius={[12, 12, 0, 0]}
                  style={{ filter: 'drop-shadow(0 4px 6px rgba(166, 38, 9, 0.2))' }}
                />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

        {/* Actions rapides */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <button
            onClick={() => navigate('/admin/chambres')}
            className="p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 text-left"
            style={{ backgroundColor: '#E6EED6' }}
          >
            <Bed size={32} style={{ color: '#A62609' }} className="mb-3" />
            <h3 className="text-lg font-bold mb-2" style={{ color: '#131114' }}>
              Gérer les chambres
            </h3>
            <p className="text-sm" style={{ color: '#131114', opacity: 0.7 }}>
              Voir et modifier les chambres
            </p>
          </button>

          <button
            onClick={() => navigate('/admin/stock')}
            className="p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 text-left"
            style={{ backgroundColor: '#E6EED6' }}
          >
            <Package size={32} style={{ color: '#A62609' }} className="mb-3" />
            <h3 className="text-lg font-bold mb-2" style={{ color: '#131114' }}>
              Gérer le stock
            </h3>
            <p className="text-sm" style={{ color: '#131114', opacity: 0.7 }}>
              Consulter l'inventaire
            </p>
                </button>

          <button
            onClick={() => navigate('/admin/employees')}
            className="p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 text-left"
            style={{ backgroundColor: '#E6EED6' }}
          >
            <UserCheck size={32} style={{ color: '#A62609' }} className="mb-3" />
            <h3 className="text-lg font-bold mb-2" style={{ color: '#131114' }}>
              Gérer les employés
            </h3>
            <p className="text-sm" style={{ color: '#131114', opacity: 0.7 }}>
              Voir et modifier les employés
            </p>
                </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
