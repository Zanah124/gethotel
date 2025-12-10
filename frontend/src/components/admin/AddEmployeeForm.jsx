import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { User, Mail, Phone, Lock, Briefcase, Building2, DollarSign, Calendar, FileText, X, AlertCircle } from 'lucide-react';

const AddEmployeeForm = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    email: '',
    telephone: '',
    password: '',
    poste: '',
    departement: '',
    salaire: '',
    date_embauche: new Date().toISOString().split('T')[0],
    contrat_type: 'CDI'
  });

  const departements = [
    'Accueil',
    'Hébergement',
    'Restaurant',
    'Cuisine',
    'Bar',
    'Entretien',
    'Maintenance',
    'Spa & Wellness',
    'Administration',
    'Sécurité',
    'Autre'
  ];

  const postes = [
    'Réceptionniste',
    'Chef Réceptionniste',
    'Concierge',
    'Femme de chambre',
    'Valet',
    'Serveur',
    'Chef de rang',
    'Barman',
    'Chef de cuisine',
    'Cuisinier',
    'Commis de cuisine',
    'Plongeur',
    'Agent d\'entretien',
    'Technicien de maintenance',
    'Agent de sécurité',
    'Manager',
    'Responsable RH',
    'Comptable',
    'Autre'
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError(''); // Réinitialiser l'erreur lors de la modification
  };

  const validateForm = () => {
    if (!formData.nom || !formData.prenom) {
      setError('Le nom et le prénom sont obligatoires');
      return false;
    }
    if (!formData.email || !/\S+@\S+\.\S+/.test(formData.email)) {
      setError('Email invalide');
      return false;
    }
    if (!formData.password || formData.password.length < 6) {
      setError('Le mot de passe doit contenir au moins 6 caractères');
      return false;
    }
    if (!formData.poste) {
      setError('Le poste est obligatoire');
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
      // Préparer les données pour l'API
      const payload = {
        nom: formData.nom.trim(),
        prenom: formData.prenom.trim(),
        email: formData.email.trim().toLowerCase(),
        telephone: formData.telephone.trim(),
        password: formData.password,
        poste: formData.poste,
        departement: formData.departement || 'Non défini',
        salaire: formData.salaire ? parseFloat(formData.salaire) : null,
        date_embauche: formData.date_embauche,
        contrat_type: formData.contrat_type
      };

      console.log('📤 Envoi des données:', payload);

      const response = await api.post('/admin/employees', payload);

      console.log('✅ Réponse API:', response.data);

      setSuccess(true);
      
      // Rediriger vers la liste après 2 secondes
      setTimeout(() => {
        navigate('/admin/employees');
      }, 2000);

    } catch (err) {
      console.error('❌ Erreur création employé:', err);
      
      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else if (err.response?.status === 400) {
        setError('Données invalides. Vérifiez tous les champs.');
      } else if (err.response?.status === 401) {
        setError('Session expirée. Veuillez vous reconnecter.');
        setTimeout(() => navigate('/login'), 2000);
      } else if (err.response?.status === 403) {
        setError('Accès refusé. Vous n\'avez pas les permissions nécessaires.');
      } else {
        setError('Erreur lors de la création de l\'employé. Réessayez.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setFormData({
      nom: '',
      prenom: '',
      email: '',
      telephone: '',
      password: '',
      poste: '',
      departement: '',
      salaire: '',
      date_embauche: new Date().toISOString().split('T')[0],
      contrat_type: 'CDI'
    });
    setError('');
    setSuccess(false);
  };

  if (success) {
    return (
      <div className="p-6 max-w-2xl mx-auto">
        <div className="bg-green-50 border border-green-200 rounded-lg p-8 text-center">
          <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-green-800 mb-2">Employé créé avec succès !</h2>
          <p className="text-green-600 mb-4">
            {formData.prenom} {formData.nom} a été ajouté à l'équipe.
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
          <User className="w-10 h-10 text-[#861D1D]" />
          Ajouter un Employé
        </h1>
        <p className="text-gray-600 mt-2">Remplissez les informations du nouvel employé</p>
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
        {/* Informations personnelles */}
        <div>
          <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <User className="w-6 h-6 text-[#861D1D]" />
            Informations Personnelles
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nom <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="nom"
                value={formData.nom}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#861D1D] focus:border-transparent"
                placeholder="Rakoto"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Prénom <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="prenom"
                value={formData.prenom}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#861D1D] focus:border-transparent"
                placeholder="Jean"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#861D1D] focus:border-transparent"
                  placeholder="jean.rakoto@hotel.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Téléphone
              </label>
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

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mot de passe <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  minLength={6}
                  className="w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#861D1D] focus:border-transparent"
                  placeholder="Minimum 6 caractères"
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">Ce mot de passe sera utilisé pour la première connexion</p>
            </div>
          </div>
        </div>

        {/* Informations professionnelles */}
        <div>
          <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <Briefcase className="w-6 h-6 text-[#861D1D]" />
            Informations Professionnelles
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Département
              </label>
              <div className="relative">
                <Building2 className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
                <select
                  name="departement"
                  value={formData.departement}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#861D1D] focus:border-transparent appearance-none"
                >
                  <option value="">Sélectionner...</option>
                  {departements.map(dept => (
                    <option key={dept} value={dept}>{dept}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Poste <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Briefcase className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
                <select
                  name="poste"
                  value={formData.poste}
                  onChange={handleChange}
                  required
                  className="w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#861D1D] focus:border-transparent appearance-none"
                >
                  <option value="">Sélectionner...</option>
                  {postes.map(poste => (
                    <option key={poste} value={poste}>{poste}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Salaire Mensuel (MGA)
              </label>
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
                  placeholder="1 200 000"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Date d'Embauche
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
                <input
                  type="date"
                  name="date_embauche"
                  value={formData.date_embauche}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#861D1D] focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Type de Contrat
              </label>
              <div className="relative">
                <FileText className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
                <select
                  name="contrat_type"
                  value={formData.contrat_type}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#861D1D] focus:border-transparent appearance-none"
                >
                  <option value="CDI">CDI</option>
                  <option value="CDD">CDD</option>
                  <option value="stage">Stage</option>
                  <option value="interim">Intérim</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Boutons d'action */}
        <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t">
          <button
            type="button"
            onClick={() => navigate('/admin/employees')}
            className="flex-1 px-6 py-3 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition"
            disabled={loading}
          >
            Annuler
          </button>
          
          <button
            type="button"
            onClick={handleReset}
            className="flex-1 px-6 py-3 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition"
            disabled={loading}
          >
            Réinitialiser
          </button>

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
                <span>Création en cours...</span>
              </>
            ) : (
              <>
                <User className="w-5 h-5" />
                <span>Créer l'employé</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddEmployeeForm;