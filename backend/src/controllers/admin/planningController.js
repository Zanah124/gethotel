import { Op } from 'sequelize';
import Employee from '../../models/Employee.js';
import User from '../../models/User.js';
import PlanningEmployee from '../../models/PlanningEmployee.js';

/**
 * Retourne le lundi (YYYY-MM-DD) de la semaine contenant date
 */
function getWeekStart(dateStr) {
  const d = new Date(dateStr);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  d.setDate(diff);
  return d.toISOString().slice(0, 10);
}

/**
 * GET /api/admin/planning?week_start=2025-02-17
 * Récupère les employés de l'hôtel et leur planning pour la semaine donnée.
 */
export const getPlanning = async (req, res) => {
  try {
    const weekStart = getWeekStart(req.query.week_start || new Date());
    let hotelId = req.user.hotel_id;

    if (req.user.role === 'superadmin' && req.query.hotel_id) {
      hotelId = parseInt(req.query.hotel_id, 10);
    }
    if (!hotelId && req.user.role === 'employee') {
      const emp = await Employee.findOne({ where: { user_id: req.user.id }, attributes: ['hotel_id'] });
      if (emp) hotelId = emp.hotel_id;
    }
    if (!hotelId) {
      return res.status(400).json({
        success: false,
        message: "Aucun hôtel associé."
      });
    }

    const employees = await Employee.findAll({
      where: { hotel_id: hotelId, statut: 'actif' },
      include: [
        { model: User, as: 'user', attributes: ['id', 'nom', 'prenom', 'email'] }
      ],
      attributes: ['id', 'poste', 'departement'],
      order: [[{ model: User, as: 'user' }, 'nom', 'ASC']]
    });

    const employeeIds = employees.map((e) => e.id);
    const plannings = employeeIds.length
      ? await PlanningEmployee.findAll({
          where: { week_start: weekStart, employee_id: { [Op.in]: employeeIds } },
          attributes: ['employee_id', 'slots']
        })
      : [];

    const planningByEmployee = {};
    plannings.forEach((p) => {
      let slots = p.slots;
      if (typeof slots === 'string') {
        try { slots = JSON.parse(slots); } catch { slots = {}; }
      }
      planningByEmployee[p.employee_id] = slots || {};
    });

    const defaultSlots = { 1: '', 2: '', 3: '', 4: '', 5: '', 6: '', 7: '' };
    const data = employees.map((emp) => ({
      id: emp.id,
      nom: emp.user?.nom || '',
      prenom: emp.user?.prenom || '',
      poste: emp.poste,
      departement: emp.departement,
      slots: { ...defaultSlots, ...(planningByEmployee[emp.id] || {}) }
    }));

    res.status(200).json({
      success: true,
      data: { week_start: weekStart, employees: data }
    });
  } catch (error) {
    console.error('Erreur getPlanning:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération du planning',
      error: error.message
    });
  }
};

/**
 * PUT /api/admin/planning
 * Body: { week_start: "2025-02-17", plannings: [ { employee_id, slots }, ... ] }
 * Enregistre ou met à jour le planning de la semaine.
 */
export const savePlanning = async (req, res) => {
  try {
    const { week_start: weekStartParam, plannings } = req.body;
    const week_start = getWeekStart(weekStartParam || new Date());

    let hotelId = req.user.hotel_id;
    if (req.user.role === 'superadmin' && req.body.hotel_id) {
      hotelId = parseInt(req.body.hotel_id, 10);
    }
    if (!hotelId) {
      return res.status(400).json({
        success: false,
        message: "Aucun hôtel associé."
      });
    }

    if (!Array.isArray(plannings)) {
      return res.status(400).json({
        success: false,
        message: 'Le champ plannings doit être un tableau.'
      });
    }

    const employeesForHotel = await Employee.findAll({
      where: { hotel_id: hotelId },
      attributes: ['id']
    });
    const allowedEmployeeIds = new Set(employeesForHotel.map((e) => e.id));

    for (const item of plannings) {
      const { employee_id, slots } = item;
      if (!employee_id || !allowedEmployeeIds.has(employee_id)) continue;

      const normalized = {};
      for (let d = 1; d <= 7; d++) {
        const key = String(d);
        const val = slots && (slots[key] ?? slots[d]);
        normalized[key] = val === 'repos' || val === '' || val == null ? 'repos' : String(val).trim();
      }

      const [planning] = await PlanningEmployee.findOrCreate({
        where: { employee_id, week_start },
        defaults: {
          slots: normalized,
          date_travail: week_start,
          heure_debut: '00:00:00',
          heure_fin: '00:00:00'
        }
      });
      if (planning) {
        await planning.update({ slots: normalized });
      }
    }

    res.status(200).json({
      success: true,
      message: 'Planning enregistré.',
      data: { week_start }
    });
  } catch (error) {
    console.error('Erreur savePlanning:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de l\'enregistrement du planning',
      error: error.message
    });
  }
};
