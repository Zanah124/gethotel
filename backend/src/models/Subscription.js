import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database.js';

class Subscription extends Model {}

Subscription.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    hotel_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'hotels',
        key: 'id'
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    },
    plan_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'subscription_plans',
        key: 'id'
      }
    },
    stripe_subscription_id: {
      type: DataTypes.STRING(255),
      unique: true,
      allowNull: true
    },
    status: {
      type: DataTypes.ENUM(
        'active',
        'canceled',
        'past_due',
        'trialing',
        'incomplete',
        'incomplete_expired'
      ),
      defaultValue: 'trialing'
    },
    current_period_start: {
      type: DataTypes.DATE,
      allowNull: true
    },
    current_period_end: {
      type: DataTypes.DATE,
      allowNull: true
    },
    trial_end: {
      type: DataTypes.DATE,
      allowNull: true
    },
    canceled_at: {
      type: DataTypes.DATE,
      allowNull: true
    }
  },
  {
    sequelize,
    modelName: 'Subscription',
    tableName: 'subscriptions',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  }
);

export default Subscription;