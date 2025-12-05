import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Building2, Mail, Phone, User, Lock, MapPin, Star, Check, X, Loader2 } from 'lucide-react';
import api from '../../services/api';

const CreateHotel = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    // Hôtel
    nom: '',
    adresse: '',
    ville: '',
    pays: 'Madagascar',
    code_postal: '',
    telephone: '',
    email: '',
    description: '',
    nombre_etoiles: 3,
    // Admin hôtel
    admin_nom: '',
    admin_prenom: '',
    admin_email: '',
    admin_telephone: '',
    admin_password: '',
    // Abonnement (optionnel)
    plan_id: '1', // tu peux le rendre dynamique plus tard
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess(false);
    setLoading(true);

    try {
      const res = await api.post('/superadmin/hotels', formData);

      setSuccess(true);
      setTimeout(() => {
        navigate('/super/hotels');
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur lors de la création de l’hôtel');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-xl shadow-lg">
        <div className="bg-gradient-to-r from-[#7238D4] to-[#5d2ab8] text-white p-8 rounded-t-xl">
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <Building2 size={36} />
            Ajouter un nouvel hôtel
          </h1>
          <p className="mt-2 opacity-90">Créez un hôtel et son administrateur en une seule étape</p>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-8">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center gap-2">
              <X size={20} />
              {error}
            </div>
          )}

          {success && (
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg flex items-center gap-2">
              <Check size={20} />
              Hôtel créé avec succès ! Redirection...
            </div>
          )}

          {/* Section Hôtel */}
          <div>
            <h2 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center gap-2">
              <Building2 className="text-[#7238D4]" />
              Informations de l'hôtel
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Nom de l'hôtel *</label>
                <input
                  type="text"
                  name="nom"
                  required
                  value={formData.nom}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#7238D4] focus:border-transparent"
                  placeholder="Hôtel Le Majestueux"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email de contact</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3.5 text-gray-400" size={20} />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#7238D4]"
                    placeholder="contact@hotel.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Téléphone</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-3.5 text-gray-400" size={20} />
                  <input
                    type="text"
                    name="telephone"
                    value={formData.telephone}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#7238D4]"
                    placeholder="+261 34 00 000 00"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Nombre d'étoiles</label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setFormData({ ...formData, nombre_etoiles: star })}
                      className={`p-2 rounded-lg transition ${
                        formData.nombre_etoiles >= star
                          ? 'text-yellow-500 bg-yellow-50'
                          : 'text-gray-300'
                      }`}
                    >
                      <Star size={28} fill={formData.nombre_etoiles >= star ? 'currentColor' : 'none'} />
                    </button>
                  ))}
                  <span className="ml-3 text-gray-600">{formData.nombre_etoiles} étoile(s)</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Adresse complète *</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3.5 text-gray-400" size={20} />
                  <input
                    type="text"
                    name="adresse"
                    required
                    value={formData.adresse}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#7238D4]"
                    placeholder="Lot II Y 45 Bis Ampasika"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Ville *</label>
                <input
                  type="text"
                  name="ville"
                  required
                  value={formData.ville}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#7238D4]"
                  placeholder="Antananarivo"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Code postal</label>
                <input
                  type="text"
                  name="code_postal"
                  value={formData.code_postal}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#7238D4]"
                  placeholder="101"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  name="description"
                  rows={4}
                  value={formData.description}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#7238D4]"
                  placeholder="Un hôtel de luxe situé au cœur de la capitale..."
                />
              </div>
            </div>
          </div>

          <hr className="my-8 border-gray-200" />

          {/* Section Admin */}
          <div>
            <h2 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center gap-2">
              <User className="text-[#7238D4]" />
              Administrateur de l'hôtel
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Nom *</label>
                <input
                  type="text"
                  name="admin_nom"
                  required
                  value={formData.admin_nom}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#7238D4]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Prénom *</label>
                <input
                  type="text"
                  name="admin_prenom"
                  required
                  value={formData.admin_prenom}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#7238D4]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email (login) *</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3.5 text-gray-400" size={20} />
                  <input
                    type="email"
                    name="admin_email"
                    required
                    value={formData.admin_email}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#7238D4]"
                    placeholder="admin@hotel.com"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Téléphone</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-3.5 text-gray-400" size={20} />
                  <input
                    type="text"
                    name="admin_telephone"
                    value={formData.admin_telephone}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#7238D4]"
                  />
                </div>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Mot de passe *</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3.5 text-gray-400" size={20} />
                  <input
                    type="password"
                    name="admin_password"
                    required
                    minLength="6"
                    value={formData.admin_password}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#7238D4]"
                    placeholder="Minimum 6 caractères"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-4 pt-8">
            <button
              type="button"
              onClick={() => navigate('/super/hotels')}
              className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-8 py-3 bg-[#7238D4] text-white rounded-lg hover:bg-[#5d2ab8] transition flex items-center gap-3 disabled:opacity-70"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin" size={20} />
                  Création en cours...
                </>
              ) : (
                <>
                  <Check size={20} />
                  Créer l'hôtel
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateHotel;