import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import subscriptionService from '../../services/superadmin/subscriptionService';
import { 
  Calendar, 
  Building2, 
  Search, 
  Filter, 
  Edit, 
  Clock, 
  CheckCircle, 
  XCircle, 
  AlertCircle,
  TrendingUp,
  Calendar as CalendarIcon
} from 'lucide-react';

const SubscriptionsPlanning = () => {
  const navigate = useNavigate();
  const [subscriptions, setSubscriptions] = useState([]);
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [planFilter, setPlanFilter] = useState('');
  const [viewMode, setViewMode] = useState('list'); // 'list' ou 'calendar'
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedDate, setSelectedDate] = useState(new Date());

  const fetchSubscriptions = async () => {
    try {
      setLoading(true);
      setError(null);
      const params = {
        page,
        limit: 20,
        ...(statusFilter && { status: statusFilter }),
        ...(planFilter && { plan_id: planFilter })
      };

      const response = await subscriptionService.getAllSubscriptions(params);
      setSubscriptions(response.data || []);
      setTotalPages(response.pagination?.totalPages || 1);
    } catch (err) {
      console.error('Erreur lors du chargement des abonnements:', err);
      setError(err.response?.data?.message || 'Erreur lors du chargement des abonnements');
      setSubscriptions([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchPlans = async () => {
    try {
      const response = await subscriptionService.getSubscriptionPlans();
      setPlans(response.data || []);
    } catch (err) {
      console.error('Erreur lors du chargement des plans:', err);
    }
  };

  useEffect(() => {
    fetchPlans();
  }, []);

  useEffect(() => {
    fetchSubscriptions();
  }, [page, statusFilter, planFilter]);

  const getStatusBadge = (status) => {
    const badges = {
      active: { bg: 'bg-green-100', text: 'text-green-800', icon: CheckCircle, label: 'Actif' },
      canceled: { bg: 'bg-red-100', text: 'text-red-800', icon: XCircle, label: 'Annulé' },
      past_due: { bg: 'bg-orange-100', text: 'text-orange-800', icon: AlertCircle, label: 'En retard' },
      trialing: { bg: 'bg-blue-100', text: 'text-blue-800', icon: Clock, label: 'Essai' },
      incomplete: { bg: 'bg-yellow-100', text: 'text-yellow-800', icon: AlertCircle, label: 'Incomplet' },
      incomplete_expired: { bg: 'bg-gray-100', text: 'text-gray-800', icon: XCircle, label: 'Expiré' }
    };
    const badge = badges[status] || badges.trialing;
    const Icon = badge.icon;
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${badge.bg} ${badge.text}`}>
        <Icon size={14} />
        {badge.label}
      </span>
    );
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', { 
      day: '2-digit', 
      month: 'short', 
      year: 'numeric' 
    });
  };

  const getDaysUntilExpiry = (endDate) => {
    if (!endDate) return null;
    const end = new Date(endDate);
    const now = new Date();
    const diffTime = end - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const filteredSubscriptions = subscriptions.filter(sub => {
    if (!search) return true;
    const searchLower = search.toLowerCase();
    return (
      sub.hotel?.nom?.toLowerCase().includes(searchLower) ||
      sub.hotel?.ville?.toLowerCase().includes(searchLower) ||
      sub.plan?.name?.toLowerCase().includes(searchLower)
    );
  });

  const stats = {
    total: subscriptions.length,
    active: subscriptions.filter(s => s.status === 'active').length,
    expiringSoon: subscriptions.filter(s => {
      const days = getDaysUntilExpiry(s.current_period_end);
      return days !== null && days > 0 && days <= 7;
    }).length,
    canceled: subscriptions.filter(s => s.status === 'canceled').length
  };

  if (loading && subscriptions.length === 0) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-[#7238D4]"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Planning des Abonnements</h1>
          <p className="text-gray-600 mt-1">Gérez et suivez les abonnements de tous les hôtels</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setViewMode(viewMode === 'list' ? 'calendar' : 'list')}
            className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
          >
            <CalendarIcon size={18} />
            {viewMode === 'list' ? 'Vue Calendrier' : 'Vue Liste'}
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Total</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{stats.total}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="text-blue-600" size={24} />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Actifs</p>
              <p className="text-2xl font-bold text-green-600 mt-1">{stats.active}</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <CheckCircle className="text-green-600" size={24} />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Expirent bientôt</p>
              <p className="text-2xl font-bold text-orange-600 mt-1">{stats.expiringSoon}</p>
            </div>
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <AlertCircle className="text-orange-600" size={24} />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Annulés</p>
              <p className="text-2xl font-bold text-red-600 mt-1">{stats.canceled}</p>
            </div>
            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
              <XCircle className="text-red-600" size={24} />
            </div>
          </div>
        </div>
      </div>

      {/* Filtres */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Recherche */}
          <div className="relative">
            <Search className="absolute left-3 top-3 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Rechercher un hôtel..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#7238D4]"
            />
          </div>

          {/* Filtre Statut */}
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setPage(1);
            }}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#7238D4]"
          >
            <option value="">Tous les statuts</option>
            <option value="active">Actif</option>
            <option value="trialing">Essai</option>
            <option value="past_due">En retard</option>
            <option value="canceled">Annulé</option>
            <option value="incomplete">Incomplet</option>
          </select>

          {/* Filtre Plan */}
          <select
            value={planFilter}
            onChange={(e) => {
              setPlanFilter(e.target.value);
              setPage(1);
            }}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#7238D4]"
          >
            <option value="">Tous les plans</option>
            {plans.map(plan => (
              <option key={plan.id} value={plan.id}>{plan.name}</option>
            ))}
          </select>

          {/* Bouton Reset */}
          {(statusFilter || planFilter || search) && (
            <button
              onClick={() => {
                setStatusFilter('');
                setPlanFilter('');
                setSearch('');
                setPage(1);
              }}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
            >
              Réinitialiser
            </button>
          )}
        </div>
      </div>

      {/* Tableau */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
          {error}
        </div>
      )}

      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Hôtel</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Plan</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Début</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fin</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Jours restants</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredSubscriptions.length === 0 ? (
                <tr>
                  <td colSpan="7" className="text-center py-12 text-gray-500">
                    Aucun abonnement trouvé
                  </td>
                </tr>
              ) : (
                filteredSubscriptions.map((subscription) => {
                  const daysLeft = getDaysUntilExpiry(subscription.current_period_end);
                  return (
                    <tr key={subscription.id} className="hover:bg-gray-50 transition">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-gray-200 border-2 border-dashed rounded-xl flex items-center justify-center">
                            <Building2 size={24} className="text-gray-400" />
                          </div>
                          <div>
                            <div className="font-semibold text-gray-900">{subscription.hotel?.nom || 'N/A'}</div>
                            <div className="text-sm text-gray-500">{subscription.hotel?.ville || ''}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <div className="font-medium text-gray-900">{subscription.plan?.name || 'N/A'}</div>
                          <div className="text-sm text-gray-500">
                            {subscription.plan?.price_monthly ? `${subscription.plan.price_monthly} Ar/mois` : ''}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        {getStatusBadge(subscription.status)}
                      </td>
                      <td className="px-6 py-4 text-gray-700">
                        {formatDate(subscription.current_period_start)}
                      </td>
                      <td className="px-6 py-4 text-gray-700">
                        {formatDate(subscription.current_period_end)}
                      </td>
                      <td className="px-6 py-4">
                        {daysLeft !== null ? (
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                            daysLeft < 0 
                              ? 'bg-red-100 text-red-800' 
                              : daysLeft <= 7 
                              ? 'bg-orange-100 text-orange-800' 
                              : 'bg-green-100 text-green-800'
                          }`}>
                            {daysLeft < 0 ? `Expiré (${Math.abs(daysLeft)}j)` : `${daysLeft} jours`}
                          </span>
                        ) : (
                          <span className="text-gray-400">N/A</span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => {
                            // TODO: Ouvrir modal d'édition
                            alert(`Éditer l'abonnement de ${subscription.hotel?.nom}`);
                          }}
                          className="p-2 hover:bg-gray-100 rounded-lg transition"
                          title="Modifier l'abonnement"
                        >
                          <Edit size={18} className="text-gray-600" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-6 py-4 border-t flex justify-between items-center">
            <span className="text-sm text-gray-600">
              Page {page} sur {totalPages}
            </span>
            <div className="flex gap-2">
              <button
                onClick={() => setPage(Math.max(1, page - 1))}
                disabled={page === 1}
                className="px-4 py-2 border rounded-lg disabled:opacity-50 hover:bg-gray-50 transition"
              >
                Précédent
              </button>
              <button
                onClick={() => setPage(Math.min(totalPages, page + 1))}
                disabled={page === totalPages}
                className="px-4 py-2 border rounded-lg disabled:opacity-50 hover:bg-gray-50 transition"
              >
                Suivant
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SubscriptionsPlanning;
