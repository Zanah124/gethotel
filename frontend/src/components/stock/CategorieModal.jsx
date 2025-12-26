import React, { useState, useEffect } from 'react';
import { FolderPlus, X } from 'lucide-react';

const API_URL = 'http://localhost:3000/api/employee/stock';

const CategorieModal = ({ isOpen, onClose, onSuccess, categorie = null }) => {
  const [form, setForm] = useState({
    nom: '',
    description: ''
  });
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (categorie) {
      setForm({
        nom: categorie.nom || '',
        description: categorie.description || ''
      });
    } else {
      setForm({ nom: '', description: '' });
    }
  }, [categorie, isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.nom.trim()) {
      alert('Le nom de la catégorie est obligatoire');
      return;
    }

    setLoading(true);
    try {
      const url = categorie 
        ? `${API_URL}/categories/${categorie.id}` 
        : `${API_URL}/categories`;
      
      const method = categorie ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(form)
      });

      if (!response.ok) throw new Error('Erreur lors de l\'enregistrement');

      onSuccess?.();
      onClose();
      setForm({ nom: '', description: '' });
    } catch (err) {
      alert(err.message || 'Erreur lors de l\'enregistrement');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full">
        <div className="bg-gradient-to-r from-[#081F5C] to-[#861D1D] text-white p-6 rounded-t-2xl flex items-center justify-between">
          <h2 className="text-2xl font-bold flex items-center gap-3">
            <FolderPlus className="w-8 h-8" />
            {categorie ? 'Modifier la catégorie' : 'Nouvelle catégorie'}
          </h2>
          <button onClick={onClose} className="hover:bg-white/20 rounded-full p-2">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Nom de la catégorie <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={form.nom}
              onChange={(e) => setForm({ ...form, nom: e.target.value })}
              required
              placeholder="Ex: Linge de lit, Produits d'entretien..."
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#861D1D] focus:border-transparent transition"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Description (facultatif)
            </label>
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              rows="3"
              placeholder="Description de la catégorie..."
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#861D1D] focus:border-transparent transition"
            />
          </div>

          <div className="flex justify-end gap-4 pt-4 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 border border-gray-300 rounded-xl font-medium hover:bg-gray-50 transition"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 bg-gradient-to-r from-[#081F5C] to-[#861D1D] text-white font-bold rounded-xl hover:shadow-xl transition disabled:opacity-50"
            >
              {loading ? 'Enregistrement...' : categorie ? 'Modifier' : 'Créer'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CategorieModal;