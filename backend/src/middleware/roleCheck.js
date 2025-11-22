// middleware/roleCheck.js
const roleCheck = (allowedRoles) => {
  return (req, res, next) => {
    const user = req.user; // mis par le middleware auth

    if (!user || !user.role) {
      return res.status(401).json({ message: 'Utilisateur non authentifié' });
    }

    // Normalisation pour éviter les bugs de casse / tableau
    let userRole = user.role;

    if (typeof userRole === 'string') {
      userRole = userRole.toLowerCase().trim();
    } else if (Array.isArray(userRole)) {
      userRole = userRole.map(r => r.toLowerCase().trim());
    }

    const normalizedAllowed = allowedRoles.map(r => r.toLowerCase().trim());

    const hasAccess = Array.isArray(userRole)
      ? userRole.some(r => normalizedAllowed.includes(r))
      : normalizedAllowed.includes(userRole);

    if (!hasAccess) {
      return res.status(403).json({ 
        message: 'Accès refusé : rôle insuffisant.',
        required: allowedRoles,
        current: user.role 
      });
    }

    next();
  };
};

export { roleCheck };