import dotenv from 'dotenv';
import { Sequelize } from 'sequelize';

dotenv.config();

// Configuration de la connexion MySQL
const sequelize = new Sequelize(
  process.env.DB_NAME || 'hotel_management',
  process.env.DB_USER || 'root',
  process.env.DB_PASSWORD || '',
  {
    host: process.env.DB_HOST || '127.0.0.1',
    port: process.env.DB_PORT || 3306,
    dialect: 'mysql',
    logging: process.env.NODE_ENV === 'development' ? console.log : false,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    },
    timezone: '+03:00',
    define: {
      timestamps: true,
      underscored: true,
      freezeTableName: true
    }
  }
);

// Test de connexion
const testConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Connexion MySQL établie avec succès !');
  } catch (error) {
    console.error('❌ Erreur de connexion MySQL:', error.message);
  }
};

testConnection();

export default sequelize;