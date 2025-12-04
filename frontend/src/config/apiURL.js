const API_BASE_URL = import.meta.env.DEV 
  ? 'http://localhost:3000/api' 
  : '/api'; // en production, même domaine → pas de CORS

export default API_BASE_URL;