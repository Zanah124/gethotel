import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// Obtenir __dirname en ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Charger dotenv EN PREMIER
dotenv.config();

// Importer sequelize et routes APRÈS dotenv
import sequelize from './src/config/database.js';
import authRoutes from './src/routes/authRoutes.js';
import adminRoutes from './src/routes/admin/index.js';
import employeeRoutes from './src/routes/admin/employeeRoutes.js';
import superadminRoutes from './src/routes/superadmin/index.js';
import employeeStock from './src/routes/employee/stock/index.js';
import chambreRoute from './src/routes/admin/chambreRoute.js';
import typeChambreRoute from './src/routes/admin/typeChambreRoute.js';
import hotelRoutes from './src/routes/client/hotelRoutes.js';


const app = express();
const PORT = process.env.PORT || 3000;

console.log('🚀 ================================');
console.log('🚀 Démarrage du serveur...');
console.log('🚀 ================================');

// Middleware
app.use(cors({
  origin: 'http://localhost:3001', // Autorise uniquement ton frontend en dev
  credentials: true // si tu veux envoyer des cookies plus tard
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Servir les fichiers statiques (images uploadées)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Logging simple
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Routes
app.get('/', (req, res) => res.json({ message: 'API Hotel Management – OK', version: '1.0.0' }));
app.use('/api/auth', authRoutes);
console.log('✅ Routes /api/auth montées');

app.use('/api/admin', adminRoutes);
app.use('/api/admin/employees', employeeRoutes);
app.use('/api/superadmin', superadminRoutes);
app.use('/api/employee/stock', employeeStock);
app.use('/api/admin/chambres', chambreRoute);
app.use('/api/admin/types-chambre', typeChambreRoute);
app.use('/api/client/hotels', hotelRoutes);
console.log('✅ Routes /api/superadmin montées');

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

// Error handler
app.use((err, req, res, next) => {
  console.error('Erreur:', err.message);
  res.status(500).json({ success: false, message: 'Erreur serveur' });
});

// Démarrage
const startServer = async () => {
  try {
    // Test de connexion à la base de données
    await sequelize.authenticate();
    console.log('Connexion MySQL établie avec succès !');

    // PLUS DE SYNC ICI → on utilise les migrations désormais
    console.log('Prêt – Utilise npx sequelize-cli db:migrate si besoin');

    app.listen(PORT, () => {
      console.log('===================================');
      console.log('SERVEUR DÉMARRÉ !');
      console.log(`http://localhost:${PORT}`);
      console.log(`Mode: ${process.env.NODE_ENV || 'development'}`);
      console.log('===================================');
    });

  } catch (error) {
    console.error('Impossible de démarrer:', error);
    process.exit(1);
  }
};




startServer();