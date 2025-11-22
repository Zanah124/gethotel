import db from '../models/index.js';
import { generateToken } from '../utils/generateToken.js';

const { User } = db;

// Log pour vérifier que le contrôleur est chargé
console.log('✅ authController.js chargé');

export const register = async (req, res) => {
  try {
    const { nom, prenom, email, password, telephone, role } = req.body;

    // Validation des champs requis
    if (!nom || !prenom || !email || !password) {
      return res.status(400).json({ 
        success: false,
        message: 'Les champs nom, prénom, email et mot de passe sont requis.' 
      });
    }

    // Vérifier si l'email existe déjà
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ 
        success: false,
        message: 'Cet email est déjà utilisé.' 
      });
    }

    // Créer l'utilisateur
    const user = await User.create({ 
      nom, 
      prenom, 
      email, 
      password, 
      telephone,
      role: role || 'client'
    });

    // Générer le token
    const token = generateToken(user);

    res.status(201).json({ 
      success: true,
      message: 'Inscription réussie',
      user, 
      token 
    });
  } catch (error) {
    console.error('Erreur lors de l\'inscription:', error);
    res.status(500).json({ 
      success: false,
      message: 'Erreur serveur lors de l\'inscription.',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({ 
        success: false,
        message: 'Email et mot de passe requis.' 
      });
    }

    // Trouver l'utilisateur
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(400).json({ 
        success: false,
        message: 'Email ou mot de passe incorrect.' 
      });
    }

// Vérifier si users est actif 
    if (!user.statut || user.statut !== 'actif') {
      return res.status(403).json({ 
        success: false,
        message: 'Votre compte est désactivé ou suspendu. Contactez l’administrateur.' 
      });
    }

    // Valider le mot de passe
    const isValid = await user.validatePassword(password);
    if (!isValid) {
      return res.status(400).json({ 
        success: false,
        message: 'Email ou mot de passe incorrect.' 
      });
    }

    // Générer le token
    const token = generateToken(user);

    res.json({ 
      success: true,
      message: 'Connexion réussie',
      user, 
      token 
    });
  } catch (error) {
    console.error('Erreur lors de la connexion:', error);
    res.status(500).json({ 
      success: false,
      message: 'Erreur serveur lors de la connexion.',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

export const getMe = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id);
    if (!user) {
      return res.status(404).json({ 
        success: false,
        message: 'Utilisateur non trouvé.' 
      });
    }
    res.json({ 
      success: true,
      user 
    });
  } catch (error) {
    console.error('Erreur lors de la récupération du profil:', error);
    res.status(500).json({ 
      success: false,
      message: 'Erreur serveur.' 
    });
  }
};