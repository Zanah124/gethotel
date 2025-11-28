// middleware/roleCheck.js
const roleCheck = (allowedRoles) => {
  return (req, res, next) => {
    const user = req.user; // mis par le middleware auth

    if (!user || !user.role) {
      return res.status(401).json({ 
        success: false,
        message: 'Utilisateur non authentifié' 
      });
    }

    // Normalisation du rôle utilisateur
    let userRole = user.role;

    if (typeof userRole === 'string') {
      userRole = userRole.toLowerCase().trim();
    } else if (Array.isArray(userRole)) {
      userRole = userRole.map(r => r.toLowerCase().trim());
    }

    // ✅ SUPERADMIN a accès à TOUT
    if (userRole === 'superadmin' || (Array.isArray(userRole) && userRole.includes('superadmin'))) {
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
        message: 'Accès refusé : rôle insuffisant.',
        required: allowedRoles,
        current: user.role 
      });
    }

    next();
  };
};

export { roleCheck };