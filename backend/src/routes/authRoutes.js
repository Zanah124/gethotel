import express from 'express';
import { register, login, getMe } from '../controllers/authController.js';
import { auth } from '../middleware/auth.js';

const router = express.Router();

console.log('✅ authRoutes.js chargé');

// Routes d'authentification
router.post('/register', (req, res, next) => {
  console.log('📝 Route /register appelée');
  register(req, res, next);
});

router.post('/login', (req, res, next) => {
  console.log('🔐 Route /login appelée');
  login(req, res, next);
});

router.get('/me', auth, (req, res, next) => {
  console.log('👤 Route /me appelée');
  getMe(req, res, next);
});

// Log de toutes les routes enregistrées
console.log('📍 Routes enregistrées:');
router.stack.forEach((r) => {
  if (r.route) {
    const methods = Object.keys(r.route.methods).join(', ').toUpperCase();
    console.log(`   ${methods} /api/auth${r.route.path}`);
  }
});

export default router;