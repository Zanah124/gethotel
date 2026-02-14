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
 * Récupère le planning de la semaine (employés + créneaux)
 */
export async function getPlanning(weekStart) {
  const res = await api.get('/admin/planning', {
    params: { week_start: weekStart || getWeekStart() }
  });
  return res.data;
}

/**
 * Enregistre le planning de la semaine
 * plannings: [ { employee_id, slots: { "1": "08:00-16:00", "2": "repos", ... } }, ... ]
 */
export async function savePlanning(weekStart, plannings) {
  const res = await api.put('/admin/planning', {
    week_start: weekStart,
    plannings
  });
  return res.data;
}
