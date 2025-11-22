import express from 'express';

const router = express.Router();

console.log('🧪 testRoutes.js chargé');

// Route de test simple
router.post('/test', (req, res) => {
  console.log('✅ Route /api/auth/test appelée');
  res.json({
    success: true,
    message: 'Route de test fonctionne !',
    body: req.body
  });
});

router.get('/test', (req, res) => {
  res.json({
    success: true,
    message: 'GET test fonctionne !'
  });
});

export default router;