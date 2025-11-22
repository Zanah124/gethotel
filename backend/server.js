import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

// Charger dotenv EN PREMIER
dotenv.config();

// Importer sequelize et routes APRÈS dotenv
import sequelize from './src/config/database.js';
import authRoutes from './src/routes/authRoutes.js';
import adminRoutes from './src/routes/admin/index.js';
import employeeRoutes from './src/routes/employee/stock/index.js';

const app = express();
const PORT = process.env.PORT || 3000;

console.log('🚀 ================================');
console.log('🚀 Démarrage du serveur...');
console.log('🚀 ================================');

// Middleware
app.use(cors({
  origin: 'http://localhost:9000', // Autorise uniquement ton frontend en dev
  credentials: true // si tu veux envoyer des cookies plus tard
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Middleware de logging
app.use((req, res, next) => {
  console.log(`📥 ${new Date().toISOString()} - ${req.method} ${req.path}`);
  if (req.body && Object.keys(req.body).length > 0) {
    console.log('   Body:', JSON.stringify(req.body, null, 2));
  }
  next();
});

// Routes de base
app.get('/', (req, res) => {
  res.json({ 
    success: true, 
    message: '🏨 API Hotel Management',
    version: '1.0.0'
  });
});

app.get('/api/health', (req, res) => {
  res.json({ 
    success: true, 
    message: '✅ API fonctionne correctement',
    timestamp: new Date().toISOString()
  });
});

app.get('/api/test', (req, res) => {
  res.json({ success: true, message: 'Route de test OK' });
});

// ROUTES D'AUTHENTIFICATION
app.use('/api/auth', authRoutes);
console.log('✅ Routes /api/auth montées');

app.use('/api/admin', adminRoutes);
app.use('/api/employee', employeeRoutes);

// Middleware 404 - APRÈS toutes les routes
app.use((req, res) => {
  console.log(`❌ 404 - Route non trouvée: ${req.method} ${req.path}`);
  res.status(404).json({
    success: false,
    message: '❌ Route non trouvée',
    path: req.path,
    method: req.method,
    availableRoutes: {
      auth: [
        'POST /api/auth/register',
        'POST /api/auth/login',
        'GET /api/auth/me'
      ],
      system: [
        'GET /',
        'GET /api/health',
        'GET /api/test'
      ]
    }
  });
});

// Middleware de gestion des erreurs
app.use((err, req, res, next) => {
  console.error('❌ Erreur serveur:', err);
  res.status(500).json({
    success: false,
    message: 'Erreur serveur',
    error: process.env.NODE_ENV === 'development' ? {
      message: err.message,
      stack: err.stack
    } : undefined
  });
});


// Synchronisation et démarrage du serveur
const startServer = async () => {
  try {
    // Test de connexion à la base de données
    await sequelize.authenticate();
    console.log('✅ MySQL connecté avec succès');

    // Synchroniser les modèles
    if (process.env.NODE_ENV === 'development') {
      await sequelize.sync();
      console.log('✅ Modèles synchronisés');
    }

    // Démarrage du serveur
    const server = app.listen(PORT, () => {
      console.log('');
      console.log('🎉 ================================');
      console.log('🎉 Serveur démarré avec succès !');
      console.log('🎉 ================================');
      console.log(`📍 URL: http://localhost:${PORT}`);
      console.log(`📍 Health: http://localhost:${PORT}/api/health`);
      console.log('');
      console.log('📝 Routes disponibles:');
      console.log('   POST http://localhost:' + PORT + '/api/auth/register');
      console.log('   POST http://localhost:' + PORT + '/api/auth/login');
      console.log('   GET  http://localhost:' + PORT + '/api/auth/me');
      console.log('');
      console.log(`🔧 Mode: ${process.env.NODE_ENV || 'development'}`);
      console.log(`💾 Base de données: ${process.env.DB_NAME || 'hotel_management'}`);
      console.log('🎉 ================================');
      console.log('✨ Prêt à recevoir des requêtes !');
      console.log('');
    });

  } catch (error) {
    console.error('❌ Erreur de démarrage:', error);
    console.error('Stack:', error.stack);
    process.exit(1);
  }
};

startServer();