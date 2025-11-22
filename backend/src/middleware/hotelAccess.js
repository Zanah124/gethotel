export const hotelAccess = async (req, res, next) => {
    try {
      const user = req.user;
  
      // SuperAdmin a accès à tous les hôtels
      if (user.role === 'superadmin') {
        // Si un hotel_id est spécifié dans la requête, on l'utilise
        if (req.params.hotel_id) {
          req.hotelId = parseInt(req.params.hotel_id);
        } else if (req.body.hotel_id) {
          req.hotelId = parseInt(req.body.hotel_id);
        } else if (req.query.hotel_id) {
          req.hotelId = parseInt(req.query.hotel_id);
        }
        return next();
      }
  
      // Admin et Employee doivent avoir un hotel_id
      if (!user.hotel_id) {
        return res.status(403).json({
          success: false,
          message: 'Aucun hôtel associé à votre compte'
        });
      }
  
      // On force l'hotel_id de l'utilisateur
      req.hotelId = user.hotel_id;
  
      next();
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: 'Erreur lors de la vérification d\'accès à l\'hôtel',
        error: error.message
      });
    }
  };
  
  /**
   * Middleware optionnel pour extraire l'hotel_id sans le forcer
   */
  export const extractHotelId = (req, res, next) => {
    const user = req.user;
  
    if (user.role === 'superadmin') {
      // SuperAdmin peut spécifier l'hotel_id
      req.hotelId = req.params.hotel_id || req.body.hotel_id || req.query.hotel_id || null;
    } else {
      // Autres rôles utilisent leur hotel_id
      req.hotelId = user.hotel_id || null;
    }
  
    next();
  };
  
  export default hotelAccess;