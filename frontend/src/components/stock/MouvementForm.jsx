import { useState } from 'react';
import Input from '../common/Input';
import Select from '../common/Select';
import Button from '../common/Button';

const MouvementForm = ({ article, onSave, onCancel, isEmployee = false }) => {
  const [formData, setFormData] = useState({
    stock_id: article?.id || '',
    type_mouvement: 'entree',
    quantite: '',
    motif: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      ...formData,
      quantite: parseInt(formData.quantite)
    });
  };

  return (
    <form onSubmit={handleSubmit} className="mouvement-form">
      {article && (
        <div className="article-info">
          <h4>{article.nom_article}</h4>
          <p>Stock actuel: <strong>{article.quantite_actuelle} {article.unite_mesure}</strong></p>
          <p>Stock minimal: {article.quantite_minimale} {article.unite_mesure}</p>
        </div>
      )}

      <Select
        label="Type de mouvement *"
        name="type_mouvement"
        value={formData.type_mouvement}
        onChange={handleChange}
        required
      >
        <option value="entree">Entrée (ajout de stock)</option>
        <option value="sortie">Sortie (retrait de stock)</option>
        {!isEmployee && <option value="ajustement">Ajustement</option>}
      </Select>

      <Input
        label="Quantité *"
        name="quantite"
        type="number"
        value={formData.quantite}
        onChange={handleChange}
        min="1"
        required
      />

      <Input
        label="Motif"
        name="motif"
        value={formData.motif}
        onChange={handleChange}
        multiline
        rows={3}
        placeholder="Raison du mouvement (livraison, utilisation, inventaire...)"
      />

      <div className="form-actions">
        <Button type="button" variant="secondary" onClick={onCancel}>
          Annuler
        </Button>
        <Button type="submit">
          Enregistrer
        </Button>
      </div>
    </form>
  );
};

// frontend-web/src/components/stock/StockAlerts.jsx



export default MouvementForm;