import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { Search, Users, Building2, Mail, Phone, UserCircle, Shield, UserCog } from 'lucide-react';

export default function UsersSuper() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [role, setRole] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [pagination, setPagination] = useState({ total: 0, limit: 15 });

  const fetchUsers = async (overrides = {}) => {
    try {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem('token');
      if (!token) {
        window.location.href = '/login';
        return;
      }
      const pg = overrides.page !== undefined ? overrides.page : page;
      const params = { page: pg, limit: 15 };
      const s = overrides.search !== undefined ? overrides.search : search;
      const r = overrides.role !== undefined ? overrides.role : role;
      if (s && String(s).trim()) params.search = String(s).trim();
      if (r) params.role = r;
      const res = await api.get('superadmin/users', {
        params,
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = res.data?.data ?? [];
      const pag = res.data?.pagination ?? {};
      setUsers(data);
      setTotalPages(pag.totalPages ?? 1);
      setPagination({ total: pag.total ?? 0, limit: pag.limit ?? 15 });
      if (overrides.page !== undefined) setPage(overrides.page);
    } catch (err) {
      console.error('Erreur chargement utilisateurs:', err);
      setError(err.response?.data?.message || 'Erreur lors du chargement des utilisateurs');
      setUsers([]);
      setTotalPages(1);
      if (err.response?.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [page, role]);

  const handleSearch = (e) => {
    e?.preventDefault?.();
    fetchUsers({ page: 1, search });
    setPage(1);
  };

  const roleLabel = (r) => {
    const map = { admin: 'Admin', employee: 'Employé', client: 'Client', superadmin: 'Super Admin' };
    return map[r] || r;
  };

  const roleBadge = (r) => {
    const map = {
      admin: 'bg-indigo-100 text-indigo-800',
      employee: 'bg-amber-100 text-amber-800',
      client: 'bg-emerald-100 text-emerald-800',
      superadmin: 'bg-purple-100 text-purple-800',
    };
    return map[r] || 'bg-gray-100 text-gray-800';
  };

  const statutBadge = (s) => {
    const map = {
      actif: 'bg-green-100 text-green-800',
      inactif: 'bg-gray-100 text-gray-600',
      suspendu: 'bg-red-100 text-red-800',
    };
    return map[s] || 'bg-gray-100 text-gray-600';
  };

  const formatDate = (d) => {
    if (!d) return '—';
    return new Date(d).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading && users.length === 0) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-[#7238D4]" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-3xl font-bold text-gray-800">Utilisateurs</h1>
      </div>

      {/* Filtres */}
      <div className="flex flex-wrap gap-4 items-end">
        <form onSubmit={handleSearch} className="flex flex-wrap gap-2 flex-1 min-w-[200px]">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Nom, prénom, email, téléphone..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#7238D4]"
            />
          </div>
          <button
            type="submit"
            className="px-5 py-3 bg-[#7238D4] text-white rounded-lg hover:bg-[#5d2ab8] transition font-medium"
          >
            Rechercher
          </button>
        </form>
        <select
          value={role}
          onChange={(e) => {
            setRole(e.target.value);
            setPage(1);
          }}
          className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#7238D4]"
        >
          <option value="">Tous les rôles</option>
          <option value="admin">Admin</option>
          <option value="employee">Employé</option>
          <option value="client">Client</option>
        </select>
      </div>

      {error && (
        <div className="flex flex-col items-center justify-center py-12 gap-4">
          <p className="text-red-500 text-lg font-semibold">⚠️ {error}</p>
          <button
            onClick={fetchUsers}
            className="px-6 py-2 bg-[#7238D4] text-white rounded-lg hover:bg-[#5d2ab8] transition"
          >
            Réessayer
          </button>
        </div>
      )}

      {!error && (
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Utilisateur
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contact
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Rôle
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Hôtel
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Statut
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Créé le
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {users.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="text-center py-12 text-gray-500">
                      Aucun utilisateur trouvé
                    </td>
                  </tr>
                ) : (
                  users.map((u) => (
                    <tr key={u.id} className="hover:bg-gray-50 transition">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                            {['admin', 'superadmin'].includes(u.role) ? (
                              <Shield size={20} className="text-indigo-500" />
                            ) : u.role === 'employee' ? (
                              <UserCog size={20} className="text-amber-500" />
                            ) : (
                              <UserCircle size={20} className="text-emerald-500" />
                            )}
                          </div>
                          <div>
                            <div className="font-semibold text-gray-900">
                              {u.prenom} {u.nom}
                            </div>
                            <div className="text-xs text-gray-500">ID {u.id}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 text-sm">
                            <Mail size={14} className="text-gray-400" />
                            <a href={`mailto:${u.email}`} className="text-[#7238D4] hover:underline">
                              {u.email}
                            </a>
                          </div>
                          {u.telephone && (
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <Phone size={14} className="text-gray-400" />
                              {u.telephone}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${roleBadge(
                            u.role
                          )}`}
                        >
                          {roleLabel(u.role)}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        {u.hotel ? (
                          <div className="flex items-center gap-2 text-sm text-gray-700">
                            <Building2 size={14} className="text-gray-400" />
                            <span>{u.hotel.nom}</span>
                            {u.hotel.ville && (
                              <span className="text-gray-500">({u.hotel.ville})</span>
                            )}
                          </div>
                        ) : (
                          <span className="text-gray-400">—</span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${statutBadge(
                            u.statut
                          )}`}
                        >
                          {u.statut === 'actif' ? 'Actif' : u.statut === 'inactif' ? 'Inactif' : 'Suspendu'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {formatDate(u.created_at)}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between px-6 py-4 bg-gray-50 border-t">
              <p className="text-sm text-gray-600">
                {pagination.total} utilisateur(s) au total
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page <= 1}
                  className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
                >
                  Précédent
                </button>
                <span className="px-4 py-2 text-sm text-gray-600">
                  Page {page} / {totalPages}
                </span>
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page >= totalPages}
                  className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
                >
                  Suivant
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
