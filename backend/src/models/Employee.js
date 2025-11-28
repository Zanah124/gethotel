import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Employee = sequelize.define('Employee', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    unique: true,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  hotel_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'hotels',
      key: 'id'
    }
  },
  poste: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  departement: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  salaire: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true
  },
  date_embauche: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  },
  contrat_type: {
    type: DataTypes.ENUM('CDI', 'CDD', 'stage', 'interim'),
    allowNull: false,
    defaultValue: 'CDI'
  },
  statut: {
    type: DataTypes.ENUM('actif', 'conge', 'inactif'),
    defaultValue: 'actif'
  }
}, {
  tableName: 'employees',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

export default Employee;