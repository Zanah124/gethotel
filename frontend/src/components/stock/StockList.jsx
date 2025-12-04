import Button from '../common/Button';
import Badge from '../common/Badge';

const StockList = ({ stock, loading, onEdit, onDelete, onMouvement }) => {
  if (loading) return <div>Chargement...</div>;
  if (!stock || stock.length === 0) return <div>Aucun article dans le stock</div>;

  const getStockStatus = (article) => {
    if (article.quantite_actuelle <= article.quantite_minimale) {
      return { label: 'Stock faible', variant: 'danger' };
    }
    if (article.quantite_actuelle <= article.quantite_minimale * 1.5) {
      return { label: 'Stock moyen', variant: 'warning' };
    }
    return { label: 'Stock OK', variant: 'success' };
  };

  return (
    <div className="stock-list">
      <table>
        <thead>
          <tr>
            <th>Article</th>
            <th>Catégorie</th>
            <th>Quantité</th>
            <th>Unité</th>
            <th>Stock Min</th>
            <th>Prix Unitaire</th>
            <th>Statut</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {stock.map((article) => {
            const status = getStockStatus(article);
            return (
              <tr key={article.id}>
                <td>
                  <strong>{article.nom_article}</strong>
                  {article.description && (
                    <div className="description">{article.description}</div>
                  )}
                </td>
                <td>{article.CategorieStock?.nom || 'N/A'}</td>
                <td className="quantity">{article.quantite_actuelle}</td>
                <td>{article.unite_mesure || 'unité'}</td>
                <td>{article.quantite_minimale}</td>
                <td>{article.prix_unitaire ? `${article.prix_unitaire} €` : 'N/A'}</td>
                <td>
                  <Badge variant={status.variant}>{status.label}</Badge>
                </td>
                <td className="actions">
                  <Button size="sm" onClick={() => onMouvement(article)}>
                    Mouvement
                  </Button>
                  <Button size="sm" variant="secondary" onClick={() => onEdit(article)}>
                    Modifier
                  </Button>
                  <Button size="sm" variant="danger" onClick={() => onDelete(article.id)}>
                    Supprimer
                  </Button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

// frontend-web/src/components/stock/StockForm.jsx
import { useState, useEffect } from 'react';
import Input from '../common/Input';
import Select from '../common/Select';
import Button from '../common/Button';

const StockForm = ({ article, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    nom_article: '',
    categorie_id: '',
    description: '',
    quantite_actuelle: 0,
    quantite_minimale: 0,
    unite_mesure: '',
    prix_unitaire: '',
    fournisseur: '',
    derniere_commande: ''
  });

  useEffect(() => {
    if (article) {
      setFormData({
        nom_article: article.nom_article || '',
        categorie_id: article.categorie_id || '',
        description: article.description || '',
        quantite_actuelle: article.quantite_actuelle || 0,
        quantite_minimale: article.quantite_minimale || 0,
        unite_mesure: article.unite_mesure || '',
        prix_unitaire: article.prix_unitaire || '',
        fournisseur: article.fournisseur || '',
        derniere_commande: article.derniere_commande || ''
      });
    }
  }, [article]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="stock-form">
      <Input
        label="Nom de l'article *"
        name="nom_article"
        value={formData.nom_article}
        onChange={handleChange}
        required
      />

      <Select
        label="Catégorie"
        name="categorie_id"
        value={formData.categorie_id}
        onChange={handleChange}
      >
        <option value="">Sélectionner une catégorie</option>
        <option value="1">Alimentation</option>
        <option value="2">Boissons</option>
        <option value="3">Entretien</option>
        <option value="4">Linge</option>
        <option value="5">Autres</option>
      </Select>

      <Input
        label="Description"
        name="description"
        value={formData.description}
        onChange={handleChange}
        multiline
        rows={3}
      />

      <div className="form-row">
        <Input
          label="Quantité actuelle *"
          name="quantite_actuelle"
          type="number"
          value={formData.quantite_actuelle}
          onChange={handleChange}
          min="0"
          required
        />

        <Input
          label="Quantité minimale *"
          name="quantite_minimale"
          type="number"
          value={formData.quantite_minimale}
          onChange={handleChange}
          min="0"
          required
        />
      </div>

      <div className="form-row">
        <Input
          label="Unité de mesure"
          name="unite_mesure"
          value={formData.unite_mesure}
          onChange={handleChange}
          placeholder="kg, L, unité..."
        />

        <Input
          label="Prix unitaire (€)"
          name="prix_unitaire"
          type="number"
          step="0.01"
          value={formData.prix_unitaire}
          onChange={handleChange}
          min="0"
        />
      </div>

      <Input
        label="Fournisseur"
        name="fournisseur"
        value={formData.fournisseur}
        onChange={handleChange}
      />

      <Input
        label="Dernière commande"
        name="derniere_commande"
        type="date"
        value={formData.derniere_commande}
        onChange={handleChange}
      />

      <div className="form-actions">
        <Button type="button" variant="secondary" onClick={onCancel}>
          Annuler
        </Button>
        <Button type="submit">
          {article ? 'Modifier' : 'Créer'}
        </Button>
      </div>
    </form>
  );
};

// frontend-web/src/components/stock/MouvementForm.jsx
export default StockList;