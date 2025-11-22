import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database.js';

class CategorieStock extends Model {}

CategorieStock.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    nom: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  },
  {
    sequelize,
    tableName: 'categories_stock',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: false // pas de updated_at dans ta table
  }
);

export default CategorieStock;