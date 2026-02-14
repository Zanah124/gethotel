import api from '../api';

/**
 * Retourne le lundi (YYYY-MM-DD) de la semaine contenant la date
 */
export function getWeekStart(date = new Date()) {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  d.setDate(diff);
  return d.toISOString().slice(0, 10);
}

/**
 * Récupère le planning de la semaine (lecture seule pour l'employé)
 */
export async function getPlanning(weekStart) {
  const res = await api.get('/employee/planning', {
    params: { week_start: weekStart || getWeekStart() }
  });
  return res.data;
}
