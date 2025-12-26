// src/components/stock/HistoriqueMouvementsModal.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Package, ArrowUpRight, ArrowDownRight, Calendar, User } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

const API_URL = 'http://localhost:3000/api/employee/stock';

const HistoriqueMouvementsModal = ({ isOpen, onClose, article }) => {
  const [mouvements, setMouvements] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (isOpen && article) {
      const fetchMouvements = async () => {
        setLoading(true);
        try {
          const res = await axios.get(`${API_URL}/${article.id}/mouvements`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          // Trier par date décroissante
          const sorted = res.data.data.sort((a, b) => new Date(b.date_mouvement) - new Date(a.date_mouvement));
          setMouvements(sorted);
        } catch (err) {
          alert('Erreur lors du chargement de l\'historique');
          console.error(err);
        } finally {
          setLoading(false);
        }
      };
      fetchMouvements();
    }
  }, [isOpen, article, token]);

  if (!isOpen || !article) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-screen overflow-y-auto">
        {/* En-tête */}
        <div className="bg-gradient-to-r from-[#081F5C] to-[#861D1D] text-white p-6 rounded-t-2xl sticky top-0">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold flex items-center gap-3">
              <Package className="w-8 h-8" />
              Historique des Mouvements
            </h2>
            <button
              onClick={onClose}
              className="text-white hover:bg-white/20 p-2 rounded-lg transition"
            >
              ✕
            </button>
          </div>
          <div className="mt-4 bg-white/10 rounded-xl p-4">
            <p className="text-lg font-bold">{article.nom_article}</p>
            <p className="text-sm opacity-90">
              Catégorie : {article.CategorieStock?.nom || 'Non classée'} • 
              Stock actuel : <span className="font-bold">{article.quantite_actuelle}</span> {article.unite_mesure || 'unité(s)'}
            </p>
          </div>
        </div>

        {/* Liste des mouvements */}
        <div className="p-6">
          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-[#861D1D] border-t-transparent"></div>
              <p className="mt-4 text-gray-600">Chargement de l'historique...</p>
            </div>
          ) : mouvements.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 rounded-xl">
              <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">Aucun mouvement enregistré pour ce produit</p>
            </div>
          ) : (
            <div className="space-y-4">
              {mouvements.map((mvt) => {
                const isEntree = mvt.type_mouvement === 'entree';
                const isSortie = mvt.type_mouvement === 'sortie';
                const isAjustement = mvt.type_mouvement === 'ajustement';

                return (
                  <div
                    key={mvt.id}
                    className={`p-5 rounded-xl border-2 transition-all ${
                      isEntree
                        ? 'bg-green-50 border-green-300'
                        : isSortie
                        ? 'bg-red-50 border-red-300'
                        : 'bg-yellow-50 border-yellow-300'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-4">
                        {isEntree && <ArrowUpRight className="w-8 h-8 text-green-600" />}
                        {isSortie && <ArrowDownRight className="w-8 h-8 text-red-600" />}
                        {isAjustement && <Package className="w-8 h-8 text-yellow-600" />}

                        <div>
                          <p className="font-bold text-lg">
                            {isEntree && 'Entrée en stock'}
                            {isSortie && 'Sortie de stock'}
                            {isAjustement && 'Ajustement manuel'}
                          </p>
                          <p className={`text-2xl font-black ${
                            isEntree ? 'text-green-700' : isSortie ? 'text-red-700' : 'text-yellow-700'
                          }`}>
                            {isEntree || isAjustement ? '+' : '-'}{mvt.quantite}
                          </p>
                        </div>
                      </div>

                      <div className="text-right text-sm">
                        <div className="flex items-center gap-2 text-gray-600 mb-1">
                          <Calendar size={16} />
                          <span>{format(new Date(mvt.date_mouvement), 'dd MMMM yyyy à HH:mm', { locale: fr })}</span>
                        </div>
                        {/* ⭐ MODIFICATION ICI : Affichage du nom complet de l'employé */}
                        {mvt.employee ? (
                          <div className="flex items-center gap-2 text-gray-600">
                            <User size={16} />
                            <span className="font-medium">
                              {mvt.employee.prenom} {mvt.employee.nom}
                            </span>
                          </div>
                        ) : mvt.effectue_par ? (
                          <div className="flex items-center gap-2 text-gray-400">
                            <User size={16} />
                            <span>Employé #{mvt.effectue_par}</span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2 text-gray-400">
                            <User size={16} />
                            <span>Système</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {mvt.motif && (
                      <div className="mt-4 pt-4 border-t border-gray-300">
                        <p className="text-sm text-gray-700 italic">
                          💬 Motif : {mvt.motif}
                        </p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Pied */}
        <div className="p-6 border-t bg-gray-50 rounded-b-2xl">
          <div className="flex justify-between items-center">
            <p className="text-sm text-gray-600">
              Total de mouvements : <span className="font-bold">{mouvements.length}</span>
            </p>
            <button
              onClick={onClose}
              className="px-8 py-3 bg-gradient-to-r from-[#081F5C] to-[#861D1D] text-white font-bold rounded-xl hover:shadow-lg transition"
            >
              Fermer
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HistoriqueMouvementsModal;