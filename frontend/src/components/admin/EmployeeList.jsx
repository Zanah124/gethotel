import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { Pencil, Trash2, Plus, Search, Building2, ChevronLeft, ChevronRight, Filter } from 'lucide-react';

const EmployeeList = () => {
  const navigate = useNavigate();
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [departementFilter, setDepartementFilter] = useState('');
  const [statutFilter, setStatutFilter] = useState('');
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalEmployees, setTotalEmployees] = useState(0);
  const [limit] = useState(10);

  useEffect(() => {
    fetchEmployees();
  }, [currentPage, search, departementFilter, statutFilter]);

  const fetchEmployees = async () => {
    try {
      setLoading(true);
      const params = {
        page: currentPage,
        limit: limit,
        search: search,
        departement: departementFilter,
        statut: statutFilter
      };

      const res = await api.get('/admin/employees', { params });
      
      setEmployees(res.data.data || []);
      setTotalPages(res.data.pagination?.totalPages || 1);
      setTotalEmployees(res.data.pagination?.total || 0);
      setCurrentPage(res.data.pagination?.page || 1);

      console.log('✅ Employés chargés:', res.data.data?.length);
    } catch (err) {
      console.error('❌ Erreur chargement employés:', err);
      
      if (err.response?.status === 401) {
        alert('Session expirée. Veuillez vous reconnecter.');
        navigate('/login');
      } else if (err.response?.status === 403) {
        alert('Accès refusé. Vous n\'avez pas les permissions nécessaires.');
      } else {
        alert('Impossible de charger les employés');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, employeeName) => {
    if (!window.confirm(`Êtes-vous sûr de vouloir supprimer ${employeeName} ?`)) return;
    
    try {
      await api.delete(`/admin/employees/${id}`);
      alert('Employé supprimé avec succès');
      
      // Recharger la liste
      fetchEmployees();
    } catch (err) {
      console.error('❌ Erreur suppression:', err);
      
      if (err.response?.status === 403) {
        alert('Vous n\'avez pas les permissions pour supprimer cet employé.');
      } else {
        alert('Erreur lors de la suppression');
      }
    }
  };

  const handleSearchChange = (value) => {
    setSearch(value);
    setCurrentPage(1); // Réinitialiser à la page 1 lors de la recherche
  };

  const handleFilterChange = (type, value) => {
    if (type === 'departement') {
      setDepartementFilter(value);
    } else if (type === 'statut') {
      setStatutFilter(value);
    }
    setCurrentPage(1); // Réinitialiser à la page 1
  };

  const clearFilters = () => {
    setSearch('');
    setDepartementFilter('');
    setStatutFilter('');
    setCurrentPage(1);
  };

  const departements = ['Accueil', 'Hébergement', 'Restaurant', 'Cuisine', 'Bar', 'Entretien', 'Maintenance', 'Spa & Wellness', 'Administration', 'Sécurité'];

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* En-tête */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
          <Building2 className="w-10 h-10 text-[#861D1D]" />
          Gestion des Employés
        </h1>
        <p className="text-gray-600 mt-2">
          {totalEmployees} employé{totalEmployees > 1 ? 's' : ''} au total
        </p>
      </div>

      {/* Barre de recherche et filtres */}
      <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Recherche */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher par nom, email, poste..."
              value={search}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#861D1D] focus:border-transparent"
            />
          </div>

          {/* Filtres */}
          <div className="flex flex-col sm:flex-row gap-4">
            <select
              value={departementFilter}
              onChange={(e) => handleFilterChange('departement', e.target.value)}
              className="px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#861D1D] focus:border-transparent"
            >
              <option value="">Tous les départements</option>
              {departements.map(dept => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
            </select>

            <select
              value={statutFilter}
              onChange={(e) => handleFilterChange('statut', e.target.value)}
              className="px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#861D1D] focus:border-transparent"
            >
              <option value="">Tous les statuts</option>
              <option value="actif">Actif</option>
              <option value="conge">En congé</option>
              <option value="inactif">Inactif</option>
            </select>

            {(search || departementFilter || statutFilter) && (
              <button
                onClick={clearFilters}
                className="px-4 py-3 text-gray-600 hover:text-gray-800 border rounded-lg hover:bg-gray-50 transition"
              >
                Réinitialiser
              </button>
            )}
          </div>

          {/* Bouton Ajouter */}
          <button
            onClick={() => navigate('/admin/employees/add')}
            className="bg-[#861D1D] hover:bg-[#6b1616] text-white px-6 py-3 rounded-lg font-medium flex items-center justify-center gap-2 transition whitespace-nowrap"
          >
            <Plus className="w-5 h-5" />
            Ajouter
          </button>
        </div>
      </div>

      {/* Tableau */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {loading ? (
          <div className="p-12 text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#861D1D]"></div>
            <p className="mt-4 text-gray-500">Chargement des employés...</p>
          </div>
        ) : employees.length === 0 ? (
          <div className="p-12 text-center">
            <Building2 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg mb-2">Aucun employé trouvé</p>
            {(search || departementFilter || statutFilter) ? (
              <button
                onClick={clearFilters}
                className="text-[#861D1D] font-medium hover:underline"
              >
                Réinitialiser les filtres
              </button>
            ) : (
              <button
                onClick={() => navigate('/admin/employees/add')}
                className="mt-4 text-[#861D1D] font-medium hover:underline"
              >
                → Ajouter le premier employé
              </button>
            )}
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Employé
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Département
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Poste
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Téléphone
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Contrat
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Statut
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {employees.map((emp) => (
                    <tr key={emp.id} className="hover:bg-gray-50 transition">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-[#861D1D] text-white rounded-full flex items-center justify-center font-bold text-sm">
                            {emp.user?.nom?.[0]}{emp.user?.prenom?.[0]}
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {emp.user?.prenom} {emp.user?.nom}
                            </div>
                            <div className="text-sm text-gray-500">{emp.user?.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {emp.departement || '—'}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {emp.poste}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {emp.user?.telephone || '—'}
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {emp.contrat_type || 'CDI'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          emp.statut === 'actif'
                            ? 'bg-green-100 text-green-800'
                            : emp.statut === 'conge'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {emp.statut || 'actif'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm font-medium">
                        <div className="flex gap-2">
                          <button
                            onClick={() => navigate(`/admin/employees/edit/${emp.id}`)}
                            className="text-[#861D1D] hover:text-[#6b1616] transition"
                            title="Modifier"
                          >
                            <Pencil className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => handleDelete(emp.id, `${emp.user?.prenom} ${emp.user?.nom}`)}
                            className="text-red-600 hover:text-red-800 transition"
                            title="Supprimer"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="bg-gray-50 px-6 py-4 flex items-center justify-between border-t">
                <div className="text-sm text-gray-700">
                  Page <span className="font-medium">{currentPage}</span> sur{' '}
                  <span className="font-medium">{totalPages}</span>
                  {' '}- Total: <span className="font-medium">{totalEmployees}</span> employé{totalEmployees > 1 ? 's' : ''}
                </div>
                
                <div className="flex gap-2">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                    disabled={currentPage === 1}
                    className="px-4 py-2 border rounded-lg hover:bg-white transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    Précédent
                  </button>
                  
                  <button
                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                    disabled={currentPage === totalPages}
                    className="px-4 py-2 border rounded-lg hover:bg-white transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    Suivant
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default EmployeeList;