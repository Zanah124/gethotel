import Employee from '../../models/Employee.js';
import User from '../../models/User.js';
import Hotel from '../../models/Hotel.js';
import { Op } from 'sequelize';

/**
 * Récupérer tous les employés d'un hôtel (Admin & SuperAdmin)
 */
export const getEmployees = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = '', departement = '', statut = '' } = req.query;
    const offset = (page - 1) * limit;

    let whereHotel = {};

    if (req.user.role === 'superadmin') {
      whereHotel = {};
    } else if (req.user.role === 'admin') {
      if (!req.user.hotel_id) {
        return res.status(400).json({
          success: false,
          message: "Votre compte admin n'est associé à aucun hôtel. Contactez le superadmin."
        });
      }
      whereHotel = { hotel_id: req.user.hotel_id };
    } else {
      return res.status(403).json({ success: false, message: 'Accès refusé' });
    }

    const searchConditions = search
      ? {
          [Op.or]: [
            { '$user.nom$': { [Op.like]: `%${search}%` } },
            { '$user.prenom$': { [Op.like]: `%${search}%` } },
            { '$user.email$': { [Op.like]: `%${search}%` } },
            { poste: { [Op.like]: `%${search}%` } },
            { departement: { [Op.like]: `%${search}%` } }
          ]
        }
      : {};

    const extraFilters = {};
    if (departement) extraFilters.departement = departement;
    if (statut) extraFilters.statut = statut;

    const { count, rows: employees } = await Employee.findAndCountAll({
      where: {
        ...whereHotel,
        ...searchConditions,
        ...extraFilters
      },
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'nom', 'prenom', 'email', 'telephone', 'photo_profil']
        }
      ],
      attributes: ['id', 'poste', 'departement', 'salaire_mensuel', 'date_embauche', 'statut', 'created_at'],
      order: [['created_at', 'DESC']],
      limit: parseInt(limit, 10),
      offset: parseInt(offset, 10)
    });

    res.status(200).json({
      success: true,
      data: employees,
      pagination: {
        total: count,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(count / limit)
      }
    });

  } catch (error) {
    console.error('Erreur getEmployees:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des employés',
      error: error.message
    });
  }
};

/**
 * Récupérer un employé par ID (Admin, SuperAdmin, Employé lui-même)
 */
export const getEmployeeById = async (req, res) => {
  try {
    const { id } = req.params;

    const employee = await Employee.findByPk(id, {
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'nom', 'prenom', 'email', 'telephone', 'photo_profil']
        }
      ]
    });

    if (!employee) {
      return res.status(404).json({ success: false, message: 'Employé non trouvé' });
    }

    const isOwner = req.user.id === employee.user_id;
    const isAdminSameHotel = req.user.role === 'admin' && employee.hotel_id === req.user.hotel_id;
    const isSuperAdmin = req.user.role === 'superadmin';

    if (!isSuperAdmin && !isAdminSameHotel && !isOwner) {
      return res.status(403).json({ success: false, message: 'Accès refusé' });
    }

    res.status(200).json({ success: true, data: employee });
  } catch (error) {
    console.error('Erreur getEmployeeById:', error);
    res.status(500).json({ success: false, message: 'Erreur serveur' });
  }
};

/**
 * Créer un nouvel employé (Admin & SuperAdmin)
 */
