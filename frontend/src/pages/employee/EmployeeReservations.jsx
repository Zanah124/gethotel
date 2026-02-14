import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/useAuth';
import employeeReservationService from '../../services/employee/reservationService';
import { LogIn, LogOut, Calendar, Plus } from 'lucide-react';

/**
 * Vue Réservations employé.
 * Peut être utilisée en mode "toutes" ou en vue ciblée Check-in / Check-out via props.
 * @param {string} [initialStatut] - Filtre initial : 'confirmee' pour Check-in, 'check_in' pour Check-out
 * @param {string} [pageTitle] - Titre de la page (ex: "Check-in", "Check-out")
 * @param {boolean} [lockFilter] - Si true, le filtre statut est fixé à initialStatut (vue dédiée)
 */
export default function EmployeeReservations({ initialStatut = '', pageTitle, lockFilter = false }) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [statut, setStatut] = useState(initialStatut);
  const [actionLoading, setActionLoading] = useState(null);

  // ⭐ IMPORTANT: Définir fetchReservations AVANT les useEffect qui l'utilisent
  const fetchReservations = useCallback(async () => {
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
  }, [statut, search]);

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
  }, [user, navigate]);

  // Garder le filtre synchronisé si initialStatut change (ex: navigation entre Check-in et Check-out)
  useEffect(() => {
    if (initialStatut !== undefined && initialStatut !== null) {
      setStatut(initialStatut);
    }
  }, [initialStatut]);

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
      const res = await employeeReservationService.checkIn(id);
      // Option 1 : mise à jour locale
      setReservations(prev =>
        prev.map(r =>
          r.id === id
            ? { ...r, statut: 'check_in', date_check_in: res.data?.date_check_in || new Date().toISOString() }
            : r
        )
      );
      // Option 2 : recharger après 800ms (plus fiable si plusieurs personnes modifient)
      setTimeout(fetchReservations, 800);
      alert('Check-in effectué avec succès');
    } catch (err) {
      alert(err.response?.data?.message || 'Erreur lors du check-in');
    } finally {
      setActionLoading(null);
    }
  };

  const handleCheckOut = async (id) => {
    if (!window.confirm('Effectuer le check-out ? La chambre passera en nettoyage.')) return;
    setActionLoading(id);
    try {
      const res = await employeeReservationService.checkOut(id);
      const updated = res?.data;
      setReservations((prev) =>
        prev.map((r) =>
          r.id === id
            ? { ...r, statut: 'terminee', date_check_out: updated?.date_check_out || new Date().toISOString() }
            : r
        )
      );
      setTimeout(fetchReservations, 800);
      alert('Check-out effectué. Chambre en nettoyage.');
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

  const formatDateTime = (d) => {
    if (!d) return '—';
    return new Date(d).toLocaleString('fr-FR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const clientName = (r) => {
    const c = r.client;
    if (!c) return '—';
    return [c.nom, c.prenom].filter(Boolean).join(' ') || c.email || '—';
  };

  if (!user) return null;

  const title = pageTitle || 'Réservations';
  const isCheckInView = lockFilter && statut === 'confirmee';
  const isCheckOutView = lockFilter && statut === 'check_in';

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center gap-3 mb-6">
          {isCheckInView && <LogIn className="w-8 h-8 text-[#081F5C]" />}
          {isCheckOutView && <LogOut className="w-8 h-8 text-[#861D1D]" />}
          {!isCheckInView && !isCheckOutView && <Calendar className="w-8 h-8 text-[#081F5C]" />}
          <h1 className="text-2xl font-bold text-gray-900">
            {title}
          </h1>
        </div>
        {(isCheckInView || isCheckOutView) && (
          <p className="text-gray-600 mb-6">
            {isCheckInView
              ? 'Réservations confirmées prêtes pour l\'arrivée du client. Cliquez sur « Check-in » lorsque le client arrive.'
              : 'Clients actuellement en chambre. Cliquez sur « Check-out » au départ.'}
          </p>
        )}

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
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
  <h1 className="text-2xl font-bold text-gray-900">
    {pageTitle || "Réservations"}
  </h1>

  {/* Nouveau bouton */}
  <button
    onClick={() => navigate('/employee/reservations/new')}
    className="flex items-center px-5 py-2.5 bg-[#081F5C] text-white rounded-lg hover:bg-[#06173d] shadow-sm font-medium"
  >
    <Plus className="w-5 h-5 mr-2" />
    Nouvelle réservation
  </button>
</div>
          {!lockFilter && (
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
          )}
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
            {isCheckInView && 'Aucune réservation prête pour check-in.'}
            {isCheckOutView && 'Aucun client actuellement en chambre (check-out).'}
            {!isCheckInView && !isCheckOutView && 'Aucune réservation.'}
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
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Séjour</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Statut</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Check-in / Check-out</th>
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
                        <td className="px-4 py-3 text-sm text-gray-600">
                          <div className="space-y-0.5">
                            {r.date_check_in && (
                              <div title="Heure de check-in">
                                <span className="text-green-700 font-medium">Entrée : </span>
                                {formatDateTime(r.date_check_in)}
                              </div>
                            )}
                            {r.date_check_out && (
                              <div title="Heure de check-out">
                                <span className="text-gray-700 font-medium">Sortie : </span>
                                {formatDateTime(r.date_check_out)}
                              </div>
                            )}
                            {!r.date_check_in && !r.date_check_out && '—'}
                          </div>
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