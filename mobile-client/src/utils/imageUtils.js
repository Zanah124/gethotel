import { API_BASE_URL } from '../config/api';

const BASE_URL = API_BASE_URL.replace(/\/api\/?$/, '');

export const getHotelImageUrl = (path) => {
  if (!path || typeof path !== 'string') return 'https://via.placeholder.com/400x300?text=Hôtel';
  if (/^https?:\/\//i.test(path)) return path;
  const cleaned = path.replace(/^[/\\]+/, '').replace(/^uploads\/?/, '');
  return `${BASE_URL}/uploads/${cleaned}`;
};
