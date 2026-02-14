const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

/**
 * Nettoie le chemin d'une image en enlevant les préfixes /uploads/ dupliqués
 */
export const cleanImagePath = (path) => {
  if (!path || typeof path !== 'string') {
    return null;
  }

  // Déjà une URL absolue → retourner telle quelle
  if (/^https?:\/\//i.test(path)) {
    return path;
  }

  let cleaned = path;

  // Si le chemin commence par /uploads/, on l'enlève car on va le rajouter
  if (cleaned.startsWith('/uploads/')) {
    cleaned = cleaned.substring('/uploads/'.length);
  }
  
  // Enlever aussi les variantes avec backslash (Windows)
  if (cleaned.startsWith('\\uploads\\')) {
    cleaned = cleaned.substring('\\uploads\\'.length);
  }

  // Enlever uploads/ au début (sans le slash initial)
  if (cleaned.startsWith('uploads/')) {
    cleaned = cleaned.substring('uploads/'.length);
  }

  // Enlever tous les slashs du début
  cleaned = cleaned.replace(/^[/\\]+/, '');

  return cleaned;
};

/**
 * Construit l'URL complète d'une image
 */
export const getHotelImageUrl = (path) => {
  // Si le chemin est déjà une URL complète, le retourner tel quel
  if (/^https?:\/\//i.test(path)) {
    return path;
  }

  // Si le chemin commence par /uploads, c'est qu'il est déjà prêt
  if (path && path.startsWith('/uploads/')) {
    return `${BASE_URL}${path}`;
  }

  // Sinon, nettoyer et construire l'URL
  const cleaned = cleanImagePath(path);
  
  if (!cleaned) {
    return 'https://via.placeholder.com/400x300?text=Hôtel';
  }

  return `${BASE_URL}/uploads/${cleaned}`;
};

/**
 * Récupère la première photo d'un hôtel (photo principale ou première du tableau)
 */
export const getFirstHotelPhoto = (photos, photoPrincipale) => {
  // Si photo principale existe
  if (photoPrincipale) {
    return getHotelImageUrl(photoPrincipale);
  }
  
  // Sinon, prendre la première photo du tableau
  if (photos && Array.isArray(photos) && photos.length > 0) {
    return getHotelImageUrl(photos[0]);
  }

  // Si photos est une chaîne JSON, la parser
  if (photos && typeof photos === 'string') {
    try {
      const parsed = JSON.parse(photos);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return getHotelImageUrl(parsed[0]);
      }
    } catch (err) {
      // Ignore parsing errors
      console.error(err);
    }
  }
  
  // Image par défaut
  return 'https://via.placeholder.com/400x300?text=Aucune+image';
};