export const createEmployee = async (req, res) => {
  try {
    const {
      nom,
      prenom,
      email,
      telephone,
      password,
      poste,
      departement,
      salaire,
      date_embauche,
      contrat_type = 'CDI',
      hotel_id: hotelIdFromBody
    } = req.body;

    // Validation des champs obligatoires
    if (!nom || !prenom || !email || !password || !poste) {
      return res.status(400).json({
        success: false,
        message: 'Les champs nom, prénom, email, mot de passe et poste sont obligatoires.'
      });
    }

    // === Détermination du hotel_id ===
    let hotelId;

    if (req.user.role === 'superadmin') {
      if (!hotelIdFromBody) {
        return res.status(400).json({
          success: false,
          message: 'Superadmin : vous devez préciser hotel_id dans le body'
        });
      }
      hotelId = hotelIdFromBody;
    } else if (req.user.role === 'admin') {
      if (!req.user.hotel_id) {
        return res.status(400).json({
          success: false,
          message: "Votre compte admin n'est pas associé à un hôtel. Contactez le superadmin."
        });
      }
      hotelId = req.user.hotel_id;

      if (hotelIdFromBody && hotelIdFromBody !== hotelId) {
        return res.status(403).json({
          success: false,
          message: 'Vous ne pouvez créer un employé que dans votre hôtel'
        });
      }
    } else {
      return res.status(403).json({ success: false, message: 'Accès refusé' });
    }

    // Vérifier que l'hôtel existe
    const hotelExists = await Hotel.findByPk(hotelId);
    if (!hotelExists) {
      return res.status(400).json({
        success: false,
        message: `Hôtel avec l'ID ${hotelId} introuvable`
      });
    }

    // Vérifier l'unicité de l'email
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'Cet email est déjà utilisé' });
    }

    // Création de l'utilisateur → mot de passe hashé automatiquement par le hook beforeCreate
    const user = await User.create({
      nom,
      prenom,
      email,
      telephone,
      password, // ← En clair, sera hashé par le modèle
      role: 'employee',
      hotel_id: hotelId,
      statut: 'actif'
    });

    // Création de l'employé
    const employee = await Employee.create({
      user_id: user.id,
      hotel_id: hotelId,
      poste,
      departement: departement || 'Non défini',
      salaire_mensuel: salaire || null,
      contrat_type,
      date_embauche: date_embauche || new Date(),
      statut: 'actif'
    });

    const result = {
      ...employee.toJSON(),
      user: {
        id: user.id,
        nom: user.nom,
        prenom: user.prenom,
        email: user.email,
        telephone: user.telephone,
        role: user.role,
        hotel_id: user.hotel_id
      }
    };

    res.status(201).json({
      success: true,
      message: 'Employé créé avec succès',
      data: result
    });

  } catch (error) {
    console.error('Erreur createEmployee:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la création de l’employé',
      error: error.message
    });
  }
};

/**
 * Mettre à jour un employé (Admin & SuperAdmin)
 */
export const updateEmployee = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const employee = await Employee.findByPk(id, {
      include: [{ model: User, as: 'user' }]
    });

    if (!employee) {
      return res.status(404).json({ success: false, message: 'Employé non trouvé' });
    }

    const isAdminSameHotel = req.user.role === 'admin' && employee.hotel_id === req.user.hotel_id;
    const isSuperAdmin = req.user.role === 'superadmin';

    if (!isSuperAdmin && !isAdminSameHotel) {
      return res.status(403).json({ success: false, message: 'Accès refusé' });
    }

    // Mise à jour User (le mot de passe sera hashé automatiquement si présent)
    const userUpdates = {};
    if (updateData.nom !== undefined) userUpdates.nom = updateData.nom;
    if (updateData.prenom !== undefined) userUpdates.prenom = updateData.prenom;
    if (updateData.email !== undefined) userUpdates.email = updateData.email;
    if (updateData.telephone !== undefined) userUpdates.telephone = updateData.telephone;
    if (updateData.password) userUpdates.password = updateData.password; // ← En clair → hook beforeUpdate

    if (Object.keys(userUpdates).length > 0) {
      await employee.user.update(userUpdates);
    }

    // Mise à jour Employee
    const employeeUpdates = {};
    if (updateData.poste !== undefined) employeeUpdates.poste = updateData.poste;
    if (updateData.departement !== undefined) employeeUpdates.departement = updateData.departement;
    if (updateData.salaire !== undefined) employeeUpdates.salaire_mensuel = updateData.salaire;
    if (updateData.contrat_type !== undefined) employeeUpdates.contrat_type = updateData.contrat_type;
    if (updateData.statut !== undefined) employeeUpdates.statut = updateData.statut;

    if (Object.keys(employeeUpdates).length > 0) {
      await employee.update(employeeUpdates);
    }

    await employee.reload({ include: [{ model: User, as: 'user' }] });

    res.status(200).json({
      success: true,
      message: 'Employé mis à jour avec succès',
      data: employee
    });

  } catch (error) {
    console.error('Erreur updateEmployee:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la mise à jour',
      error: error.message
    });
  }
};

/**
 * Supprimer un employé (Admin & SuperAdmin)
 */
export const deleteEmployee = async (req, res) => {
  try {
    const { id } = req.params;

    const employee = await Employee.findByPk(id, { include: [{ model: User, as: 'user' }] });
    if (!employee) {
      return res.status(404).json({ success: false, message: 'Employé non trouvé' });
    }

    const isAdminSameHotel = req.user.role === 'admin' && employee.hotel_id === req.user.hotel_id;
    const isSuperAdmin = req.user.role === 'superadmin';

    if (!isSuperAdmin && !isAdminSameHotel) {
      return res.status(403).json({ success: false, message: 'Accès refusé' });
    }

    // Suppression en cascade : d'abord l'utilisateur, puis l'employé
    if (employee.user) {
      await employee.user.destroy();
    }
    await employee.destroy();

    res.status(200).json({
      success: true,
      message: 'Employé supprimé avec succès'
    });

  } catch (error) {
    console.error('Erreur deleteEmployee:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la suppression',
      error: error.message
    });
  }
};