import { useState } from 'react';
import Input from '../common/Input';
import Select from '../common/Select';
import Button from '../common/Button';


const StockAlerts = ({ alerts, onReorder }) => {
    if (!alerts || alerts.length === 0) return null;
  
    return (
      <div className="stock-alerts">
        <h3>⚠️ Alertes Stock Faible ({alerts.length})</h3>
        <div className="alerts-list">
          {alerts.map(article => (
            <div key={article.id} className="alert-item">
              <div className="alert-info">
                <strong>{article.nom_article}</strong>
                <span className="quantities">
                  Stock: {article.quantite_actuelle} {article.unite_mesure} 
                  / Min: {article.quantite_minimale} {article.unite_mesure}
                </span>
              </div>
              <Button size="sm" onClick={() => onReorder(article)}>
                Réapprovisionner
              </Button>
            </div>
          ))}
        </div>
      </div>
    );
  };

  export default StockAlerts;