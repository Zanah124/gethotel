// frontend-web/src/pages/admin/Stock.jsx
import { useState, useEffect } from 'react';
import stockService from '../../services/admin/stockService';
import StockList from '../../components/stock/StockList';
import StockForm from '../../components/stock/StockForm';
import MouvementForm from '../../components/stock/MouvementForm';
import StockAlerts from '../../components/stock/StockAlerts';
import Modal from '../../components/common/Modal';
import Button from '../../components/common/Button';
import SearchBar from '../../components/common/SearchBar';
import { useNotification } from '../../hooks/useNotification';

const Stock = () => {
  const [stock, setStock] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [showMouvementForm, setShowMouvementForm] = useState(false);
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [filters, setFilters] = useState({
    search: '',
    categorie_id: '',
    low_stock: false,
    page: 1
  });
  const { showNotification } = useNotification();

  useEffect(() => {
    loadStock();
    loadAlerts();
    loadStats();
  }, [filters]);

  const loadStock = async () => {
    try {
      setLoading(true);
      const response = await stockService.getAllStock(filters);
      setStock(response.data);
    } catch (error) {
      showNotification('Erreur lors du chargement du stock', 'error');
    } finally {
      setLoading(false);
    }
  };

  const loadAlerts = async () => {
    try {
      const response = await stockService.getLowStockAlerts();
      setAlerts(response.data);
    } catch (error) {
      console.error('Erreur chargement alertes:', error);
    }
  };

  const loadStats = async () => {
    try {
      const response = await stockService.getStockStats();
      setStats(response.data);
    } catch (error) {
      console.error('Erreur chargement stats:', error);
    }
  };

  const handleCreateArticle = () => {
    setSelectedArticle(null);
    setShowForm(true);
  };

  const handleEditArticle = (article) => {
    setSelectedArticle(article);
    setShowForm(true);
  };

  const handleDeleteArticle = async (id) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cet article ?')) return;
    
    try {
      await stockService.deleteStock(id);
      showNotification('Article supprimé avec succès', 'success');
      loadStock();
    } catch (error) {
      showNotification('Erreur lors de la suppression', 'error');
    }
  };

  const handleSaveArticle = async (data) => {
    try {
      if (selectedArticle) {
        await stockService.updateStock(selectedArticle.id, data);
        showNotification('Article modifié avec succès', 'success');
      } else {
        await stockService.createStock(data);
        showNotification('Article créé avec succès', 'success');
      }
      setShowForm(false);
      loadStock();
      loadStats();
    } catch (error) {
      showNotification('Erreur lors de la sauvegarde', 'error');
    }
  };

  const handleMouvement = (article) => {
    setSelectedArticle(article);
    setShowMouvementForm(true);
  };

  const handleSaveMouvement = async (data) => {
    try {
      await stockService.createMouvement(data);
      showNotification('Mouvement enregistré avec succès', 'success');
      setShowMouvementForm(false);
      loadStock();
      loadAlerts();
      loadStats();
    } catch (error) {
      showNotification(error.response?.data?.message || 'Erreur lors du mouvement', 'error');
    }
  };

  const handleExport = async () => {
    try {
      await stockService.exportStockReport();
      showNotification('Export réussi', 'success');
    } catch (error) {
      showNotification('Erreur lors de l\'export', 'error');
    }
  };

  return (
    <div className="stock-page">
      <div className="page-header">
        <h1>Gestion du Stock</h1>
        <div className="actions">
          <Button onClick={handleExport} variant="secondary">
            Exporter CSV
          </Button>
          <Button onClick={handleCreateArticle}>
            Ajouter un Article
          </Button>
        </div>
      </div>

      {/* Statistiques */}
      {stats && (
        <div className="stats-grid">
          <div className="stat-card">
            <h3>Total Articles</h3>
            <p className="stat-value">{stats.total_articles || 0}</p>
          </div>
          <div className="stat-card">
            <h3>Valeur Totale</h3>
            <p className="stat-value">{stats.valeur_totale?.toFixed(2) || 0} €</p>
          </div>
          <div className="stat-card alert">
            <h3>Stock Faible</h3>
            <p className="stat-value">{stats.articles_stock_faible || 0}</p>
          </div>
          <div className="stat-card">
            <h3>Mouvements (7j)</h3>
            <p className="stat-value">{stats.mouvements_7_jours || 0}</p>
          </div>
        </div>
      )}

      {/* Alertes stock faible */}
      {alerts.length > 0 && (
        <StockAlerts alerts={alerts} onReorder={handleMouvement} />
      )}

      {/* Filtres et recherche */}
      <div className="filters">
        <SearchBar
          value={filters.search}
          onChange={(value) => setFilters({ ...filters, search: value, page: 1 })}
          placeholder="Rechercher un article..."
        />
        <label>
          <input
            type="checkbox"
            checked={filters.low_stock}
            onChange={(e) => setFilters({ ...filters, low_stock: e.target.checked, page: 1 })}
          />
          Afficher uniquement les stocks faibles
        </label>
      </div>

      {/* Liste des articles */}
      <StockList
        stock={stock}
        loading={loading}
        onEdit={handleEditArticle}
        onDelete={handleDeleteArticle}
        onMouvement={handleMouvement}
      />

      {/* Modal Formulaire Article */}
      <Modal
        show={showForm}
        onClose={() => setShowForm(false)}
        title={selectedArticle ? 'Modifier l\'article' : 'Nouvel article'}
      >
        <StockForm
          article={selectedArticle}
          onSave={handleSaveArticle}
          onCancel={() => setShowForm(false)}
        />
      </Modal>

      {/* Modal Formulaire Mouvement */}
      <Modal
        show={showMouvementForm}
        onClose={() => setShowMouvementForm(false)}
        title="Enregistrer un mouvement"
      >
        <MouvementForm
          article={selectedArticle}
          onSave={handleSaveMouvement}
          onCancel={() => setShowMouvementForm(false)}
        />
      </Modal>
    </div>
  );
};

export default Stock;