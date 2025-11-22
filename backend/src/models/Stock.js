import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database.js';

class Stock extends Model {}

Stock.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    hotel_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'hotels',
        key: 'id'
      },
      onDelete: 'CASCADE'
    },
    categorie_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'categories_stock',
        key: 'id'
      }
    },
    nom_article: {
      type: DataTypes.STRING(200),
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    quantite_actuelle: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      validate: { min: 0 }
    },
    quantite_minimale: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      validate: { min: 0 }
    },
    unite_mesure: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    prix_unitaire: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true
    },
    fournisseur: {
      type: DataTypes.STRING(200),
      allowNull: true
    },
    derniere_commande: {
      type: DataTypes.DATEONLY, // DATE en MySQL → DATEONLY en Sequelize
      allowNull: true
    }
  },
  {
    sequelize,
    tableName: 'stock',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  }
);

export default Stock;