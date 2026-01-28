import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/useAuth';
import reservationService from '../../services/client/reservationService';

export default function MyReservations() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    if (user.role !== 'client') {
      navigate('/');
      return;
    }
    fetchReservations();
  }, [user, navigate]);

  const fetchReservations = async () => {
    try {
      setLoading(true);
      const res = await reservationService.getMyReservations({ limit: 50 });
      setReservations(res.data || []);
    } catch (err) {
      setError('Impossible de charger vos réservations');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (id) => {
    if (!window.confirm('Annuler cette réservation ?')) return;
    try {
      await reservationService.cancelReservation(id);
      setReservations((prev) => prev.filter((r) => r.id !== id));
    } catch (err) {
      alert(err.response?.data?.message || 'Erreur lors de l\'annulation');
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

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Mes réservations</h1>
          <Link
            to="/client/dashboard"
            className="text-[#861D1D] hover:underline font-medium"
          >
            ← Mon compte
          </Link>
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
            <p className="mb-4">Aucune réservation.</p>
            <Link
              to="/search"
              className="inline-block px-6 py-2 rounded-lg bg-[#861D1D] text-white font-medium hover:bg-[#681515]"
            >
              Rechercher un hôtel
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {reservations.map((r) => {
              const hotel = r.chambre?.hotel || r.hotel;
              const chambre = r.chambre;
              const canCancel = ['en_attente', 'confirmee'].includes(r.statut);
              return (
                <div
                  key={r.id}
                  className="bg-white rounded-lg shadow p-6 border border-gray-200"
                >
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-semibold text-gray-900">
                          {r.numero_reservation || `#${r.id}`}
                        </span>
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${statutColor(
                            r.statut
                          )}`}
                        >
                          {statutLabel(r.statut)}
                        </span>
                      </div>
                      <p className="mt-1 text-gray-600">
                        {hotel?.nom || 'Hôtel'} – Chambre{' '}
                        {chambre?.numero_chambre || '—'}
                      </p>
                      <p className="text-sm text-gray-500 mt-1">
                        {formatDate(r.date_arrivee)} → {formatDate(r.date_depart)}
                        {' · '}
                        {r.prix_total} Ar
                      </p>
                    </div>
                    {canCancel && (
                      <button
                        onClick={() => handleCancel(r.id)}
                        className="px-4 py-2 rounded-lg border border-red-300 text-red-700 text-sm font-medium hover:bg-red-50"
                      >
                        Annuler
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
