import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database.js';

class SubscriptionPlan extends Model {}

SubscriptionPlan.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true,
      comment: 'Basic, Premium, Enterprise'
    },
    price_monthly: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    },
    price_yearly: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    },
    max_rooms: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 10
    },
    max_employees: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 5
    },
    max_storage_gb: {
      type: DataTypes.INTEGER,
      defaultValue: 5
    },
    features: {
      type: DataTypes.JSON,
      defaultValue: [],
      comment: 'ex: ["réservation en ligne", "paiement stripe", "statistiques avancées"]'
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    }
  },
  {
    sequelize,
    modelName: 'SubscriptionPlan',
    tableName: 'subscription_plans',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  }
);

export default SubscriptionPlan;