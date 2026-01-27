import Stock from '../../../models/Stock.js';
import MouvementStock from '../../../models/MouvementStock.js';
import CategorieStock from '../../../models/CategorieStock.js';
import { Op } from 'sequelize';
import sequelize from '../../../config/database.js';

// Lister tous les articles du stock de l'hôtel connecté
export const getAllStock = async (req, res) => {
  try {
    const { page = 1, limit = 20, search = '', categorie_id, low_stock } = req.query;
    const offset = (page - 1) * limit;

    let where = { hotel_id: req.hotelId };
    
    if (search) {
      where[Op.or] = [
        { nom_article: { [Op.iLike]: `%${search}%` } },
        { description: { [Op.iLike]: `%${search}%` } },
        { fournisseur: { [Op.iLike]: `%${search}%` } }
      ];
    }
    
    if (categorie_id) where.categorie_id = categorie_id;
    
    if (low_stock === 'true') {
      where.quantite_actuelle = { [Op.lte]: sequelize.col('quantite_minimale') };
    }

    const { count, rows } = await Stock.findAndCountAll({
      where,
      include: [{
        model: CategorieStock,
        attributes: ['id', 'nom']
      }],
      limit: parseInt(limit),
      offset,
      order: [['nom_article', 'ASC']]
    });

    res.json({
      success: true,
      data: rows,
      pagination: {
        total: count,
        page: parseInt(page),
        pages: Math.ceil(count / limit)
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Récupérer un article
export const getStockById = async (req, res) => {
  try {
    const article = await Stock.findOne({
      where: { id: req.params.id, hotel_id: req.hotelId },
      include: [{
        model: CategorieStock,
        attributes: ['id', 'nom', 'description']
      }]
    });
    
    if (!article) {
      return res.status(404).json({ success: false, message: 'Article non trouvé' });
    }
    
    res.json({ success: true, data: article });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Créer un article
export const createStock = async (req, res) => {
  try {
    const article = await Stock.create({
      ...req.body,
      hotel_id: req.hotelId
    });
    
    res.status(201).json({ success: true, data: article });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// Modifier un article
export const updateStock = async (req, res) => {
  try {
    const [updated] = await Stock.update(req.body, {
      where: { id: req.params.id, hotel_id: req.hotelId }
    });
    
    if (!updated) {
      return res.status(404).json({ success: false, message: 'Article non trouvé' });
    }
    
    const article = await Stock.findByPk(req.params.id, {
      include: [CategorieStock]
    });
    
    res.json({ success: true, data: article });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// Supprimer un article
export const deleteStock = async (req, res) => {
  try {
    const deleted = await Stock.destroy({
      where: { id: req.params.id, hotel_id: req.hotelId }
    });
    
    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Article non trouvé' });
    }
    
    res.json({ success: true, message: 'Article supprimé' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


// Faire une entrée/sortie/ajustement + mise à jour automatique du stock
export const createMouvement = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const { stock_id, type_mouvement, quantite, motif } = req.body;

    const article = await Stock.findOne({
      where: { id: stock_id, hotel_id: req.hotelId }
    });

    if (!article) {
      await t.rollback();
      return res.status(404).json({ success: false, message: 'Article non trouvé' });
    }

    // Vérification stock suffisant pour une sortie
    if (type_mouvement === 'sortie' && article.quantite_actuelle < quantite) {
      await t.rollback();
      return res.status(400).json({ 
        success: false, 
        message: 'Stock insuffisant',
        quantite_disponible: article.quantite_actuelle
      });
    }

    // Créer le mouvement
    const mouvement = await MouvementStock.create({
      stock_id,
      type_mouvement,
      quantite,
      motif,
      effectue_par: req.user.id,
    }, { transaction: t });

    // Mettre à jour la quantité actuelle
    const quantiteAvant = article.quantite_actuelle;
    
    if (type_mouvement === 'entree') {
      article.quantite_actuelle += quantite;
    } else if (type_mouvement === 'sortie') {
      article.quantite_actuelle -= quantite;
    } else if (type_mouvement === 'ajustement') {
      // Pour ajustement, quantite représente la nouvelle valeur absolue
      article.quantite_actuelle = quantite;
    }

    await article.save({ transaction: t });
    await t.commit();

    res.status(201).json({ 
      success: true, 
      data: { 
        mouvement, 
        article,
        quantite_avant: quantiteAvant,
        quantite_apres: article.quantite_actuelle
      } 
    });
  } catch (error) {
    await t.rollback();
    res.status(400).json({ success: false, message: error.message });
  }
};

// Historique des mouvements d'un article
export const getMouvementsByStockId = async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const offset = (page - 1) * limit;

    // Vérifier que l'article appartient à l'hôtel
    const article = await Stock.findOne({
      where: { id: req.params.stock_id, hotel_id: req.hotelId }
    });

    if (!article) {
      return res.status(404).json({ success: false, message: 'Article non trouvé' });
    }

    const { count, rows } = await MouvementStock.findAndCountAll({
      where: { stock_id: req.params.stock_id },
      include: [{
        model: Stock,
        attributes: ['nom_article', 'unite_mesure']
      }],
      order: [['date_mouvement', 'DESC']],
      limit: parseInt(limit),
      offset
    });

    res.json({ 
      success: true, 
      data: rows,
      pagination: {
        total: count,
        page: parseInt(page),
        pages: Math.ceil(count / limit)
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Alertes stock faible pour l'hôtel
export const getLowStockAlerts = async (req, res) => {
  try {
    const alerts = await Stock.findAll({
      where: {
        hotel_id: req.hotelId,
        quantite_actuelle: { [Op.lte]: sequelize.col('quantite_minimale') }
      },
      include: [{
        model: CategorieStock,
        attributes: ['id', 'nom']
      }],
      order: [['quantite_actuelle', 'ASC']]
    });
    
    res.json({ success: true, data: alerts, count: alerts.length });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Statistiques stock
export const getStockStats = async (req, res) => {
  try {
    const stats = await Stock.findAll({
      where: { hotel_id: req.hotelId },
      attributes: [
        [sequelize.fn('COUNT', sequelize.col('id')), 'total_articles'],
        [sequelize.fn('SUM', sequelize.col('quantite_actuelle')), 'quantite_totale'],
        [sequelize.fn('SUM', sequelize.literal('quantite_actuelle * prix_unitaire')), 'valeur_totale']
      ],
      raw: true
    });

    const lowStock = await Stock.count({
      where: {
        hotel_id: req.hotelId,
        quantite_actuelle: { [Op.lte]: sequelize.col('quantite_minimale') }
      }
    });

    const recentMouvements = await MouvementStock.count({
      include: [{
        model: Stock,
        where: { hotel_id: req.hotelId },
        attributes: []
      }],
      where: {
        date_mouvement: {
          [Op.gte]: sequelize.literal("NOW() - INTERVAL '7 days'")
        }
      }
    });

    res.json({
      success: true,
      data: {
        ...stats[0],
        articles_stock_faible: lowStock,
        mouvements_7_jours: recentMouvements
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Export rapport stock (CSV)
export const exportStockReport = async (req, res) => {
  try {
    const articles = await Stock.findAll({
      where: { hotel_id: req.hotelId },
      include: [{
        model: CategorieStock,
        attributes: ['nom']
      }],
      order: [['nom_article', 'ASC']]
    });

    // Créer CSV
    let csv = 'Nom Article,Catégorie,Quantité Actuelle,Quantité Minimale,Unité,Prix Unitaire,Fournisseur,Dernière Commande\n';
    
    articles.forEach(article => {
      csv += `"${article.nom_article}",`;
      csv += `"${article.CategorieStock?.nom || 'N/A'}",`;
      csv += `${article.quantite_actuelle},`;
      csv += `${article.quantite_minimale},`;
      csv += `"${article.unite_mesure || 'N/A'}",`;
      csv += `${article.prix_unitaire || 0},`;
      csv += `"${article.fournisseur || 'N/A'}",`;
      csv += `"${article.derniere_commande || 'N/A'}"\n`;
    });

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=stock-export.csv');
    res.send(csv);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};