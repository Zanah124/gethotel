// middleware/roleCheck.js

/**
 * Middleware de contrôle d'accès basé sur les rôles
 * @param {string[]} allowedRoles - Liste des rôles autorisés
 * @returns {Function} Middleware Express
 */
const roleCheck = (allowedRoles) => {
  return (req, res, next) => {
    const user = req.user; // Injecté par le middleware auth

    // Vérification de l'authentification
    if (!user || !user.role) {
      return res.status(401).json({ 
        success: false,
        message: 'Utilisateur non authentifié' 
      });
    }

    // Normalisation du rôle utilisateur (string ou array)
    let userRole = user.role;
    
    if (typeof userRole === 'string') {
      userRole = userRole.toLowerCase().trim();
    } else if (Array.isArray(userRole)) {
      userRole = userRole.map(r => r.toLowerCase().trim());
    } else {
      // Cas improbable mais sécurisé
      return res.status(403).json({ 
        success: false,
        message: 'Format de rôle invalide' 
      });
    }

    // ✅ SUPERADMIN bypass : accès total à toutes les routes
    const isSuperAdmin = userRole === 'superadmin' || 
                         (Array.isArray(userRole) && userRole.includes('superadmin'));
    
    if (isSuperAdmin) {
      return next();
    }

    // Normalisation des rôles autorisés
    const normalizedAllowed = allowedRoles.map(r => r.toLowerCase().trim());

    // Vérification d'accès pour les autres rôles
    const hasAccess = Array.isArray(userRole)
      ? userRole.some(r => normalizedAllowed.includes(r))
      : normalizedAllowed.includes(userRole);

    if (!hasAccess) {
      return res.status(403).json({ 
        success: false,
        message: 'Accès refusé : rôle insuffisant',
        required: allowedRoles,
        current: user.role 
      });
    }

    next();
  };
};

export { roleCheck };