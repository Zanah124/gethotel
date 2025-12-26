import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { Home, Plus, Settings, Search, Pencil, Trash2 } from 'lucide-react';

const ChambresDashboard = () => {
  const navigate = useNavigate();
  const [chambres, setChambres] = useState([]);
  const [typesChambre, setTypesChambre] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Filtres
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [statutFilter, setStatutFilter] = useState('');
  const [etageFilter, setEtageFilter] = useState('');

  // Modal uniquement pour gérer les types
  const [showManageTypes, setShowManageTypes] = useState(false);

  // Formulaire type chambre
  const [formType, setFormType] = useState({
    nom: '',
    description: '',
    prix_par_nuit: '',
    capacite: ''
  });

  // Chambres filtrées
  const chambresFiltered = chambres.filter(chambre => {
    const matchSearch = search === '' || 
      chambre.numero_chambre.toLowerCase().includes(search.toLowerCase()) ||
      chambre.notes?.toLowerCase().includes(search.toLowerCase());
    
    const matchType = typeFilter === '' || 
      chambre.type_chambre_id === parseInt(typeFilter);
    
    const matchStatut = statutFilter === '' || 
      chambre.statut === statutFilter;
    
    const matchEtage = etageFilter === '' || 
      (etageFilter === 'rdc' ? chambre.etage === null || chambre.etage === 0 : chambre.etage === parseInt(etageFilter));
    
    return matchSearch && matchType && matchStatut && matchEtage;
  });

  // Stats basées sur les chambres filtrées
  const stats = {
    total: chambresFiltered.length,
    disponible: chambresFiltered.filter(c => c.statut === 'disponible').length,
    occupee: chambresFiltered.filter(c => c.statut === 'occupee').length,
    maintenance: chambresFiltered.filter(c => c.statut === 'maintenance').length,
    nettoyage: chambresFiltered.filter(c => c.statut === 'nettoyage').length,
  };

  const tauxOccupation = stats.total > 0
    ? ((stats.occupee / stats.total) * 100).toFixed(1)
    : 0;

  // Étages uniques disponibles
  const etagesDisponibles = [...new Set(chambres.map(c => c.etage))].sort((a, b) => {
    if (a === null || a === 0) return -1;
    if (b === null || b === 0) return 1;
    return a - b;
  });

  useEffect(() => {
    fetchChambres();
    fetchTypesChambre();
  }, []);

  const fetchChambres = async () => {
    setLoading(true);
    setError('');
    
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        setError('Non authentifié. Veuillez vous connecter.');
        setChambres([]);
        setLoading(false);
        return;
      }
      
      const res = await api.get('/admin/chambres');
      
      if (typeof res.data === 'string' && res.data.includes('<!doctype html>')) {
        console.error('❌ L\'API retourne du HTML au lieu de JSON');
        setError('Erreur de configuration : vérifiez que le serveur backend est démarré sur http://localhost:3000');
        setChambres([]);
        setLoading(false);
        return;
      }
      
      console.log('✅ Réponse API chambres:', res.data);
      
      let chambresData = [];
      
      if (Array.isArray(res.data)) {
        chambresData = res.data;
      } else if (res.data.data && Array.isArray(res.data.data)) {
        chambresData = res.data.data;
      } else if (res.data.chambres && Array.isArray(res.data.chambres)) {
        chambresData = res.data.chambres;
      } else {
        console.warn('Format de réponse inattendu:', res.data);
        chambresData = [];
      }
      
      setChambres(chambresData);
      
    } catch (err) {
      console.error('❌ Erreur fetch chambres:', err);
      
      if (err.message === 'Network Error' || err.code === 'ERR_NETWORK') {
        setError('❌ Impossible de contacter le serveur. Vérifiez que le backend est démarré sur http://localhost:3000');
      } else {
        setError(err.response?.data?.message || 'Erreur lors du chargement des chambres');
      }
      
      setChambres([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchTypesChambre = async () => {
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        console.error('Token manquant');
        setTypesChambre([]);
        return;
      }
      
      const res = await api.get('/admin/types-chambre');
      
      if (typeof res.data === 'string' && res.data.includes('<!doctype html>')) {
        console.error('❌ L\'API types-chambre retourne du HTML');
        setTypesChambre([]);
        return;
      }
      
      let typesData = [];
      
      if (Array.isArray(res.data)) {
        typesData = res.data;
      } else if (res.data.data && Array.isArray(res.data.data)) {
        typesData = res.data.data;
      } else if (res.data.typesChambre && Array.isArray(res.data.typesChambre)) {
        typesData = res.data.typesChambre;
      }
      
      setTypesChambre(typesData);
      
    } catch (err) {
      console.error('❌ Erreur chargement types:', err);
      setTypesChambre([]);
    }
  };

  const handleAddType = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!formType.nom || !formType.prix_par_nuit || !formType.capacite) {
      setError('Nom, prix et capacité obligatoires');
      return;
    }

    try {
      await api.post('/admin/types-chambre', formType);
      setSuccess('Type ajouté avec succès !');
      setFormType({ nom: '', description: '', prix_par_nuit: '', capacite: '' });
      fetchTypesChambre();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      console.error('Erreur ajout type:', err);
      setError(err.response?.data?.message || 'Erreur lors de l\'ajout du type');
    }
  };

  const clearFilters = () => {
    setSearch('');
    setTypeFilter('');
    setStatutFilter('');
    setEtageFilter('');
  };

  const handleDelete = async (id, numeroChambre) => {
    if (!window.confirm(`Êtes-vous sûr de vouloir supprimer la chambre ${numeroChambre} ?`)) return;
    
    try {
      await api.delete(`/admin/chambres/${id}`);
      setSuccess('Chambre supprimée avec succès');
      
      // Recharger la liste
      fetchChambres();
      
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      console.error('❌ Erreur suppression:', err);
      
      if (err.response?.status === 403) {
        setError('Vous n\'avez pas les permissions pour supprimer cette chambre.');
      } else {
        setError('Erreur lors de la suppression');
      }
    }
  };

  const getStatutBadge = (statut) => {
    const colors = {
      disponible: 'bg-green-100 text-green-800',
      occupee: 'bg-red-100 text-red-800',
      maintenance: 'bg-yellow-100 text-yellow-800',
      nettoyage: 'bg-blue-100 text-blue-800',
    };
    return `px-3 py-1 rounded-full text-sm font-medium ${colors[statut] || 'bg-gray-100 text-gray-800'}`;
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* En-tête */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
          <Home className="w-10 h-10 text-blue-600" />
          Gestion des Chambres
        </h1>
        <p className="text-gray-600 mt-2">
          {stats.total} chambre{stats.total > 1 ? 's' : ''} {search || typeFilter || statutFilter || etageFilter ? 'trouvée(s)' : 'au total'}
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
              placeholder="Rechercher par numéro, notes..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
            />
          </div>

          {/* Filtres */}
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Filtre Type */}
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
            >
              <option value="">Tous les types</option>
              {typesChambre.map(type => (
                <option key={type.id} value={type.id}>{type.nom}</option>
              ))}
            </select>

            {/* Filtre Statut */}
            <select
              value={statutFilter}
              onChange={(e) => setStatutFilter(e.target.value)}
              className="px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
            >
              <option value="">Tous les statuts</option>
              <option value="disponible">Disponible</option>
              <option value="occupee">Occupée</option>
              <option value="maintenance">Maintenance</option>
              <option value="nettoyage">Nettoyage</option>
            </select>

            {/* Filtre Étage */}
            <select
              value={etageFilter}
              onChange={(e) => setEtageFilter(e.target.value)}
              className="px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
            >
              <option value="">Tous les étages</option>
              {etagesDisponibles.map((etage, index) => (
                <option key={index} value={etage === null || etage === 0 ? 'rdc' : etage}>
                  {etage === null || etage === 0 ? 'RDC' : `${etage}e étage`}
                </option>
              ))}
            </select>

            {/* Bouton Réinitialiser */}
            {(search || typeFilter || statutFilter || etageFilter) && (
              <button
                onClick={clearFilters}
                className="px-4 py-3 text-gray-600 hover:text-gray-800 border rounded-lg hover:bg-gray-50 transition"
              >
                Réinitialiser
              </button>
            )}
          </div>

          {/* Boutons d'action */}
          <div className="flex gap-2">
            <button
              onClick={() => setShowManageTypes(true)}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg font-medium flex items-center justify-center gap-2 transition whitespace-nowrap"
            >
              <Settings className="w-5 h-5" />
              Types
            </button>
            
            <button
              onClick={() => navigate('/admin/chambres/add')}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium flex items-center justify-center gap-2 transition whitespace-nowrap"
            >
              <Plus className="w-5 h-5" />
              Ajouter
            </button>
          </div>
        </div>
      </div>

      {/* Messages */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}
      {success && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-6">
          {success}
        </div>
      )}

      {/* Résumé statistique */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
        <div className="bg-white p-5 rounded-lg shadow text-center">
          <p className="text-3xl font-bold text-gray-800">{stats.total}</p>
          <p className="text-sm text-gray-600">Total chambres</p>
        </div>
        <div className="bg-green-50 p-5 rounded-lg shadow text-center">
          <p className="text-3xl font-bold text-green-700">{stats.disponible}</p>
          <p className="text-sm text-gray-600">Disponibles</p>
        </div>
        <div className="bg-red-50 p-5 rounded-lg shadow text-center">
          <p className="text-3xl font-bold text-red-700">{stats.occupee}</p>
          <p className="text-sm text-gray-600">Occupées</p>
        </div>
        <div className="bg-yellow-50 p-5 rounded-lg shadow text-center">
          <p className="text-3xl font-bold text-yellow-700">{stats.maintenance}</p>
          <p className="text-sm text-gray-600">En maintenance</p>
        </div>
        <div className="bg-blue-50 p-5 rounded-lg shadow text-center">
          <p className="text-3xl font-bold text-blue-700">{stats.nettoyage}</p>
          <p className="text-sm text-gray-600">En nettoyage</p>
        </div>
        <div className="bg-purple-50 p-5 rounded-lg shadow text-center">
          <p className="text-3xl font-bold text-purple-700">{tauxOccupation}%</p>
          <p className="text-sm text-gray-600">Taux d'occupation</p>
        </div>
      </div>

      {/* Tableau des chambres */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800">Liste complète des chambres</h2>
        </div>
        {loading ? (
          <div className="p-12 text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <p className="mt-4 text-gray-500">Chargement des chambres...</p>
          </div>
        ) : chambresFiltered.length === 0 ? (
          <div className="p-12 text-center">
            <Home className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg mb-2">
              {chambres.length === 0 ? 'Aucune chambre enregistrée' : 'Aucune chambre trouvée'}
            </p>
            {(search || typeFilter || statutFilter || etageFilter) ? (
              <button
                onClick={clearFilters}
                className="text-blue-600 font-medium hover:underline"
              >
                Réinitialiser les filtres
              </button>
            ) : (
              <button
                onClick={() => navigate('/admin/chambres/add')}
                className="mt-4 text-blue-600 font-medium hover:underline"
              >
                → Ajouter la première chambre
              </button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Numéro</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Étage</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Prix / nuit</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Notes</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {chambresFiltered.map((chambre) => (
                  <tr key={chambre.id} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">{chambre.numero_chambre}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {chambre.etage === null || chambre.etage === 0 ? 'RDC' : `${chambre.etage}e`}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{chambre.typeChambre?.nom || '-'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {chambre.typeChambre?.prix_par_nuit
                        ? `${new Intl.NumberFormat('mg-MG').format(chambre.typeChambre.prix_par_nuit)} Ar`
                        : '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={getStatutBadge(chambre.statut)}>
                        {chambre.statut.charAt(0).toUpperCase() + chambre.statut.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">{chambre.notes || '-'}</td>
                    <td className="px-6 py-4 text-sm font-medium">
                      <div className="flex gap-2">
                        <button
                          onClick={() => navigate(`/admin/chambres/edit/${chambre.id}`)}
                          className="text-blue-600 hover:text-blue-800 transition"
                          title="Modifier"
                        >
                          <Pencil className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => handleDelete(chambre.id, chambre.numero_chambre)}
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
        )}
      </div>

      {/* Modal Gérer Types de Chambres */}
      {showManageTypes && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
              <h3 className="text-2xl font-bold">Gérer les Types de Chambres</h3>
              <button
                onClick={() => setShowManageTypes(false)}
                className="text-3xl text-gray-500 hover:text-gray-700"
              >
                &times;
              </button>
            </div>

            <div className="p-6">
              <div className="bg-gray-50 p-6 rounded-lg mb-8">
                <h4 className="text-lg font-semibold mb-4">Ajouter un nouveau type</h4>
                <form onSubmit={handleAddType} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="Nom (ex: Deluxe)"
                    value={formType.nom}
                    onChange={(e) => setFormType({ ...formType, nom: e.target.value })}
                    className="px-4 py-2 border rounded-md focus:ring-2 focus:ring-indigo-600 focus:border-transparent"
                    required
                  />
                  <input
                    type="number"
                    step="0.01"
                    placeholder="Prix par nuit (Ar)"
                    value={formType.prix_par_nuit}
                    onChange={(e) => setFormType({ ...formType, prix_par_nuit: e.target.value })}
                    className="px-4 py-2 border rounded-md focus:ring-2 focus:ring-indigo-600 focus:border-transparent"
                    required
                  />
                  <select
                    value={formType.capacite}
                    onChange={(e) => setFormType({ ...formType, capacite: e.target.value })}
                    className="px-4 py-2 border rounded-md focus:ring-2 focus:ring-indigo-600 focus:border-transparent"
                    required
                  >
                    <option value="">Capacité</option>
                    {[1,2,3,4,5,6].map(n => <option key={n} value={n}>{n} personne{n > 1 ? 's' : ''}</option>)}
                  </select>
                  <input
                    type="text"
                    placeholder="Description"
                    value={formType.description}
                    onChange={(e) => setFormType({ ...formType, description: e.target.value })}
                    className="px-4 py-2 border rounded-md md:col-span-2 focus:ring-2 focus:ring-indigo-600 focus:border-transparent"
                  />
                  <button type="submit" className="md:col-span-2 py-3 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition font-medium">
                    Ajouter le type
                  </button>
                </form>
              </div>

              <h4 className="text-lg font-semibold mb-4">Types existants</h4>
              {typesChambre.length === 0 ? (
                <p className="text-gray-500">Aucun type enregistré.</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {typesChambre.map((type) => (
                    <div key={type.id} className="border p-4 rounded-lg hover:shadow-md transition">
                      <h5 className="font-bold text-gray-800">{type.nom}</h5>
                      <p className="text-2xl font-semibold text-green-600 mt-2">
                        {new Intl.NumberFormat('mg-MG').format(type.prix_par_nuit)} Ar
                      </p>
                      <p className="text-sm text-gray-600 mt-1">Capacité : {type.capacite} personne{type.capacite > 1 ? 's' : ''}</p>
                      {type.description && <p className="text-sm text-gray-500 italic mt-2">{type.description}</p>}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChambresDashboard;