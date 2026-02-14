import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

/**
 * Planning hebdomadaire d'un employé.
 * Adapté à la table existante (employee_id, week_start, slots + colonnes obligatoires).
 */
const PlanningEmployee = sequelize.define('PlanningEmployee', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  employee_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: { model: 'employees', key: 'id' },
    onDelete: 'CASCADE'
  },
  week_start: {
    type: DataTypes.DATEONLY,
    allowNull: true
  },
  slots: {
    type: DataTypes.JSON,
    allowNull: true
  },
  date_travail: {
    type: DataTypes.DATEONLY,
    allowNull: true
  },
  heure_debut: {
    type: DataTypes.TIME,
    allowNull: true
  },
  heure_fin: {
    type: DataTypes.TIME,
    allowNull: true
  },
  poste_assigne: { type: DataTypes.STRING(100), allowNull: true },
  is_present: { type: DataTypes.BOOLEAN, allowNull: true, defaultValue: false },
  notes: { type: DataTypes.TEXT, allowNull: true }
}, {
  tableName: 'planning_employees',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: false
});

export default PlanningEmployee;
