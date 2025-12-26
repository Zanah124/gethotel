// src/components/stock/AddProduitModal.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Package } from 'lucide-react'; // Icône produit

const API_URL = 'http://localhost:3000/api/employee/stock';

const AddProduitModal = ({ isOpen, onClose, onSuccess }) => {
  const [form, setForm] = useState({
    categorie_id: '',
    nom_article: '',
    description: '',
    quantite_actuelle: 0,
    quantite_minimale: 10,
    unite_mesure: 'unité',
    prix_unitaire: '',
    fournisseur: ''
  });

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem('token');

  // Charger les catégories quand le modal s'ouvre
  useEffect(() => {
    if (isOpen) {
      axios.get(`${API_URL}/categories`, {
        headers: { Authorization: `Bearer ${token}` }
      })
        .then(res => setCategories(res.data.data))
        .catch(() => alert('Erreur : impossible de charger les catégories'));
    }
  }, [isOpen, token]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.categorie_id || !form.nom_article.trim()) {
      alert('La catégorie et le nom du produit sont obligatoires !');
      return;
    }

    setLoading(true);
    try {
      await axios.post(`${API_URL}/create`, form, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      onSuccess?.();     // Recharge la liste des produits
      onClose();         // Ferme le modal
      // Réinitialise le formulaire
      setForm({
        categorie_id: '',
        nom_article: '',
        description: '',
        quantite_actuelle: 0,
        quantite_minimale: 10,
        unite_mesure: 'unité',
        prix_unitaire: '',
        fournisseur: ''
      });
    } catch (err) {
      const msg = err.response?.data?.message || 'Erreur lors de la création du produit';
      alert(msg);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-screen overflow-y-auto">
        {/* En-tête */}
        <div className="bg-gradient-to-r from-[#081F5C] to-[#861D1D] text-white p-6 rounded-t-2xl">
          <h2 className="text-2xl font-bold flex items-center gap-3">
            <Package className="w-8 h-8" />
            Ajouter un Nouveau Produit
          </h2>
        </div>

        {/* Formulaire */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Catégorie <span className="text-red-500">*</span>
              </label>
              <select
                name="categorie_id"
                value={form.categorie_id}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#861D1D] focus:border-transparent transition"
              >
                <option value="">Sélectionner une catégorie</option>
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.nom}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Nom du produit <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="nom_article"
                value={form.nom_article}
                onChange={handleChange}
                required
                placeholder="Ex: Serviettes blanches 500g"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#861D1D] transition"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Description (facultatif)
            </label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows="3"
              placeholder="Caractéristiques, dimensions, référence..."
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#861D1D] transition"
            />
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Quantité en stock
              </label>
              <input
                type="number"
                name="quantite_actuelle"
                value={form.quantite_actuelle}
                onChange={handleChange}
                min="0"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#861D1D]"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Seuil d'alerte
              </label>
              <input
                type="number"
                name="quantite_minimale"
                value={form.quantite_minimale}
                onChange={handleChange}
                min="0"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#861D1D]"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Unité
              </label>
              <select
                name="unite_mesure"
                value={form.unite_mesure}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#861D1D]"
              >
                <option value="unité">unité</option>
                <option value="pièce">pièce</option>
                <option value="kg">kg</option>
                <option value="litre">litre</option>
                <option value="boîte">boîte</option>
                <option value="paquet">paquet</option>
                <option value="rouleau">rouleau</option>
              </select>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Prix unitaire (facultatif)
              </label>
              <input
                type="number"
                step="0.01"
                name="prix_unitaire"
                value={form.prix_unitaire}
                onChange={handleChange}
                placeholder="0.00"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#861D1D]"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Fournisseur
              </label>
              <input
                type="text"
                name="fournisseur"
                value={form.fournisseur}
                onChange={handleChange}
                placeholder="Ex: Metro, CleanPro, etc."
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#861D1D]"
              />
            </div>
          </div>

          {/* Boutons */}
          <div className="flex justify-end gap-4 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-8 py-3 border border-gray-300 rounded-xl font-medium hover:bg-gray-50 transition"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-8 py-3 bg-gradient-to-r from-[#081F5C] to-[#861D1D] text-white font-bold rounded-xl hover:shadow-xl transition disabled:opacity-70 flex items-center gap-2"
            >
              {loading ? 'Création...' : 'Ajouter le produit'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProduitModal;