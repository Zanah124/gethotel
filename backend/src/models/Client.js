
const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Client = sequelize.define('Client', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'id'
      },
      onDelete: 'CASCADE'
    },
    nom: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    prenom: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    telephone: {
      type: DataTypes.STRING(20),
      allowNull: false
    },
    adresse: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    ville: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    pays: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    codePostal: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    dateNaissance: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    nationalite: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    numeroPasseport: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    numeroCIN: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    preferences: {
      type: DataTypes.JSON,
      allowNull: true,
      defaultValue: {
        typeChambre: [],
        newsletter: true,
        notifications: true
      }
    },
    statut: {
      type: DataTypes.ENUM('actif', 'inactif', 'bloque'),
      defaultValue: 'actif'
    },
    nombreReservations: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    totalDepense: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 0.00
    },
    dateInscription: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    }
  }, {
    tableName: 'clients',
    timestamps: true,
    indexes: [
      { fields: ['userId'] },
      { fields: ['telephone'] },
      { fields: ['email'] },
      { fields: ['statut'] }
    ]
  });

  Client.associate = (models) => {
    Client.belongsTo(models.User, {
      foreignKey: 'userId',
      as: 'user'
    });

    Client.hasMany(models.Reservation, {
      foreignKey: 'clientId',
      as: 'reservations'
    });

    Client.hasMany(models.PaiementClient, {
      foreignKey: 'clientId',
      as: 'paiements'
    });

    Client.hasMany(models.FactureClient, {
      foreignKey: 'clientId',
      as: 'factures'
    });
  };

  return Client;
};