import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/useAuth';
import employeeReservationService from '../../services/employee/reservationService';

export default function EmployeeReservations() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [statut, setStatut] = useState('');
  const [actionLoading, setActionLoading] = useState(null);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    if (user.role !== 'employee') {
      navigate('/');
      return;
    }
    fetchReservations();
  }, [user, navigate, statut]);

  const fetchReservations = async () => {
    try {
      setLoading(true);
      const params = { limit: 50 };
      if (statut) params.statut = statut;
      if (search.trim()) params.search = search.trim();
      const res = await employeeReservationService.getReservations(params);
      setReservations(res.data || []);
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Impossible de charger les réservations');
      setReservations([]);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchReservations();
  };

  const handleConfirm = async (id) => {
    if (!window.confirm('Confirmer cette réservation ? Le client recevra une notification avec le numéro.')) return;
    setActionLoading(id);
    try {
      await employeeReservationService.confirm(id);
      setReservations((prev) =>
        prev.map((r) => (r.id === id ? { ...r, statut: 'confirmee' } : r))
      );
      alert('Réservation confirmée. Le client a été notifié.');
    } catch (err) {
      alert(err.response?.data?.message || 'Erreur lors de la confirmation');
    } finally {
      setActionLoading(null);
    }
  };

  const handleCheckIn = async (id) => {
    if (!window.confirm('Effectuer le check-in ?')) return;
    setActionLoading(id);
    try {
      await employeeReservationService.checkIn(id);
      setReservations((prev) =>
        prev.map((r) => (r.id === id ? { ...r, statut: 'check_in' } : r))
      );
      alert('Check-in effectué.');
    } catch (err) {
      alert(err.response?.data?.message || 'Erreur lors du check-in');
    } finally {
      setActionLoading(null);
    }
  };

  const handleCheckOut = async (id) => {
    if (!window.confirm('Effectuer le check-out ?')) return;
    setActionLoading(id);
    try {
      await employeeReservationService.checkOut(id);
      setReservations((prev) =>
        prev.map((r) => (r.id === id ? { ...r, statut: 'terminee' } : r))
      );
      alert('Check-out effectué.');
    } catch (err) {
      alert(err.response?.data?.message || 'Erreur lors du check-out');
    } finally {
      setActionLoading(null);
    }
  };

  const handleCancel = async (id) => {
    if (!window.confirm('Annuler cette réservation ?')) return;
    setActionLoading(id);
    try {
      await employeeReservationService.cancel(id);
      setReservations((prev) =>
        prev.map((r) => (r.id === id ? { ...r, statut: 'annulee' } : r))
      );
      alert('Réservation annulée.');
    } catch (err) {
      alert(err.response?.data?.message || 'Erreur lors de l\'annulation');
    } finally {
      setActionLoading(null);
    }
  };

  const statutLabel = (s) => {
    const map = {
      en_attente: 'En attente',
      confirmee: 'Confirmée',
      annulee: 'Annulée',
      terminee: 'Terminée',
      check_in: 'Check-in',
      check_out: 'Check-out',
    };
    return map[s] || s;
  };

  const statutColor = (s) => {
    if (s === 'confirmee' || s === 'check_in') return 'bg-green-100 text-green-800';
    if (s === 'en_attente') return 'bg-amber-100 text-amber-800';
    if (s === 'annulee') return 'bg-red-100 text-red-800';
    if (s === 'terminee') return 'bg-gray-100 text-gray-800';
    return 'bg-gray-100 text-gray-800';
  };

  const formatDate = (d) => {
    if (!d) return '—';
    return new Date(d).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  const clientName = (r) => {
    const c = r.client;
    if (!c) return '—';
    return [c.nom, c.prenom].filter(Boolean).join(' ') || c.email || '—';
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">
          Réservations
        </h1>

        <div className="bg-white rounded-lg shadow p-4 mb-6 flex flex-wrap gap-4 items-end">
          <form onSubmit={handleSearch} className="flex flex-wrap gap-2 flex-1 min-w-[200px]">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Numéro, nom client…"
              className="flex-1 min-w-[180px] px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#081F5C] focus:border-transparent"
            />
            <button
              type="submit"
              className="px-4 py-2 rounded-lg bg-[#081F5C] text-white font-medium hover:bg-[#06173d]"
            >
              Rechercher
            </button>
          </form>
          <select
            value={statut}
            onChange={(e) => setStatut(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#081F5C]"
          >
            <option value="">Tous les statuts</option>
            <option value="en_attente">En attente</option>
            <option value="confirmee">Confirmée</option>
            <option value="check_in">Check-in</option>
            <option value="terminee">Terminée</option>
            <option value="annulee">Annulée</option>
          </select>
        </div>

        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
            {error}
          </div>
        )}

        {loading ? (
          <div className="text-center py-12 text-gray-500">Chargement…</div>
        ) : reservations.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-8 text-center text-gray-500">
            Aucune réservation.
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Numéro</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Client</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Chambre</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Dates</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Statut</th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {reservations.map((r) => {
                    const chambre = r.chambre;
                    const busy = actionLoading === r.id;
                    return (
                      <tr key={r.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3 text-sm font-medium text-gray-900">
                          {r.numero_reservation || `#${r.id}`}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-600">
                          {clientName(r)}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-600">
                          {chambre?.numero_chambre || '—'}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-600">
                          {formatDate(r.date_arrivee)} → {formatDate(r.date_depart)}
                        </td>
                        <td className="px-4 py-3">
                          <span
                            className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${statutColor(
                              r.statut
                            )}`}
                          >
                            {statutLabel(r.statut)}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-right space-x-2">
                          {r.statut === 'en_attente' && (
                            <button
                              onClick={() => handleConfirm(r.id)}
                              disabled={busy}
                              className="px-3 py-1.5 rounded-lg bg-green-600 text-white text-sm font-medium hover:bg-green-700 disabled:opacity-50"
                            >
                              {busy ? '…' : 'Confirmer'}
                            </button>
                          )}
                          {r.statut === 'confirmee' && (
                            <button
                              onClick={() => handleCheckIn(r.id)}
                              disabled={busy}
                              className="px-3 py-1.5 rounded-lg bg-[#081F5C] text-white text-sm font-medium hover:bg-[#06173d] disabled:opacity-50"
                            >
                              {busy ? '…' : 'Check-in'}
                            </button>
                          )}
                          {r.statut === 'check_in' && (
                            <button
                              onClick={() => handleCheckOut(r.id)}
                              disabled={busy}
                              className="px-3 py-1.5 rounded-lg bg-[#861D1D] text-white text-sm font-medium hover:bg-[#681515] disabled:opacity-50"
                            >
                              {busy ? '…' : 'Check-out'}
                            </button>
                          )}
                          {['en_attente', 'confirmee'].includes(r.statut) && (
                            <button
                              onClick={() => handleCancel(r.id)}
                              disabled={busy}
                              className="px-3 py-1.5 rounded-lg border border-red-300 text-red-700 text-sm font-medium hover:bg-red-50 disabled:opacity-50"
                            >
                              Annuler
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
