import React, { useState, useEffect } from 'react';
import axios from 'axios';

const TypeChambreManager = () => {
  const [types, setTypes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Formulaire
  const [form, setForm] = useState({
    id: null,
    nom: '',
    description: '',
    prix_par_nuit: '',
    capacite: ''
  });

  const [isEditing, setIsEditing] = useState(false);

  // Charger les types au montage
  useEffect(() => {
    fetchTypes();
  }, []);

  const fetchTypes = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token'); // ou ton système d'auth
      const res = await axios.get('/api/admin/types-chambre', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTypes(res.data);
    } catch (err) {
        console.error(err);
      setError('Erreur lors du chargement des types de chambres');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!form.nom || !form.prix_par_nuit || !form.capacite) {
      setError('Les champs marqués * sont obligatoires');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const config = {
        headers: { Authorization: `Bearer ${token}` }
      };

      if (isEditing) {
        await axios.put(`/api/admin/types-chambre/${form.id}`, form, config);
        setSuccess('Type de chambre modifié avec succès !');
      } else {
        await axios.post('/api/admin/types-chambre', form, config);
        setSuccess('Type de chambre ajouté avec succès !');
      }

      // Réinitialiser le formulaire
      setForm({ id: null, nom: '', description: '', prix_par_nuit: '', capacite: '' });
      setIsEditing(false);
      fetchTypes(); // Rafraîchir la liste
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur lors de l\'enregistrement');
    }
  };

  const handleEdit = (type) => {
    setForm({
      id: type.id,
      nom: type.nom,
      description: type.description || '',
      prix_par_nuit: type.prix_par_nuit,
      capacite: type.capacite
    });
    setIsEditing(true);
    window.scrollTo(0, 0); // Remonter au formulaire
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Supprimer ce type de chambre ? Attention : impossible si des chambres l\'utilisent.')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      await axios.delete(`/api/admin/types-chambre/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSuccess('Type supprimé avec succès');
      fetchTypes();
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur lors de la suppression');
    }
  };

  const cancelEdit = () => {
    setForm({ id: null, nom: '', description: '', prix_par_nuit: '', capacite: '' });
    setIsEditing(false);
  };

  return (
    <div className="max-w-5xl mx-auto p-6 bg-white rounded-lg shadow-lg mt-8">
      <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">
        Gestion des Types de Chambres
      </h2>

      {/* Messages */}
      {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">{error}</div>}
      {success && <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-6">{success}</div>}

      {/* Formulaire */}
      <div className="bg-gray-50 p-6 rounded-lg mb-10">
        <h3 className="text-xl font-semibold mb-4">
          {isEditing ? 'Modifier le type de chambre' : 'Ajouter un nouveau type de chambre'}
        </h3>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nom du type <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={form.nom}
              onChange={(e) => setForm({ ...form, nom: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              placeholder="Ex: Standard, Deluxe, Suite"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Prix par nuit (Ar) <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              step="0.01"
              value={form.prix_par_nuit}
              onChange={(e) => setForm({ ...form, prix_par_nuit: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              placeholder="Ex: 150000"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Capacité (personnes) <span className="text-red-500">*</span>
            </label>
            <select
              value={form.capacite}
              onChange={(e) => setForm({ ...form, capacite: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Choisir...</option>
              {[1,2,3,4,5,6].map(n => (
                <option key={n} value={n}>{n} {n > 1 ? 'personnes' : 'personne'}</option>
              ))}
            </select>
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              rows="3"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              placeholder="Lit king size, balcon, vue mer, minibar..."
            />
          </div>

          <div className="md:col-span-2 flex gap-4">
            <button
              type="submit"
              className="px-6 py-3 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition"
            >
              {isEditing ? 'Modifier' : 'Ajouter'}
            </button>
            {isEditing && (
              <button
                type="button"
                onClick={cancelEdit}
                className="px-6 py-3 bg-gray-500 text-white font-medium rounded-md hover:bg-gray-600 transition"
              >
                Annuler
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Liste des types */}
      <h3 className="text-xl font-semibold mb-4">Types de chambres existants</h3>
      {loading ? (
        <p>Chargement...</p>
      ) : types.length === 0 ? (
        <p className="text-gray-500 text-center py-8">Aucun type de chambre enregistré pour le moment.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {types.map((type) => (
            <div key={type.id} className="border border-gray-200 rounded-lg p-5 hover:shadow-md transition">
              <h4 className="font-bold text-lg text-blue-700">{type.nom}</h4>
              <p className="text-2xl font-semibold text-green-600 my-2">
                {new Intl.NumberFormat('mg-MG').format(type.prix_par_nuit)} Ar
              </p>
              <p className="text-sm text-gray-600">Capacité : {type.capacite} personne{type.capacite > 1 ? 's' : ''}</p>
              {type.description && (
                <p className="text-sm text-gray-700 mt-3 italic">{type.description}</p>
              )}
              <div className="flex gap-3 mt-5">
                <button
                  onClick={() => handleEdit(type)}
                  className="flex-1 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 text-sm"
                >
                  Modifier
                </button>
                <button
                  onClick={() => handleDelete(type.id)}
                  className="flex-1 py-2 bg-red-500 text-white rounded hover:bg-red-600 text-sm"
                >
                  Supprimer
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TypeChambreManager;