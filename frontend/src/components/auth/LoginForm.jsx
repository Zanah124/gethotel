// src/components/auth/LoginForm.jsx   (ou là où tu l’as placé)

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/useAuth'; 


export default function LoginForm() {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const navigate = useNavigate();
  const { login } = useAuth(); 
  
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // On utilise la fonction login du AuthContext → elle fait tout (token + user + headers)
      await login(formData.email, formData.password);
      const user = JSON.parse(localStorage.getItem('user') || '{}');

      // Petit message de bienvenue
      alert(`Connexion réussie ! Bienvenue ${user?.prenom || ''} `);

      // Redirection selon le rôle (user est déjà à jour grâce au contexte)
      if (user.role === 'super_admin' || user.role === 'superadmin') {
        navigate('/super/dashboard');
      } else if (user.role === 'admin' || user.role === 'admin_hotel') {
        navigate('/admin/dashboard');
      } else if (user.role === 'client') {
        navigate('/client/dashboard');
      } else {
        navigate('/');
      }
    } catch (err) {
      const message = err.response?.data?.message || 'Identifiants incorrects ou serveur indisponible.';
      setError(message);
      console.error('Erreur login :', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white/50 backdrop-blur-lg text-gray-700 max-w-[380px] w-full mx-4 md:p-10 p-6 py-12 text-left rounded-2xl shadow-2xl shadow-black/30"
    >
      <h2 className="text-3xl font-bold mb-8 text-center text-gray-800">Connexion</h2>

      {error && (
        <div className="mb-5 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm">
          {error}
        </div>
      )}

      <div className="mb-5">
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Email"
          required
          className="w-full px-5 py-3.5 rounded-full bg-white/70 border border-gray-300 focus:border-indigo-500 focus:outline-none transition text-gray-800 placeholder-gray-500"
        />
      </div>

      <div className="mb-6">
        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="Mot de passe"
          required
          className="w-full px-5 py-3.5 rounded-full bg-white/70 border border-gray-300 focus:border-indigo-500 focus:outline-none transition text-gray-800 placeholder-gray-500"
        />
      </div>

      <div className="text-right mb-6">
        <a href="#" className="text-indigo-600 text-sm hover:underline">
          Mot de passe oublié ?
        </a>
      </div>

      <button
        type="submit"
        disabled={loading}
        className={`w-full py-4 rounded-full font-bold text-white transition-all transform active:scale-95
          ${loading 
            ? 'bg-indigo-400 cursor-not-allowed' 
            : 'bg-indigo-600 hover:bg-indigo-700 shadow-lg hover:shadow-xl'
          }`}
      >
        {loading ? 'Connexion en cours...' : 'Se connecter'}
      </button>

      <p className="text-center mt-8 text-gray-600">
        Pas encore de compte ?{' '}
        <Link to="/register" className="text-indigo-600 font-bold hover:underline">
          S’inscrire
        </Link>
      </p>
    </form>
  );
}