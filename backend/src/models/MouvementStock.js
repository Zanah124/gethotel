import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database.js';

class MouvementStock extends Model {}

MouvementStock.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    stock_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'stock',
        key: 'id'
      },
      onDelete: 'CASCADE'
    },
    type_mouvement: {
      type: DataTypes.ENUM('entree', 'sortie', 'ajustement'),
      allowNull: false
    },
    quantite: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: { min: 1 }
    },
    motif: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    effectue_par: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'users', // ou 'employees' si tu as une table séparée
        key: 'id'
      }
    },
    date_mouvement: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    }
  },
  {
    sequelize,
    tableName: 'mouvements_stock',
    timestamps: false // tout est géré par date_mouvement + DEFAULT CURRENT_TIMESTAMP
  }
);

export default MouvementStock;