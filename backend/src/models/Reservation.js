import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database.js';
import User from './User.js';
import Chambre from './Chambre.js';
import Hotel from './Hotel.js';

// Étends Model pour avoir accès à .init(), .belongsTo(), etc.
class Reservation extends Model {}

Reservation.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    numero_reservation: {
      type: DataTypes.STRING(50),
      allowNull: true,
      unique: true, // Bon pratique pour éviter les doublons
    },
    client_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: User,
        key: 'id',
      },
      onDelete: 'SET NULL',
    },
    chambre_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: Chambre,
        key: 'id',
      },
      onDelete: 'SET NULL',
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
    date_arrivee: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    date_depart: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    nombre_adultes: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: { min: 1 },
    },
    nombre_enfants: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0,
      validate: { min: 0 },
    },
    prix_total: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      validate: { min: 0 },
    },
    statut: {
      type: DataTypes.ENUM('en_attente', 'confirmee', 'annulee', 'terminee', 'check_in', 'check_out'),
      allowNull: false,
      defaultValue: 'en_attente',
    },
    demandes_speciales: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    created_by: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: User,
        key: 'id',
      },
      onDelete: 'SET NULL',
    },
    verified_by: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: User,
        key: 'id',
      },
      onDelete: 'SET NULL',
    },
    is_verified: {
      type: DataTypes.TINYINT(1),
      allowNull: false,
      defaultValue: 0,
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
    modelName: 'Reservation',
    tableName: 'reservations',
    timestamps: false, // On gère manuellement created_at et updated_at
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  }
);

// Associations (identiques aux autres modèles)
Reservation.belongsTo(User, { foreignKey: 'client_id', as: 'client' });
Reservation.belongsTo(User, { foreignKey: 'created_by', as: 'createur' });
Reservation.belongsTo(User, { foreignKey: 'verified_by', as: 'verificateur' });
Reservation.belongsTo(Chambre, { foreignKey: 'chambre_id', as: 'chambre' });
Reservation.belongsTo(Hotel, { foreignKey: 'hotel_id', as: 'hotel' });

// Associations inverses (facultatives, mais utiles)
User.hasMany(Reservation, { foreignKey: 'client_id', as: 'reservationsClient' });
User.hasMany(Reservation, { foreignKey: 'created_by', as: 'reservationsCreees' });
User.hasMany(Reservation, { foreignKey: 'verified_by', as: 'reservationsVerifiees' });
Chambre.hasMany(Reservation, { foreignKey: 'chambre_id', as: 'reservations' });
Hotel.hasMany(Reservation, { foreignKey: 'hotel_id', as: 'reservations' });

export default Reservation;