import { DataTypes, Model } from 'sequelize';  
import sequelize from '../config/database.js';
import Hotel from './Hotel.js';
import TypeChambre from './TypeChambre.js';

// Étends Model pour avoir accès à .init(), .belongsTo(), etc.
class Chambre extends Model {}

Chambre.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    hotel_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: Hotel,
        key: 'id',
      },
      onDelete: 'CASCADE',
    },
    type_chambre_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: TypeChambre,
        key: 'id',
      },
      onDelete: 'SET NULL',
    },
    numero_chambre: {
      type: DataTypes.STRING(20),
      allowNull: false,
    },
    etage: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    statut: {
      type: DataTypes.ENUM('disponible', 'occupee', 'maintenance', 'nettoyage'),
      allowNull: false,
      defaultValue: 'disponible',
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    modelName: 'Chambre',
    tableName: 'chambres',
    timestamps: false,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  }
);



export default Chambre;