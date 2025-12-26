import React, { useState, useEffect } from 'react';
import api from '../../services/api';

const EmployeeChambresDashboard = () => {
  const [chambres, setChambres] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatut, setFilterStatut] = useState('tous');
  const [filterEtage, setFilterEtage] = useState('tous');

  useEffect(() => {
    fetchChambres();
  }, []);

  const fetchChambres = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await api.get('/admin/chambres');
      let chambresData = [];
      if (Array.isArray(res.data)) chambresData = res.data;
      else if (res.data.data && Array.isArray(res.data.data)) chambresData = res.data.data;
      else if (res.data.chambres && Array.isArray(res.data.chambres)) chambresData = res.data.chambres;

      setChambres(chambresData);
    } catch (err) {
      setError('Impossible de charger les chambres. Contactez l\'administrateur.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };


  // Filtrage
  const filteredChambres = chambres.filter(chambre => {
    const matchSearch = chambre.numero_chambre?.toLowerCase().includes(searchTerm.toLowerCase()) || false;
    const matchStatut = filterStatut === 'tous' || chambre.statut === filterStatut;
    const matchEtage = filterEtage === 'tous' || chambre.etage === (filterEtage === 'RDC' ? 0 : parseInt(filterEtage));
    return matchSearch && matchStatut && matchEtage;
  });

  // Stats
  const stats = {
    total: chambres.length,
    disponible: chambres.filter(c => c.statut === 'disponible').length,
    occupee: chambres.filter(c => c.statut === 'occupee').length,
    nettoyage: chambres.filter(c => c.statut === 'nettoyage').length,
    maintenance: chambres.filter(c => c.statut === 'maintenance').length,
  };

  // ← DÉPLACE CES CONSTANTES ICI (avant le return)
  const primaryColor = 'bg-[#081F5C] hover:bg-[#06173d]';
  const accentColor = 'bg-[#861D1D] hover:bg-[#6b1717]';

  const getStatutBadge = (statut) => {
    switch (statut) {
      case 'disponible': return 'bg-green-100 text-green-800 border-green-300';
      case 'occupee': return 'bg-red-100 text-red-800 border-red-300';
      case 'nettoyage': return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'maintenance': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleChangeStatut = async (chambreId, nouveauStatut) => {
    if (!window.confirm(`Changer le statut de cette chambre en "${nouveauStatut}" ?`)) return;
  
    try {
      await api.patch(`/admin/chambres/${chambreId}/statut`, { statut: nouveauStatut });
      
      setChambres(prev => prev.map(c => 
        c.id === chambreId ? { ...c, statut: nouveauStatut } : c
      ));
      
      alert('Statut mis à jour avec succès !');
    } catch (err) {
      console.error(err);
      alert('Erreur lors de la mise à jour du statut.');
    }
  };

  // Liste des étages uniques
  const etages = ['tous', 'RDC', ...new Set(chambres
    .map(c => c.etage)
    .filter(e => e !== null && e !== 0)
    .sort((a, b) => a - b)
  )];

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* En-tête */}
      <div className="mb-8">
      <h1 className={`text-3xl font-bold mb-2 ${primaryColor.replace('hover:bg-[#06173d]', '')} bg-opacity-90`}>
        Gestion des Chambres - Vue Employé
    </h1>
        <p className="text-gray-600">Suivi en temps réel de l'état des chambres de l'hôtel</p>
      </div>

      {/* Messages d'erreur */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}

      {/* Statistiques rapides */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
        <div className="bg-white p-5 rounded-lg shadow text-center border">
          <p className="text-3xl font-bold text-gray-800">{stats.total}</p>
          <p className="text-sm text-gray-600">Total</p>
        </div>
        <div className="bg-green-50 p-5 rounded-lg shadow text-center border border-green-200">
          <p className="text-3xl font-bold text-green-700">{stats.disponible}</p>
          <p className="text-sm text-gray-600">Disponibles</p>
        </div>
        <div className="bg-red-50 p-5 rounded-lg shadow text-center border border-red-200">
          <p className="text-3xl font-bold text-red-700">{stats.occupee}</p>
          <p className="text-sm text-gray-600">Occupées</p>
        </div>
        <div className="bg-blue-50 p-5 rounded-lg shadow text-center border border-blue-200">
          <p className="text-3xl font-bold text-blue-700">{stats.nettoyage}</p>
          <p className="text-sm text-gray-600">À nettoyer</p>
        </div>
        <div className="bg-yellow-50 p-5 rounded-lg shadow text-center border border-yellow-200">
          <p className="text-3xl font-bold text-yellow-700">{stats.maintenance}</p>
          <p className="text-sm text-gray-600">Maintenance</p>
        </div>
      </div>

      {/* Filtres */}
      <div className="bg-white p-4 rounded-lg shadow mb-6 flex flex-col md:flex-row gap-4">
        <input
          type="text"
          placeholder="Rechercher par numéro..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="px-4 py-2 border rounded-lg flex-1"
        />
        <select
          value={filterStatut}
          onChange={(e) => setFilterStatut(e.target.value)}
          className="px-4 py-2 border rounded-lg"
        >
          <option value="tous">Tous les statuts</option>
          <option value="disponible">Disponible</option>
          <option value="occupee">Occupée</option>
          <option value="nettoyage">Nettoyage</option>
          <option value="maintenance">Maintenance</option>
        </select>
        <select
          value={filterEtage}
          onChange={(e) => setFilterEtage(e.target.value)}
          className="px-4 py-2 border rounded-lg"
        >
          {etages.map(e => (
            <option key={e} value={e}>
              {e === 'tous' ? 'Tous les étages' : e === 'RDC' ? 'Rez-de-chaussée' : `${e}e étage`}
            </option>
          ))}
        </select>
      </div>

      {/* Liste des chambres */}
      {loading ? (
        <div className="text-center py-10 text-gray-500">Chargement des chambres...</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredChambres.length === 0 ? (
            <p className="col-span-full text-center text-gray-500 py-10">Aucune chambre correspondante.</p>
          ) : (
            filteredChambres.map((chambre) => (
              <div
                key={chambre.id}
                className={`bg-white rounded-xl shadow-lg overflow-hidden border-2 transition-all ${
                  chambre.statut === 'nettoyage' ? 'border-blue-400 shadow-blue-200' :
                  chambre.statut === 'maintenance' ? 'border-yellow-400 shadow-yellow-200' : 'border-gray-200'
                }`}
              >
                <div className={`h-3 ${chambre.statut === 'disponible' ? 'bg-green-500' : 
                  chambre.statut === 'occupee' ? 'bg-red-500' : 
                  chambre.statut === 'nettoyage' ? 'bg-blue-500' : 'bg-yellow-500'}`} />

                <div className="p-5">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-2xl font-bold text-[#081F5C]">
                      Chambre {chambre.numero_chambre}
                    </h3>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatutBadge(chambre.statut)}`}>
                      {chambre.statut.charAt(0).toUpperCase() + chambre.statut.slice(1)}
                    </span>
                  </div>

                  <div className="text-sm text-gray-600 space-y-1 mb-4">
                    <p>Étage : {chambre.etage !== null ? (chambre.etage === 0 ? 'RDC' : `${chambre.etage}e`) : '-'}</p>
                    <p>Type : {chambre.typeChambre?.nom || 'Non défini'}</p>
                    <p>Prix : {chambre.typeChambre?.prix_par_nuit 
                      ? `${new Intl.NumberFormat('mg-MG').format(chambre.typeChambre.prix_par_nuit)} Ar` 
                      : '-'} / nuit</p>
                  </div>

                  <div className="mt-4">
  <label className="block text-sm font-medium text-gray-700 mb-1">
    Changer le statut
  </label>
  <select
    value={chambre.statut}
    onChange={(e) => handleChangeStatut(chambre.id, e.target.value)}
    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#081F5C] focus:border-transparent"
    disabled={chambre.statut === 'occupee'} // Optionnel : empêcher modification si occupée
  >
    <option value="disponible">Disponible</option>
    <option value="nettoyage">À nettoyer</option>
    <option value="maintenance">En maintenance</option>
  </select>
</div>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default EmployeeChambresDashboard;