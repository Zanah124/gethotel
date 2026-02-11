import React, { useState, useEffect } from 'react';
import { Package, AlertTriangle, TrendingUp, TrendingDown, Download, RefreshCw, ArrowRight, History } from 'lucide-react';
import stockService from '../../services/admin/stockService';
import HistoriqueMouvementsModal from '../../components/stock/HistoriqueMouvementsModal';

const StockDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const [alerts, setAlerts] = useState([]);
  const [recentStock, setRecentStock] = useState([]);
  const [error, setError] = useState('');
  const [historiqueOpen, setHistoriqueOpen] = useState(false);
  const [selectedArticle, setSelectedArticle] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    setError('');
    try {
      console.log('🔄 Chargement des données stock...');
      
      // Récupérer les statistiques
      const statsRes = await stockService.getStockStats();
      console.log('📊 Réponse stats:', statsRes);
      
      if (statsRes.success && statsRes.data) {
        setStats(statsRes.data);
      } else if (statsRes.data) {
        setStats(statsRes.data);
      } else if (statsRes.success === false) {
        setError(statsRes.message || 'Erreur lors du chargement des statistiques');
        setStats({
          total_articles: 0,
          quantite_totale: 0,
          valeur_totale: 0,
          articles_stock_faible: 0,
          mouvements_7_jours: 0
        });
      } else {
        setStats(statsRes);
      }

      // Récupérer les alertes
      const alertsRes = await stockService.getLowStockAlerts();
      console.log('⚠️ Réponse alertes:', alertsRes);
      
      if (alertsRes.success && alertsRes.data) {
        setAlerts(Array.isArray(alertsRes.data) ? alertsRes.data : []);
      } else if (Array.isArray(alertsRes.data)) {
        setAlerts(alertsRes.data);
      } else if (Array.isArray(alertsRes)) {
        setAlerts(alertsRes);
      } else if (alertsRes.success === false) {
        console.warn('Erreur alertes:', alertsRes.message);
        setAlerts([]);
      } else {
        setAlerts([]);
      }

      // Récupérer les articles récents (avec pagination limitée)
      const stockRes = await stockService.getAllStock({ limit: 10, page: 1 });
      console.log('📦 Réponse stock:', stockRes);
      
      if (stockRes.success && stockRes.data && Array.isArray(stockRes.data)) {
        setRecentStock(stockRes.data);
      } else if (stockRes.data && Array.isArray(stockRes.data)) {
        setRecentStock(stockRes.data);
      } else if (Array.isArray(stockRes)) {
        setRecentStock(stockRes);
      } else if (stockRes.success === false) {
        console.warn('Erreur stock:', stockRes.message);
        setRecentStock([]);
      } else {
        setRecentStock([]);
      }
    } catch (error) {
      console.error('❌ Erreur chargement données stock:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Erreur lors du chargement des données';
      const statusCode = error.response?.status;
      
      if (statusCode === 401) {
        setError('Session expirée. Veuillez vous reconnecter.');
      } else if (statusCode === 403) {
        setError('Accès refusé. Vérifiez vos permissions.');
      } else if (statusCode === 400) {
        setError(`Erreur de requête: ${errorMessage}`);
      } else {
        setError(`Erreur: ${errorMessage}`);
      }
      
      setStats({
        total_articles: 0,
        quantite_totale: 0,
        valeur_totale: 0,
        articles_stock_faible: 0,
        mouvements_7_jours: 0
      });
      setAlerts([]);
      setRecentStock([]);
    } finally {
      setLoading(false);
    }
  };

  const handleExport = async () => {
    try {
      await stockService.exportStockReport();
    } catch (error) {
      console.error('Erreur export:', error);
      alert('Erreur lors de l\'export');
    }
  };

  const formatNumber = (num) => {
    if (!num) return '0';
    return new Intl.NumberFormat('fr-FR').format(parseFloat(num));
  };

  const formatCurrency = (num) => {
    if (!num) return '0 Ar';
    return `${formatNumber(num)} Ar`;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-28 md:pt-32" style={{ backgroundColor: 'white' }}>
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2" style={{ borderColor: '#A62609' }}></div>
          <p className="mt-4" style={{ color: '#131114' }}>Chargement des données...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'white' }}>
      <div className="p-8">
        {/* Messages d'erreur */}
        {error && (
          <div className="mb-6 p-4 rounded-lg border-2" style={{ backgroundColor: '#fee2e2', borderColor: '#dc2626' }}>
            <div className="flex items-center gap-2">
              <AlertTriangle size={20} style={{ color: '#dc2626' }} />
              <p style={{ color: '#991b1b' }}>{error}</p>
            </div>
          </div>
        )}

        {/* Header */}
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold mb-2" style={{ color: '#131114' }}>
              Résumé du Stock
            </h1>
            <p className="text-gray-600">Vue d'ensemble de votre inventaire</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={fetchData}
              className="px-4 py-2 rounded-lg flex items-center gap-2 transition"
              style={{ backgroundColor: '#E6EED6', color: '#131114' }}
            >
              <RefreshCw size={20} />
              Actualiser
            </button>
            <button
              onClick={handleExport}
              className="px-4 py-2 rounded-lg flex items-center gap-2 text-white transition"
              style={{ backgroundColor: '#A62609' }}
            >
              <Download size={20} />
              Exporter
            </button>
          </div>
        </div>

        {/* Statistiques principales */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Total Articles */}
          <div className="p-6 rounded-xl" style={{ backgroundColor: '#E6EED6' }}>
            <div className="flex items-center justify-between mb-4">
              <Package size={32} style={{ color: '#A62609' }} />
            </div>
            <p className="text-sm mb-2" style={{ color: '#131114', opacity: 0.7 }}>
              Total Articles
            </p>
            <p className="text-4xl font-bold" style={{ color: '#131114' }}>
              {stats ? (stats.total_articles || 0) : 0}
            </p>
          </div>

          {/* Quantité Totale */}
          <div className="p-6 rounded-xl" style={{ backgroundColor: '#E6EED6' }}>
            <div className="flex items-center justify-between mb-4">
              <TrendingUp size={32} style={{ color: '#A62609' }} />
            </div>
            <p className="text-sm mb-2" style={{ color: '#131114', opacity: 0.7 }}>
              Quantité Totale
            </p>
            <p className="text-4xl font-bold" style={{ color: '#131114' }}>
              {stats ? formatNumber(stats.quantite_totale || 0) : 0}
            </p>
          </div>

          {/* Valeur Totale */}
          <div className="p-6 rounded-xl" style={{ backgroundColor: '#E6EED6' }}>
            <div className="flex items-center justify-between mb-4">
              <TrendingUp size={32} style={{ color: '#A62609' }} />
            </div>
            <p className="text-sm mb-2" style={{ color: '#131114', opacity: 0.7 }}>
              Valeur Totale
            </p>
            <p className="text-4xl font-bold" style={{ color: '#A62609' }}>
              {formatCurrency(stats?.valeur_totale || 0)}
            </p>
          </div>

          {/* Articles Stock Faible */}
          <div className="p-6 rounded-xl" style={{ backgroundColor: '#E6EED6' }}>
            <div className="flex items-center justify-between mb-4">
              <AlertTriangle size={32} style={{ color: '#A62609' }} />
            </div>
            <p className="text-sm mb-2" style={{ color: '#131114', opacity: 0.7 }}>
              Stock Faible
            </p>
            <p className="text-4xl font-bold" style={{ color: '#A62609' }}>
              {stats ? (stats.articles_stock_faible || 0) : 0}
            </p>
          </div>
        </div>

        {/* Alertes Stock Faible */}
        {alerts && alerts.length > 0 && (
          <div className="mb-8">
            <div className="p-6 rounded-xl" style={{ backgroundColor: '#E6EED6' }}>
              <div className="flex items-center gap-3 mb-4">
                <AlertTriangle size={24} style={{ color: '#A62609' }} />
                <h2 className="text-xl font-semibold" style={{ color: '#131114' }}>
                  Alertes Stock Faible ({alerts.length})
                </h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {alerts.slice(0, 6).map((alert) => (
                  <div
                    key={alert.id}
                    className="p-4 rounded-lg border-2"
                    style={{ 
                      backgroundColor: 'white',
                      borderColor: '#A62609'
                    }}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-semibold" style={{ color: '#131114' }}>
                        {alert.nom_article}
                      </h3>
                    </div>
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-sm" style={{ color: '#131114', opacity: 0.7 }}>
                          Stock actuel
                        </p>
                        <p className="text-2xl font-bold" style={{ color: '#A62609' }}>
                          {formatNumber(alert.quantite_actuelle)} {alert.unite_mesure || ''}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm" style={{ color: '#131114', opacity: 0.7 }}>
                          Minimum
                        </p>
                        <p className="text-lg font-semibold" style={{ color: '#131114' }}>
                          {formatNumber(alert.quantite_minimale)} {alert.unite_mesure || ''}
                        </p>
                      </div>
                    </div>
                    {alert.CategorieStock && (
                      <p className="text-xs mt-2" style={{ color: '#131114', opacity: 0.5 }}>
                        Catégorie: {alert.CategorieStock.nom}
                      </p>
                    )}
                  </div>
                ))}
              </div>
              {alerts.length > 6 && (
                <div className="mt-4 text-center">
                  <p className="text-sm" style={{ color: '#131114', opacity: 0.7 }}>
                    + {alerts.length - 6} autre{alerts.length - 6 > 1 ? 's' : ''} alerte{alerts.length - 6 > 1 ? 's' : ''}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Mouvements récents et Articles */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Mouvements 7 jours */}
          <div className="p-6 rounded-xl" style={{ backgroundColor: '#E6EED6' }}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold" style={{ color: '#131114' }}>
                Activité Récente
              </h2>
            </div>
            <div className="flex items-end gap-2">
              <p className="text-5xl font-bold" style={{ color: '#A62609' }}>
                {stats ? (stats.mouvements_7_jours || 0) : 0}
              </p>
              <p className="text-sm mb-2" style={{ color: '#131114', opacity: 0.5 }}>
                mouvements (7 derniers jours)
              </p>
            </div>
          </div>

          {/* Articles récents */}
          <div className="p-6 rounded-xl" style={{ backgroundColor: '#E6EED6' }}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold" style={{ color: '#131114' }}>
                Articles Récents
              </h2>
            </div>
            {recentStock.length === 0 ? (
              <p className="text-sm" style={{ color: '#131114', opacity: 0.5 }}>
                Aucun article enregistré
              </p>
            ) : (
              <div className="space-y-3">
                {recentStock.slice(0, 5).map((article) => {
                  const isLow = article.quantite_actuelle <= article.quantite_minimale;
                  return (
                    <div
                      key={article.id}
                      className="p-3 rounded-lg flex justify-between items-center gap-3"
                      style={{ backgroundColor: 'white' }}
                    >
                      <div className="flex-1 min-w-0">
                        <p className="font-medium" style={{ color: '#131114' }}>
                          {article.nom_article}
                        </p>
                        <p className="text-sm" style={{ color: '#131114', opacity: 0.7 }}>
                          {formatNumber(article.quantite_actuelle)} {article.unite_mesure || ''}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        {isLow && (
                          <AlertTriangle size={20} style={{ color: '#A62609' }} />
                        )}
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedArticle(article);
                            setHistoriqueOpen(true);
                          }}
                          className="px-3 py-1.5 rounded-lg flex items-center gap-1.5 text-sm font-medium transition"
                          style={{ color: '#081F5C', backgroundColor: '#E6EED6' }}
                          title="Voir l'historique des mouvements"
                        >
                          <History size={16} />
                          Historique
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Message si aucune alerte et pas d'erreur */}
        {!error && (!alerts || alerts.length === 0) && stats && stats.total_articles === 0 && (
          <div className="mt-8 p-6 rounded-xl text-center" style={{ backgroundColor: '#E6EED6' }}>
            <Package size={48} className="mx-auto mb-4" style={{ color: '#A62609', opacity: 0.5 }} />
            <p className="text-lg font-semibold" style={{ color: '#131114' }}>
              Aucun article en stock
            </p>
            <p className="text-sm mt-2" style={{ color: '#131114', opacity: 0.7 }}>
              Commencez par ajouter des articles à votre inventaire
            </p>
          </div>
        )}

        {/* Message si aucune alerte mais des articles existent */}
        {!error && (!alerts || alerts.length === 0) && stats && stats.total_articles > 0 && (
          <div className="mt-8 p-6 rounded-xl text-center" style={{ backgroundColor: '#E6EED6' }}>
            <Package size={48} className="mx-auto mb-4" style={{ color: '#A62609', opacity: 0.5 }} />
            <p className="text-lg font-semibold" style={{ color: '#131114' }}>
              Aucune alerte de stock faible
            </p>
            <p className="text-sm mt-2" style={{ color: '#131114', opacity: 0.7 }}>
              Tous vos articles sont bien approvisionnés
            </p>
          </div>
        )}

        {/* Modal Historique des mouvements (même vue que l'employé) */}
        <HistoriqueMouvementsModal
          isOpen={historiqueOpen}
          onClose={() => {
            setHistoriqueOpen(false);
            setSelectedArticle(null);
          }}
          article={selectedArticle}
          apiPath="admin/stock"
        />
      </div>
    </div>
  );
};

export default StockDashboard;

