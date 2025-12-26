// src/screens/employee/StockScreen.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AddProduitModal from './AddProduitModal';
import MouvementModal from './MouvementModal';
import CategorieModal from '../../components/stock/CategorieModal';
import HistoriqueMouvementsModal from './HistoriqueMouvementsModal';
import { History } from 'lucide-react';

const API_URL = 'http://localhost:3000/api/employee/stock';

const StockScreen = () => {
  const [articles, setArticles] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [categorieFilter, setCategorieFilter] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  
  // État pour contrôler l'ouverture/fermeture des modals
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isMouvementModalOpen, setIsMouvementModalOpen] = useState(false);
  const [isCategorieModalOpen, setIsCategorieModalOpen] = useState(false);
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [historiqueOpen, setHistoriqueOpen] = useState(false);


  const token = localStorage.getItem('token');

  // Charger les catégories au démarrage
  useEffect(() => {
    fetchCategories();
  }, [token]);

  const fetchCategories = async () => {
    try {
      const res = await axios.get(`${API_URL}/categories`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCategories(res.data.data);
    } catch (err) {
      console.error(err);
    }
  };

  // Charger les articles
  const fetchStock = async () => {
    setLoading(true);
    try {
      const res = await axios.get(API_URL, {
        headers: { Authorization: `Bearer ${token}` },
        params: { page, limit: 15, search, categorie_id: categorieFilter || undefined }
      });
      setArticles(res.data.data);
      setTotalPages(res.data.pagination.pages);
    } catch (err) {
        console.error(err);
      alert('Erreur chargement stock');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStock();
  }, [page, search, categorieFilter]);

  // Couleur selon niveau stock
  const getStockLevel = (actuelle, minimale) => {
    if (actuelle === 0) return 'text-red-600 font-bold';
    if (actuelle <= minimale) return 'text-orange-600 font-bold';
    return 'text-green-600';
  };

  // Ouvrir le modal de mouvement
  const openMouvementModal = (article) => {
    setSelectedArticle(article);
    setIsMouvementModalOpen(true);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Gestion du Stock</h1>
        <p className="text-gray-600">Suivi des articles et niveaux de stock</p>
      </div>

      {/* Filtres */}
      <div className="bg-white p-4 rounded-lg shadow mb-6 flex flex-wrap gap-4 items-center">
        <input
          type="text"
          placeholder="Rechercher un article..."
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          className="px-4 py-2 border rounded-lg w-full md:w-80"
        />
        <select
          value={categorieFilter}
          onChange={(e) => { setCategorieFilter(e.target.value); setPage(1); }}
          className="px-4 py-2 border rounded-lg"
        >
          <option value="">Toutes les catégories</option>
          {categories.map(cat => (
            <option key={cat.id} value={cat.id}>{cat.nom}</option>
          ))}
        </select>
        
        <div className="flex gap-2 ml-auto">
          <button 
            onClick={() => setIsCategorieModalOpen(true)}
            className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition"
            title="Gérer les catégories"
          >
            📁 Catégories
          </button>
          <button 
            onClick={() => setIsAddModalOpen(true)}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
          >
            + Nouvel article
          </button>
        </div>
      </div>

      {/* Tableau */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Article</th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Catégorie</th>
              <th className="px-6 py-4 text-center text-xs font-medium text-gray-500 uppercase">Qté Actuelle</th>
              <th className="px-6 py-4 text-center text-xs font-medium text-gray-500 uppercase">Qté Min</th>
              <th className="px-6 py-4 text-center text-xs font-medium text-gray-500 uppercase">Unité</th>
              <th className="px-6 py-4 text-center text-xs font-medium text-gray-500 uppercase">Statut</th>
              <th className="px-6 py-4 text-center text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {loading ? (
              <tr><td colSpan="7" className="text-center py-10">Chargement...</td></tr>
            ) : articles.length === 0 ? (
              <tr><td colSpan="7" className="text-center py-10 text-gray-500">Aucun article trouvé</td></tr>
            ) : (
              articles.map(article => (
                <tr key={article.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium">{article.nom_article}</td>
                  <td className="px-6 py-4 text-gray-600">
                    {article.CategorieStock?.nom || 'Non classé'}
                  </td>
                  <td className={`px-6 py-4 text-center font-bold ${getStockLevel(article.quantite_actuelle, article.quantite_minimale)}`}>
                    {article.quantite_actuelle}
                  </td>
                  <td className="px-6 py-4 text-center text-gray-600">{article.quantite_minimale}</td>
                  <td className="px-6 py-4 text-center text-sm">{article.unite_mesure || '-'}</td>
                  <td className="px-6 py-4 text-center">
                    {article.quantite_actuelle === 0 ? (
                      <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-xs">Rupture</span>
                    ) : article.quantite_actuelle <= article.quantite_minimale ? (
                      <span className="px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-xs">Alerte</span>
                    ) : (
                      <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs">OK</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <button 
                      onClick={() => openMouvementModal(article)}
                      className="text-blue-600 hover:underline mr-3"
                    >
                      Entrée
                    </button>
                    <button 
                      onClick={() => openMouvementModal(article)}
                      className="text-red-600 hover:underline"
                    >
                      Sortie
                    </button>
                  </td>
                  <td className="px-6 py-4 text-center space-x-2">
                      <button
                        onClick={() => {
                        setSelectedArticle(article);
                        setHistoriqueOpen(true);
                        }}
                        className="text-indigo-600 hover:text-indigo-800 font-medium flex items-center gap-1 mx-auto"
                        title="Voir l'historique"
                      >
                        <History size={18} />
                            Historique
                      </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        {/* Pagination */}
        <div className="bg-gray-50 px-6 py-4 flex justify-between items-center">
          <span className="text-sm text-gray-600">
            Page {page} sur {totalPages}
          </span>
          <div className="flex gap-2">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-4 py-2 border rounded disabled:opacity-50"
            >
              Précédent
            </button>
            <button
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="px-4 py-2 border rounded disabled:opacity-50"
            >
              Suivant
            </button>
          </div>
        </div>
      </div>

      {/* Modal Ajout Produit */}
      <AddProduitModal 
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSuccess={() => {
          fetchStock();
          setIsAddModalOpen(false);
        }}
      />

      {/* Modal Mouvement de Stock */}
      <MouvementModal 
        isOpen={isMouvementModalOpen}
        onClose={() => {
          setIsMouvementModalOpen(false);
          setSelectedArticle(null);
        }}
        onSuccess={() => {
          fetchStock();
          setIsMouvementModalOpen(false);
          setSelectedArticle(null);
        }}
        article={selectedArticle}
      />

      {/* Modal Gestion Catégories */}
      <CategorieModal
        isOpen={isCategorieModalOpen}
        onClose={() => setIsCategorieModalOpen(false)}
        onSuccess={() => {
          fetchCategories(); // Recharge les catégories
          setIsCategorieModalOpen(false);
        }}
      />

      {/* Modal Historique */}
        <HistoriqueMouvementsModal
          isOpen={historiqueOpen}
          onClose={() => {
         setHistoriqueOpen(false);
          setSelectedArticle(null);
        }}
        article={selectedArticle}
        />
    </div>
  );
};

export default StockScreen;