import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database.js';
import User from './User.js';

class Hotel extends Model {}

Hotel.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    nom: {
      type: DataTypes.STRING(200),
      allowNull: false
    },
    adresse: { type: DataTypes.TEXT, allowNull: false },
    ville: { type: DataTypes.STRING(100), allowNull: false },
    pays: { type: DataTypes.STRING(100), defaultValue: 'Madagascar' },
    code_postal: { type: DataTypes.STRING(20) },
    telephone: { type: DataTypes.STRING(20) },
    email: { type: DataTypes.STRING(255), validate: { isEmail: true } },
    description: { type: DataTypes.TEXT },
    nombre_etoiles: { type: DataTypes.INTEGER, validate: { min: 1, max: 5 } },
    photo_principale: { type: DataTypes.STRING(255) },
    photos: {
      type: DataTypes.JSON,
      defaultValue: [] // tableau de string URLs
    },
    equipements: { type: DataTypes.JSON, defaultValue: [] },
    services: { type: DataTypes.JSON, defaultValue: [] },
    politique_annulation: { type: DataTypes.TEXT },
    admin_hotel_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: { model: 'users', key: 'id' },
      onDelete: 'SET NULL'
    },
    is_active: { type: DataTypes.BOOLEAN, defaultValue: true }
  },
  {
    sequelize,
    modelName: 'Hotel',
    tableName: 'hotels',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  }
);

// Les relations sont définies dans models/index.js pour éviter les conflits

export default Hotel;