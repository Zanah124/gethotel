// src/components/stock/MouvementModal.jsx
import React, { useState } from 'react';
import axios from 'axios';
import { ArrowUp, ArrowDown, Package, AlertCircle } from 'lucide-react';

const API_URL = 'http://localhost:3000/api/employee/stock';

const MouvementModal = ({ isOpen, onClose, onSuccess, article }) => {
  const [form, setForm] = useState({
    type_mouvement: 'entree', // 'entree' ou 'sortie'
    quantite: '',
    motif: ''
  });
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem('token');

  if (!isOpen || !article) return null;

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.quantite || form.quantite <= 0) {
      alert('Veuillez entrer une quantité valide');
      return;
    }

    setLoading(true);
    try {
      await axios.post(
        `${API_URL}/mouvements`,
        {
          stock_id: article.id,
          type_mouvement: form.type_mouvement,
          quantite: parseInt(form.quantite),
          motif: form.motif.trim() || null
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      onSuccess?.(); // Recharge le tableau
      onClose();
      setForm({ type_mouvement: 'entree', quantite: '', motif: '' });
    } catch (err) {
      const msg = err.response?.data?.message || 'Erreur lors du mouvement';
      alert(msg);
    } finally {
      setLoading(false);
    }
  };

  const isSortie = form.type_mouvement === 'sortie';
  const stockApres = isSortie
    ? article.quantite_actuelle - parseInt(form.quantite || 0)
    : article.quantite_actuelle + parseInt(form.quantite || 0);

  const alerteBasse = stockApres <= article.quantite_minimale;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full">
        {/* En-tête */}
        <div className="bg-gradient-to-r from-[#081F5C] to-[#861D1D] text-white p-6 rounded-t-2xl">
          <h2 className="text-2xl font-bold flex items-center gap-3">
            <Package className="w-8 h-8" />
            Mouvement de Stock
          </h2>
        </div>

        {/* Infos article */}
        <div className="p-6 border-b">
          <div className="bg-gray-50 rounded-xl p-4">
            <p className="text-lg font-bold text-gray-800">{article.nom_article}</p>
            <p className="text-sm text-gray-600">
              Catégorie : <span className="font-medium">{article.CategorieStock?.nom || 'N/A'}</span>
            </p>
            <p className="text-sm text-gray-600">
              Stock actuel : <span className="font-bold text-xl">{article.quantite_actuelle}</span> {article.unite_mesure || ''}
            </p>
          </div>
        </div>

        {/* Formulaire */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Type de mouvement */}
          <div className="grid grid-cols-2 gap-4">
            <button
              type="button"
              onClick={() => setForm({ ...form, type_mouvement: 'entree' })}
              className={`p-4 rounded-xl font-bold text-lg transition-all flex items-center justify-center gap-3
                ${form.type_mouvement === 'entree'
                  ? 'bg-green-100 text-green-800 border-2 border-green-500 shadow-lg'
                  : 'bg-gray-100 text-gray-600 border-2 border-transparent hover:bg-gray-200'
                }`}
            >
              <ArrowUp size={28} />
              Entrée
            </button>
            <button
              type="button"
              onClick={() => setForm({ ...form, type_mouvement: 'sortie' })}
              className={`p-4 rounded-xl font-bold text-lg transition-all flex items-center justify-center gap-3
                ${form.type_mouvement === 'sortie'
                  ? 'bg-red-100 text-red-800 border-2 border-red-500 shadow-lg'
                  : 'bg-gray-100 text-gray-600 border-2 border-transparent hover:bg-gray-200'
                }`}
            >
              <ArrowDown size={28} />
              Sortie
            </button>
          </div>

          {/* Quantité */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Quantité <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              name="quantite"
              value={form.quantite}
              onChange={handleChange}
              min="1"
              required
              placeholder="Ex: 50"
              className="w-full px-4 py-3 border border-gray-300 rounded-xl text-lg focus:ring-2 focus:ring-[#861D1D]"
            />
          </div>

          {/* Aperçu du stock après mouvement */}
          <div className={`p-4 rounded-xl border-2 ${alerteBasse ? 'bg-orange-50 border-orange-400' : 'bg-blue-50 border-blue-400'}`}>
            <p className="text-sm font-medium text-gray-700">
              Stock après mouvement :
              <span className={`ml-2 text-2xl font-bold ${stockApres < 0 ? 'text-red-600' : alerteBasse ? 'text-orange-600' : 'text-green-600'}`}>
                {stockApres}
              </span>
              {stockApres < 0 && ' (impossible)'}
              {alerteBasse && stockApres >= 0 && (
                <span className="ml-2 text-orange-600 flex items-center gap-1">
                  <AlertCircle size={18} />
                  Alerte seuil atteint
                </span>
              )}
            </p>
          </div>

          {/* Motif */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Motif (facultatif)
            </label>
            <textarea
              name="motif"
              value={form.motif}
              onChange={handleChange}
              rows="3"
              placeholder="Ex: Réception commande Metro / Utilisation chambres étage 3"
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#861D1D]"
            />
          </div>

          {/* Boutons */}
          <div className="flex justify-end gap-4 pt-4 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-8 py-3 border border-gray-300 rounded-xl font-medium hover:bg-gray-50 transition"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={loading || stockApres < 0}
              className={`px-8 py-3 font-bold rounded-xl transition flex items-center gap-2
                ${isSortie
                  ? 'bg-gradient-to-r from-red-600 to-red-800 text-white hover:shadow-red-500/50'
                  : 'bg-gradient-to-r from-green-600 to-green-800 text-white hover:shadow-green-500/50'
                } disabled:opacity-50`}
            >
              {loading ? 'Enregistrement...' : isSortie ? 'Confirmer la sortie' : 'Confirmer l\'entrée'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MouvementModal;