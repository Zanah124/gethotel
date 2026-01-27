import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../services/api'; // Utilisation de ton instance api centralisée !

export default function RegisterForm() {
  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    email: '',
    password: '',
    telephone: '',
    role: 'client'
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!formData.nom || !formData.prenom || !formData.email || !formData.password) {
      setError('Tous les champs obligatoires doivent être remplis');
      setLoading(false);
      return;
    }

    try {
      // Utilisation de api au lieu d'axios direct → plus cohérent !
      const response = await api.post('/auth/register', formData);

      if (response.data.success) {
        setSuccess(true);
        setTimeout(() => navigate('/login'), 2000);
      }
    } catch (err) {
      const message = err.response?.data?.message || 'Erreur lors de l’inscription';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white/40 backdrop-blur-md text-gray-700 max-w-[380px] w-full mx-4 md:p-8 p-6 py-10 text-left text-sm rounded-xl shadow-2xl shadow-black/20"
    >
      <h2 className="text-3xl font-bold mb-8 text-center text-gray-800">Créer un compte</h2>

      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      {success && (
        <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">
          Inscription réussie ! Redirection vers la connexion...
        </div>
      )}

      <div className="grid grid-cols-2 gap-3 mb-4">
        <input
          type="text"
          name="prenom"
          placeholder="Prénom"
          value={formData.prenom}
          onChange={handleChange}
          required
          className="px-4 py-3 rounded-lg bg-white/60 border border-gray-300 focus:border-indigo-500 focus:outline-none transition"
        />
        <input
          type="text"
          name="nom"
          placeholder="Nom"
          value={formData.nom}
          onChange={handleChange}
          required
          className="px-4 py-3 rounded-lg bg-white/60 border border-gray-300 focus:border-indigo-500 focus:outline-none transition"
        />
      </div>

      <div className="mb-4">
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
          className="w-full px-4 py-3 rounded-lg bg-white/60 border border-gray-300 focus:border-indigo-500 focus:outline-none transition"
        />
      </div>

      <div className="mb-4">
        <input
          type="tel"
          name="telephone"
          placeholder="Téléphone (ex: +261 34 12 345 67)"
          value={formData.telephone}
          onChange={handleChange}
          className="w-full px-4 py-3 rounded-lg bg-white/60 border border-gray-300 focus:border-indigo-500 focus:outline-none transition"
        />
      </div>

      <div className="mb-8">
        <input
          type="password"
          name="password"
          placeholder="Mot de passe"
          value={formData.password}
          onChange={handleChange}
          required
          minLength="6"
          className="w-full px-4 py-3 rounded-lg bg-white/60 border border-gray-300 focus:border-indigo-500 focus:outline-none transition"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className={`w-full py-3.5 rounded-lg font-semibold text-white transition-all transform active:scale-95
          ${loading 
            ? 'bg-indigo-400 cursor-not-allowed' 
            : 'bg-indigo-600 hover:bg-indigo-700 shadow-lg hover:shadow-xl'
          }`}
      >
        {loading ? 'Création en cours...' : 'S’inscrire'}
      </button>

      <p className="text-center mt-6 text-gray-600">
        Déjà un compte ?{' '}
        <Link to="/login" className="text-indigo-600 font-semibold hover:underline">
          Se connecter
        </Link>
      </p>

      {/* Bouton Retour vers l'accueil */}
      <div className="mt-6 text-center">
        <button
          type="button"
          onClick={() => navigate('/')}
          className="inline-flex items-center gap-2 text-gray-600 hover:text-indigo-600 font-medium transition"
        >
          ← Retour à l'accueil
        </button>
      </div>
    </form>
  );
}