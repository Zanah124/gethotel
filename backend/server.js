import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

// Charger dotenv EN PREMIER
dotenv.config();

// Importer sequelize et routes APRÈS dotenv
import sequelize from './src/config/database.js';
import authRoutes from './src/routes/authRoutes.js';
import adminRoutes from './src/routes/admin/index.js';
import employeeRoutes from './src/routes/admin/employeeRoutes.js';
import superadminRoutes from './src/routes/superadmin/index.js';
// Ajoute tes autres routes ici plus tard

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
console.log('✅ Routes /api/superadmin montées');

// À coller dans ton fichier server.js (après tes routes, avant le app.listen)

app.get('/fix-passwords-now', async (req, res) => {
  // Protection avec une clé secrète (change-la tout de suite !)
  if (req.query.key !== 'TonSuperSecretKey123!') {
    return res.status(403).json({ message: 'Accès interdit' });
  }

  try {
    let corrected = 0;
    const users = await User.findAll();

    for (const user of users) {
      // Si le mot de passe fait moins de 60 caractères → c’est du texte clair
      if (user.password && user.password.length < 60) {
        const hashed = await bcrypt.hash(user.password, 10);
        await User.update(
          { password: hashed },
          { 
            where: { id: user.id },
            individualHooks: true   // très important pour déclencher le hook beforeUpdate
          }
        );
        corrected++;
        console.log(`Corrigé : ${user.email}`);
      }
    }

    res.json({ 
      success: true, 
      message: `Terminé ! ${corrected} mot(s) de passe corrigé(s).` 
    });

  } catch (error) {
    console.error('Erreur lors de la correction :', error);
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
});


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