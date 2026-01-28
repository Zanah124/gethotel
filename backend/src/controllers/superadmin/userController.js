import User from '../../models/User.js';
import Hotel from '../../models/Hotel.js';
import { Op } from 'sequelize';

/**
 * Liste tous les utilisateurs (admin, employee, client) – SUPERADMIN uniquement
 */
export const getAllUsers = async (req, res) => {
  try {
    const { page = 1, limit = 15, search = '', role = '' } = req.query;
    const lim = Math.min(parseInt(limit) || 15, 100);
    const pg = Math.max(1, parseInt(page) || 1);
    const offset = (pg - 1) * lim;

    const where = { role: { [Op.ne]: 'superadmin' } };

    if (role && ['admin', 'employee', 'client'].includes(role)) {
      where.role = role;
    }

    if (search && search.trim()) {
      const term = `%${search.trim()}%`;
      where[Op.or] = [
        { nom: { [Op.like]: term } },
        { prenom: { [Op.like]: term } },
        { email: { [Op.like]: term } },
        { telephone: { [Op.like]: term } },
      ];
    }

    const { count, rows: users } = await User.findAndCountAll({
      where,
      attributes: [
        'id',
        'nom',
        'prenom',
        'email',
        'telephone',
        'role',
        'statut',
        'hotel_id',
        'created_at',
        'derniere_connexion',
      ],
      include: [
        {
          model: Hotel,
          as: 'hotel',
          attributes: ['id', 'nom', 'ville'],
          required: false,
        },
      ],
      order: [['created_at', 'DESC']],
      limit: lim,
      offset,
    });

    res.status(200).json({
      success: true,
      data: users,
      pagination: {
        total: count,
        page: pg,
        limit: lim,
        totalPages: Math.ceil(count / lim),
      },
    });
  } catch (err) {
    console.error('Erreur getAllUsers superadmin:', err);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur',
      error: err.message,
    });
  }
};
