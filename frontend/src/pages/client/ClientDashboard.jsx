import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/useAuth';
import notificationService from '../../services/client/notificationService';

export default function ClientDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
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
    fetchNotifications();
  }, [user, navigate]);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const res = await notificationService.getMyNotifications();
      setNotifications(res.data || []);
      setUnreadCount(res.unreadCount ?? 0);
    } catch (err) {
      setError('Impossible de charger les notifications');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkRead = async (id) => {
    try {
      await notificationService.markAsRead(id);
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, read: true } : n))
      );
      setUnreadCount((c) => Math.max(0, c - 1));
    } catch (err) {
      console.error(err);
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await notificationService.markAllAsRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
      setUnreadCount(0);
    } catch (err) {
      console.error(err);
    }
  };

  const formatDate = (d) => {
    if (!d) return '';
    const dt = new Date(d);
    return dt.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">
          Mon compte
        </h1>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Liens rapides */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              Accès rapide
            </h2>
            <div className="space-y-3">
              <Link
                to="/client/my-reservations"
                className="block w-full py-3 px-4 rounded-lg bg-[#861D1D] text-white text-center font-medium hover:bg-[#681515] transition"
              >
                Mes réservations
              </Link>
              <Link
                to="/search"
                className="block w-full py-3 px-4 rounded-lg border border-gray-300 text-gray-700 text-center font-medium hover:bg-gray-50 transition"
              >
                Rechercher un hôtel
              </Link>
            </div>
          </div>

          {/* Notifications fixe */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-800">
                Notifications
                {unreadCount > 0 && (
                  <span className="ml-2 px-2 py-0.5 rounded-full bg-[#861D1D] text-white text-sm">
                    {unreadCount}
                  </span>
                )}
              </h2>
              {unreadCount > 0 && (
                <button
                  onClick={handleMarkAllRead}
                  className="text-sm text-[#861D1D] hover:underline"
                >
                  Tout marquer comme lu
                </button>
              )}
            </div>

            {error && (
              <p className="text-sm text-red-600 mb-4">{error}</p>
            )}

            {loading ? (
              <div className="text-center py-8 text-gray-500">
                Chargement…
              </div>
            ) : notifications.length === 0 ? (
              <p className="text-gray-500 text-sm py-6 text-center">
                Aucune notification.
              </p>
            ) : (
              <div className="space-y-3 max-h-80 overflow-y-auto">
                {notifications.map((n) => (
                  <div
                    key={n.id}
                    className={`p-4 rounded-lg border ${
                      n.read ? 'bg-gray-50 border-gray-200' : 'bg-red-50/50 border-[#861D1D]/30'
                    }`}
                  >
                    <p className="text-sm text-gray-800">{n.message}</p>
                    {n.numero_reservation && (
                      <p className="mt-1 text-sm font-semibold text-[#861D1D]">
                        Numéro : {n.numero_reservation}
                      </p>
                    )}
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-xs text-gray-500">
                        {formatDate(n.created_at)}
                      </span>
                      {!n.read && (
                        <button
                          onClick={() => handleMarkRead(n.id)}
                          className="text-xs text-[#861D1D] hover:underline"
                        >
                          Marquer comme lu
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
