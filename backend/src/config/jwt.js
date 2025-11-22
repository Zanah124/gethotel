require('dotenv').config();

module.exports = {
  secret: process.env.JWT_SECRET || 'votre_secret_jwt_super_securise',
  expiresIn: process.env.JWT_EXPIRE || '7d',
  refreshExpiresIn: process.env.JWT_REFRESH_EXPIRE || '30d',
  
  // Options pour la génération de token
  options: {
    issuer: 'hotel-management-api',
    audience: 'hotel-management-client'
  }
};