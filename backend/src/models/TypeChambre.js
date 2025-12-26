import { DataTypes, Model } from 'sequelize';  
import sequelize from '../config/database.js';
import Hotel from './Hotel.js';

// Étends la classe Model de Sequelize
class TypeChambre extends Model {}

TypeChambre.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    hotel_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Hotel,
        key: 'id',
      },
      onDelete: 'CASCADE',
    },
    nom: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    prix_par_nuit: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    capacite: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: 'TypeChambre',
    tableName: 'type_chambres',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  }
);


export default TypeChambre;