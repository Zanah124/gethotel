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
  
  salaire_mensuel: {                    
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true,
    field: 'salaire_mensuel'            
  },

  contrat_type: { 
    type: DataTypes.ENUM('CDI', 'CDD', 'Stage', 'Intérim'),
    defaultValue: 'CDI'
  },

  departement: {
    type: DataTypes.STRING(100),
    allowNull: false,           // ou true si tu veux autoriser NULL
    defaultValue: 'Non défini', // optionnel : valeur par défaut
    comment: 'Réception, Housekeeping, Restauration, Technique, etc.'
  },
  date_embauche: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  },
  
  statut: {
    type: DataTypes.ENUM('actif', 'inactif', 'en_congé'),
    defaultValue: 'actif'
  }
}, {
  tableName: 'employees',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

export default Employee;