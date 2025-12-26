import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../services/api';
import { Home, Layers, DollarSign, FileText, X, AlertCircle } from 'lucide-react';

const EditChambreForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [typesChambre, setTypesChambre] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingTypes, setLoadingTypes] = useState(true);
  const [loadingChambre, setLoadingChambre] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const [form, setForm] = useState({
    numero_chambre: '',
    etage: '',
    type_chambre_id: '',
    statut: 'disponible',
    notes: ''
  });

  useEffect(() => {
    fetchTypesChambre();
    fetchChambre();
  }, [id]);

  const fetchChambre = async () => {
    try {
      setLoadingChambre(true);
      const res = await api.get(`/admin/chambres/${id}`);
      
      let chambreData = res.data;
      if (res.data.data) {
        chambreData = res.data.data;
      } else if (res.data.chambre) {
        chambreData = res.data.chambre;
      }
      
      setForm({
        numero_chambre: chambreData.numero_chambre || '',
        etage: chambreData.etage !== null ? chambreData.etage.toString() : '',
        type_chambre_id: chambreData.type_chambre_id?.toString() || '',
        statut: chambreData.statut || 'disponible',
        notes: chambreData.notes || ''
      });
    } catch (err) {
      console.error('Erreur chargement chambre:', err);
      setError('Impossible de charger les détails de la chambre');
    } finally {
      setLoadingChambre(false);
    }
  };

  const fetchTypesChambre = async () => {
    try {
      const res = await api.get('/admin/types-chambre');
      
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
      console.error('Erreur chargement types:', err);
      setError('Impossible de charger les types de chambres');
    } finally {
      setLoadingTypes(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: value
    }));
    setError('');
  };

  const validateForm = () => {
    if (!form.numero_chambre) {
      setError('Le numéro de chambre est obligatoire');
      return false;
    }
    if (!form.type_chambre_id) {
      setError('Le type de chambre est obligatoire');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setLoading(true);
    setError('');

    try {
      const payload = {
        numero_chambre: form.numero_chambre.trim(),
        etage: form.etage ? parseInt(form.etage) : null,
        type_chambre_id: parseInt(form.type_chambre_id),
        statut: form.statut,
        notes: form.notes.trim()
      };

      console.log('📤 Mise à jour des données:', payload);

      await api.put(`/admin/chambres/${id}`, payload);

      console.log('✅ Chambre mise à jour avec succès');

      setSuccess(true);
      
      // Rediriger vers le dashboard après 2 secondes
      setTimeout(() => {
        navigate('/admin/chambres');
      }, 2000);

    } catch (err) {
      console.error('❌ Erreur mise à jour chambre:', err);
      
      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else if (err.response?.status === 400) {
        setError('Données invalides. Vérifiez tous les champs.');
      } else if (err.response?.status === 401) {
        setError('Session expirée. Veuillez vous reconnecter.');
        setTimeout(() => navigate('/login'), 2000);
      } else if (err.response?.status === 403) {
        setError('Accès refusé. Vous n\'avez pas les permissions nécessaires.');
      } else if (err.response?.status === 404) {
        setError('Chambre introuvable.');
      } else {
        setError('Erreur lors de la mise à jour de la chambre. Réessayez.');
      }
    } finally {
      setLoading(false);
    }
  };

  if (loadingChambre) {
    return (
      <div className="p-6 max-w-2xl mx-auto">
        <div className="p-12 text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-500">Chargement...</p>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="p-6 max-w-2xl mx-auto">
        <div className="bg-green-50 border border-green-200 rounded-lg p-8 text-center">
          <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-green-800 mb-2">Chambre mise à jour avec succès !</h2>
          <p className="text-green-600 mb-4">
            La chambre {form.numero_chambre} a été modifiée.
          </p>
          <p className="text-sm text-gray-500">Redirection en cours...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* En-tête */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
          <Home className="w-10 h-10 text-blue-600" />
          Modifier la Chambre {form.numero_chambre}
        </h1>
        <p className="text-gray-600 mt-2">Modifiez les informations de la chambre</p>
      </div>

      {/* Message d'erreur global */}
      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-red-800 font-medium">Erreur</p>
            <p className="text-red-600 text-sm">{error}</p>
          </div>
          <button onClick={() => setError('')} className="text-red-400 hover:text-red-600">
            <X className="w-5 h-5" />
          </button>
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-lg p-8 space-y-8">
        {/* Informations de base */}
        <div>
          <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <Home className="w-6 h-6 text-blue-600" />
            Informations de la Chambre
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Numéro de chambre */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Numéro de chambre <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="numero_chambre"
                value={form.numero_chambre}
                onChange={handleChange}
                placeholder="Ex: 101, 205, Suite-A"
                className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                required
              />
            </div>

            {/* Étage */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Étage
              </label>
              <div className="relative">
                <Layers className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
                <input
                  type="number"
                  name="etage"
                  min="0"
                  value={form.etage}
                  onChange={handleChange}
                  placeholder="Ex: 1, 2, 3... (laisser vide pour RDC)"
                  className="w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                />
              </div>
            </div>

            {/* Type de chambre */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Type de chambre <span className="text-red-500">*</span>
              </label>
              {loadingTypes ? (
                <p className="text-gray-500 py-3">Chargement des types...</p>
              ) : typesChambre.length === 0 ? (
                <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                  <p className="text-orange-800 mb-2">Aucun type de chambre disponible.</p>
                </div>
              ) : (
                <div className="relative">
                  <DollarSign className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
                  <select
                    name="type_chambre_id"
                    value={form.type_chambre_id}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent appearance-none"
                    required
                  >
                    <option value="">Choisir un type...</option>
                    {typesChambre.map((type) => (
                      <option key={type.id} value={type.id}>
                        {type.nom} — {new Intl.NumberFormat('mg-MG').format(type.prix_par_nuit)} Ar/nuit ({type.capacite} pers.)
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>

            {/* Statut */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Statut <span className="text-red-500">*</span>
              </label>
              <select
                name="statut"
                value={form.statut}
                onChange={handleChange}
                className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                required
              >
                <option value="disponible">Disponible</option>
                <option value="occupee">Occupée</option>
                <option value="maintenance">En maintenance</option>
                <option value="nettoyage">En nettoyage</option>
              </select>
            </div>

            {/* Notes */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Notes (facultatif)
              </label>
              <div className="relative">
                <FileText className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <textarea
                  name="notes"
                  value={form.notes}
                  onChange={handleChange}
                  rows="4"
                  placeholder="Ex: Vue sur mer, lit king size, calme, accès piscine..."
                  className="w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Boutons d'action */}
        <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t">
          <button
            type="button"
            onClick={() => navigate('/admin/chambres')}
            className="flex-1 px-6 py-3 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition"
            disabled={loading}
          >
            Annuler
          </button>

          <button
            type="submit"
            disabled={loading || typesChambre.length === 0}
            className="flex-1 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                <span>Mise à jour en cours...</span>
              </>
            ) : (
              <>
                <Home className="w-5 h-5" />
                <span>Mettre à jour la chambre</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditChambreForm;