import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import User from '../models/User.js';

dotenv.config();

export const auth = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Accès non autorisé, token manquant.' });
  }

  try {
    // 1. Décoder le token JWT
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // 2. ✅ CORRECTION : Récupérer l'utilisateur complet depuis la DB
    const user = await User.findByPk(decoded.id || decoded.userId, {
      attributes: ['id', 'nom', 'prenom', 'email', 'role', 'hotel_id', 'statut']
    });

    if (!user) {
      return res.status(401).json({ message: 'Utilisateur introuvable.' });
    }

    if (user.statut !== 'actif') {
      return res.status(403).json({ message: 'Compte désactivé.' });
    }

    // 3. ✅ Attacher l'utilisateur COMPLET à req.user (avec hotel_id)
    req.user = {
      id: user.id,
      nom: user.nom,
      prenom: user.prenom,
      email: user.email,
      role: user.role,
      hotel_id: user.hotel_id,  // ✅ Maintenant hotel_id est présent !
      statut: user.statut
    };

    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: 'Token invalide.' });
    }
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Token expiré.' });
    }
    console.error('Erreur auth middleware:', error);
    return res.status(500).json({ message: 'Erreur serveur lors de l\'authentification.' });
  }
};

export default auth;