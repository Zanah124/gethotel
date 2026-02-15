import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import {
  BarChart3,
  Hotel,
  Users,
  CalendarCheck,
  Star,
  PieChart,
  TrendingUp,
} from 'lucide-react';
import {
  PieChart as RechartsPie,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

const ROLES = [
  { key: 'admin', label: 'Admins', color: '#7238D4' },
  { key: 'employee', label: 'Employés', color: '#49B9FF' },
  { key: 'client', label: 'Clients', color: '#22c55e' },
  { key: 'superadmin', label: 'Super Admin', color: '#f59e0b' },
];

const STATUS_COLORS = {
  active: '#22c55e',
  canceled: '#ef4444',
  past_due: '#f97316',
  trialing: '#3b82f6',
  incomplete: '#eab308',
  incomplete_expired: '#6b7280',
};

const formatNumber = (n) => (n != null ? n.toLocaleString('fr-FR') : '0');

export default function AnalyticsSuper() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    hotels: 0,
    users: 0,
    subscriptions: 0,
    subscriptionsActive: 0,
  });
  const [usersByRole, setUsersByRole] = useState([]);
  const [subscriptionsByStatus, setSubscriptionsByStatus] = useState([]);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        setLoading(true);
        setError(null);

        const token = localStorage.getItem('token');
        if (!token) return;

        const [
          hotelsRes,
          usersRes,
          subsRes,
          subsActiveRes,
          usersAdminRes,
          usersEmployeeRes,
          usersClientRes,
          usersSuperRes,
        ] = await Promise.all([
          api.get('/superadmin/hotels', { params: { page: 1, limit: 1 } }),
          api.get('/superadmin/users', { params: { page: 1, limit: 1 } }),
          api.get('/superadmin/subscriptions', { params: { page: 1, limit: 1 } }),
          api.get('/superadmin/subscriptions', { params: { status: 'active', page: 1, limit: 1 } }),
          api.get('/superadmin/users', { params: { page: 1, limit: 1, role: 'admin' } }),
          api.get('/superadmin/users', { params: { page: 1, limit: 1, role: 'employee' } }),
          api.get('/superadmin/users', { params: { page: 1, limit: 1, role: 'client' } }),
          api.get('/superadmin/users', { params: { page: 1, limit: 1, role: 'superadmin' } }),
        ]);

        setStats({
          hotels: hotelsRes.data?.pagination?.total ?? 0,
          users: usersRes.data?.pagination?.total ?? 0,
          subscriptions: subsRes.data?.pagination?.total ?? 0,
          subscriptionsActive: subsActiveRes.data?.pagination?.total ?? 0,
        });

        const adminTotal = usersAdminRes.data?.pagination?.total ?? 0;
        const employeeTotal = usersEmployeeRes.data?.pagination?.total ?? 0;
        const clientTotal = usersClientRes.data?.pagination?.total ?? 0;
        const superTotal = usersSuperRes.data?.pagination?.total ?? 0;

        setUsersByRole([
          { name: 'Admins', value: adminTotal, color: ROLES[0].color },
          { name: 'Employés', value: employeeTotal, color: ROLES[1].color },
          { name: 'Clients', value: clientTotal, color: ROLES[2].color },
          { name: 'Super Admin', value: superTotal, color: ROLES[3].color },
        ].filter((d) => d.value > 0));

        const statuses = ['active', 'canceled', 'past_due', 'trialing', 'incomplete', 'incomplete_expired'];
        const statusCounts = await Promise.all(
          statuses.map(async (status) => {
            try {
              const r = await api.get('/superadmin/subscriptions', {
                params: { status, page: 1, limit: 1 },
              });
              const total = r.data?.pagination?.total ?? 0;
              return { status, total };
            } catch {
              return { status, total: 0 };
            }
          })
        );

        const labels = {
          active: 'Actif',
          canceled: 'Annulé',
          past_due: 'En retard',
          trialing: 'Essai',
          incomplete: 'Incomplet',
          incomplete_expired: 'Expiré',
        };

        setSubscriptionsByStatus(
          statusCounts
            .filter((d) => d.total > 0)
            .map((d) => ({
              name: labels[d.status] || d.status,
              value: d.total,
              color: STATUS_COLORS[d.status] || '#94a3b8',
            }))
        );
      } catch (err) {
        console.error('Erreur chargement statistiques:', err);
        setError(err.response?.data?.message || 'Erreur lors du chargement des statistiques');
        setStats({ hotels: 0, users: 0, subscriptions: 0, subscriptionsActive: 0 });
        setUsersByRole([]);
        setSubscriptionsByStatus([]);
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, []);

  const kpiCards = [
    { label: 'Hôtels', value: formatNumber(stats.hotels), icon: Hotel, color: 'from-blue-500 to-cyan-500' },
    { label: 'Utilisateurs', value: formatNumber(stats.users), icon: Users, color: 'from-purple-500 to-pink-500' },
    { label: 'Abonnements', value: formatNumber(stats.subscriptions), icon: CalendarCheck, color: 'from-green-500 to-emerald-500' },
    { label: 'Abonnements actifs', value: formatNumber(stats.subscriptionsActive), icon: Star, color: 'from-orange-500 to-red-500' },
  ];

  const barData = [
    { name: 'Hôtels', total: stats.hotels, fill: '#3b82f6' },
    { name: 'Utilisateurs', total: stats.users, fill: '#7238D4' },
    { name: 'Abonnements', total: stats.subscriptions, fill: '#22c55e' },
    { name: 'Actifs', total: stats.subscriptionsActive, fill: '#f59e0b' },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block w-12 h-12 border-4 border-[#7238D4] border-t-transparent rounded-full animate-spin" />
          <p className="mt-4 text-gray-600">Chargement des statistiques...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
        <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md text-center">
          <p className="text-red-600 font-medium">{error}</p>
          <p className="text-gray-500 text-sm mt-2">Vérifiez votre connexion et réessayez.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-12 h-12 rounded-xl bg-[#7238D4] flex items-center justify-center">
            <BarChart3 className="w-7 h-7 text-white" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Statistiques</h1>
            <p className="text-gray-500 text-sm">Vue d'ensemble de la plateforme GetHotel</p>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {kpiCards.map((card, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 flex items-center gap-4"
            >
              <div className={`w-14 h-14 rounded-xl bg-gradient-to-r ${card.color} flex items-center justify-center flex-shrink-0`}>
                <card.icon className="w-8 h-8 text-white" />
              </div>
              <div>
                <p className="text-gray-500 text-sm">{card.label}</p>
                <p className="text-2xl font-bold text-gray-900">{card.value}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Graphique barres - Indicateurs clés */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-[#7238D4]" />
              <h2 className="font-semibold text-gray-900">Indicateurs clés</h2>
            </div>
            <div className="p-6 h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={barData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip formatter={(v) => [formatNumber(v), 'Total']} />
                  <Bar dataKey="total" name="Total" radius={[4, 4, 0, 0]}>
                  {barData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Répartition utilisateurs par rôle */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50 flex items-center gap-2">
              <Users className="w-5 h-5 text-[#7238D4]" />
              <h2 className="font-semibold text-gray-900">Utilisateurs par rôle</h2>
            </div>
            <div className="p-6 h-80">
              {usersByRole.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsPie>
                    <Pie
                      data={usersByRole}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      label={({ name, value }) => `${name}: ${value}`}
                    >
                      {usersByRole.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(v) => [formatNumber(v), 'Nombre']} />
                  </RechartsPie>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center text-gray-400">
                  Aucune donnée utilisateur
                </div>
              )}
            </div>
          </div>

          {/* Répartition abonnements par statut */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden lg:col-span-2">
            <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50 flex items-center gap-2">
              <CalendarCheck className="w-5 h-5 text-[#7238D4]" />
              <h2 className="font-semibold text-gray-900">Abonnements par statut</h2>
            </div>
            <div className="p-6 h-80">
              {subscriptionsByStatus.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsPie>
                    <Pie
                      data={subscriptionsByStatus}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      label={({ name, value }) => `${name}: ${value}`}
                    >
                      {subscriptionsByStatus.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(v) => [formatNumber(v), 'Nombre']} />
                    <Legend />
                  </RechartsPie>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center text-gray-400">
                  Aucun abonnement enregistré
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
