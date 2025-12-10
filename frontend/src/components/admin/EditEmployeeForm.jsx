// src/pages/admin/employees/EditEmployeeForm.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import api from '../../services/api';
import {
  User, Mail, Phone, Briefcase, Building2, DollarSign,
  Calendar, FileText, ArrowLeft, AlertCircle, Save, X
} from 'lucide-react';

const EditEmployeeForm = () => {
  const { id } = useParams(); // ID de l'employé
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    email: '',
    telephone: '',
    poste: '',
    departement: '',
    salaire: '',
    date_embauche: '',
    contrat_type: 'CDI',
    statut: 'actif'
  });

  const departements = [
    'Accueil', 'Hébergement', 'Restaurant', 'Cuisine', 'Bar',
    'Entretien', 'Maintenance', 'Spa & Wellness', 'Administration', 'Sécurité', 'Autre'
  ];

  const postes = [
    'Réceptionniste', 'Chef Réceptionniste', 'Concierge', 'Femme de chambre', 'Valet',
    'Serveur', 'Chef de rang', 'Barman', 'Chef de cuisine', 'Cuisinier',
    'Commis de cuisine', 'Plongeur', 'Agent d\'entretien', 'Technicien de maintenance',
    'Agent de sécurité', 'Manager', 'Responsable RH', 'Comptable', 'Autre'
  ];

  // Charger les données de l'employé
  useEffect(() => {
    const fetchEmployee = async () => {
      try {
        setFetching(true);
        const res = await api.get(`/admin/employees/${id}`);
        const emp = res.data.data;

        setFormData({
          nom: emp.user.nom || '',
          prenom: emp.user.prenom || '',
          email: emp.user.email || '',
          telephone: emp.user.telephone || '',
          poste: emp.poste || '',
          departement: emp.departement || '',
          salaire: emp.salaire_mensuel || '',
          date_embauche: emp.date_embauche ? emp.date_embauche.split('T')[0] : '',
          contrat_type: emp.contrat_type || 'CDI',
          statut: emp.statut || 'actif'
        });
      } catch (err) {
        console.error('Erreur chargement employé:', err);
        setError('Impossible de charger les données de l\'employé');
        if (err.response?.status === 404) {
          setError('Employé non trouvé');
        }
      } finally {
        setFetching(false);
      }
    };

    fetchEmployee();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const payload = {
        nom: formData.nom.trim(),
        prenom: formData.prenom.trim(),
        email: formData.email.trim().toLowerCase(),
        telephone: formData.telephone.trim(),
        poste: formData.poste,
        departement: formData.departement || 'Non défini',
        salaire: formData.salaire ? parseFloat(formData.salaire) : null,
        date_embauche: formData.date_embauche,
        contrat_type: formData.contrat_type,
        statut: formData.statut
      };

      await api.put(`/admin/employees/${id}`, payload);

      setSuccess(true);
      setTimeout(() => {
        navigate('/admin/employees');
      }, 2000);

    } catch (err) {
      console.error('Erreur mise à jour:', err);
      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else if (err.response?.status === 403) {
        setError('Vous n\'avez pas la permission de modifier cet employé');
      } else {
        setError('Erreur lors de la mise à jour');
      }
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="p-6 max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-sm p-12 text-center">
          <div className="inline-flex items-center gap-3 text-gray-600">
            <svg className="animate-spin h-8 w-8" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            <span className="text-lg">Chargement de l'employé...</span>
          </div>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="p-6 max-w-2xl mx-auto">
        <div className="bg-green-50 border border-green-200 rounded-lg p-8 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Save className="w-10 h-10 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-green-800 mb-2">Modifications enregistrées !</h2>
          <p className="text-green-700">L'employé a été mis à jour avec succès.</p>
          <p className="text-sm text-green-600 mt-4">Redirection en cours...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* En-tête */}
      <div className="mb-8 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            to="/admin/employees"
            className="p-2 hover:bg-gray-100 rounded-lg transition"
          >
            <ArrowLeft className="w-6 h-6 text-gray-600" />
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
              <User className="w-10 h-10 text-[#861D1D]" />
              Modifier l'employé
            </h1>
            <p className="text-gray-600 mt-1">
              {formData.prenom} {formData.nom}
            </p>
          </div>
        </div>
      </div>

      {/* Formulaire */}
      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm p-8">
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 mt-0.5" />
            <p className="text-red-700">{error}</p>
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-6">
          {/* Colonne 1 */}
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Prénom</label>
              <div className="relative">
                <User className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  name="prenom"
                  value={formData.prenom}
                  onChange={handleChange}
                  required
                  className="w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#861D1D] focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Nom</label>
              <div className="relative">
                <User className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  name="nom"
                  value={formData.nom}
                  onChange={handleChange}
                  required
                  className="w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#861D1D] focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#861D1D] focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Téléphone</label>
              <div className="relative">
                <Phone className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
                <input
                  type="tel"
                  name="telephone"
                  value={formData.telephone}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#861D1D] focus:border-transparent"
                  placeholder="+261 34 00 000 00"
                />
              </div>
            </div>
          </div>

          {/* Colonne 2 */}
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Poste</label>
              <div className="relative">
                <Briefcase className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
                <select
                  name="poste"
                  value={formData.poste}
                  onChange={handleChange}
                  required
                  className="w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#861D1D] focus:border-transparent appearance-none"
                >
                  <option value="">Sélectionner un poste...</option>
                  {postes.map(p => <option key={p} value={p}>{p}</option>)}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Département</label>
              <div className="relative">
                <Building2 className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
                <select
                  name="departement"
                  value={formData.departement}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#861D1D] focus:border-transparent appearance-none"
                >
                  <option value="">Sélectionner...</option>
                  {departements.map(d => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Salaire Mensuel (MGA)</label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
                <input
                  type="number"
                  name="salaire"
                  value={formData.salaire}
                  onChange={handleChange}
                  min="0"
                  step="1000"
                  className="w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#861D1D] focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Statut</label>
              <div className="relative">
                <select
                  name="statut"
                  value={formData.statut}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#861D1D] focus:border-transparent"
                >
                  <option value="actif">Actif</option>
                  <option value="en_congé">En congé</option>
                  <option value="inactif">Inactif</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Boutons */}
        <div className="flex flex-col sm:flex-row gap-4 mt-8 pt-6 border-t">
          <Link
            to="/admin/employees"
            className="flex-1 px-6 py-3 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition text-center"
          >
            Annuler
          </Link>

          <button
            type="submit"
            disabled={loading}
            className="flex-1 px-6 py-3 bg-[#861D1D] hover:bg-[#6b1616] text-white rounded-lg font-medium transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                <span>Enregistrement...</span>
              </>
            ) : (
              <>
                <Save className="w-5 h-5" />
                <span>Enregistrer les modifications</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditEmployeeForm;