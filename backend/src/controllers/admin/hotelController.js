import Hotel from '../../models/Hotel.js';
import Subscription from '../../models/Subscription.js';
import SubscriptionPlan from '../../models/SubscriptionPlan.js';
import { Op } from 'sequelize';
import sequelize from '../../config/database.js';

// Obtenir les informations de son hôtel
export const getMyHotel = async (req, res) => {
  try {
    // Utiliser req.hotelId au lieu de req.user.hotelId
    const hotelId = req.hotelId || req.user.hotel_id;

    if (!hotelId) {
      return res.status(400).json({
        success: false,
        message: 'Aucun hôtel associé à votre compte'
      });
    }

    const hotel = await Hotel.findByPk(hotelId, {
      include: [
        {
          model: Subscription,
          as: 'subscription',
          include: [
            {
              model: SubscriptionPlan,
              as: 'plan'
            }
          ]
        }
      ]
    });

    if (!hotel) {
      return res.status(404).json({
        success: false,
        message: 'Hôtel non trouvé'
      });
    }

    res.status(200).json({
      success: true,
      data: hotel
    });
  } catch (error) {
    console.error('Erreur lors de la récupération de l\'hôtel:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur',
      error: error.message
    });
  }
};

// Mettre à jour les informations de son hôtel
export const updateMyHotel = async (req, res) => {
  try {
    const hotelId = req.hotelId || req.user.hotel_id;
    const {
      nom,
      adresse,
      ville,
      pays,
      codePostal,
      telephone,
      email,
      description,
      etoiles,
      photo_principale,
      photos,
      equipements,
      services,
      politiqueAnnulation
    } = req.body;

    const hotel = await Hotel.findByPk(hotelId);

    if (!hotel) {
      return res.status(404).json({ message: 'Hôtel non trouvé' });
    }

    // Mise à jour des informations
    await hotel.update({
      nom,
      adresse,
      ville,
      pays,
      codePostal,
      telephone,
      email,
      description,
      etoiles,
      photo_principale,
      photos,
      equipements,
      services,
      politiqueAnnulation
    });

    res.status(200).json({
      message: 'Hôtel mis à jour avec succès',
      hotel
    });
  } catch (error) {
    console.error('Erreur lors de la mise à jour de l\'hôtel:', error);
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

// Uploader une photo de l'hôtel
export const uploadHotelPhoto = async (req, res) => {
  try {
    const hotelId = req.hotelId || req.user.hotel_id;

    if (!req.file) {
      return res.status(400).json({ message: 'Aucun fichier fourni' });
    }

    const hotel = await Hotel.findByPk(hotelId);

    if (!hotel) {
      return res.status(404).json({ message: 'Hôtel non trouvé' });
    }

    // Ajouter la photo à la liste des photos
    const photos = hotel.photos || [];
    photos.push(`/uploads/hotels/${req.file.filename}`);

    await hotel.update({ photos });

    res.status(200).json({
      message: 'Photo ajoutée avec succès',
      photo: `/uploads/hotels/${req.file.filename}`
    });
  } catch (error) {
    console.error('Erreur lors de l\'upload de la photo:', error);
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

// Supprimer une photo de l'hôtel
export const deleteHotelPhoto = async (req, res) => {
  try {
    const hotelId = req.hotelId || req.user.hotel_id;
    const { photoUrl } = req.body;

    const hotel = await Hotel.findByPk(hotelId);

    if (!hotel) {
      return res.status(404).json({ message: 'Hôtel non trouvé' });
    }

    // Retirer la photo de la liste
    const photos = hotel.photos || [];
    const updatedPhotos = photos.filter(photo => photo !== photoUrl);

    await hotel.update({ photos: updatedPhotos });

    res.status(200).json({
      message: 'Photo supprimée avec succès'
    });
  } catch (error) {
    console.error('Erreur lors de la suppression de la photo:', error);
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

// Obtenir les statistiques de l'hôtel
export const getHotelStats = async (req, res) => {
  try {
    const hotelId = req.hotelId || req.user.hotel_id;

    // Importer les modèles nécessaires
    const { Chambre, Reservation, Client, Employee } = require('../../models');

    // Nombre total de chambres
    const totalChambres = await Chambre.count({ where: { hotelId } });

    // Nombre de chambres disponibles
    const chambresDisponibles = await Chambre.count({
      where: { hotelId, statut: 'disponible' }
    });

    // Nombre total de réservations
    const totalReservations = await Reservation.count({
      include: [{
        model: Chambre,
        as: 'chambre',
        where: { hotelId }
      }]
    });

    // Réservations actives (en cours)
    const reservationsActives = await Reservation.count({
      where: {
        statut: 'confirmee',
        dateArrivee: { [Op.lte]: new Date() },
        dateDepart: { [Op.gte]: new Date() }
      },
      include: [{
        model: Chambre,
        as: 'chambre',
        where: { hotelId }
      }]
    });

    // Nombre de clients
    const totalClients = await Client.count({ where: { hotelId } });

    // Nombre d'employés
    const totalEmployees = await Employee.count({ where: { hotelId } });

    // Taux d'occupation
    const tauxOccupation = totalChambres > 0
      ? ((totalChambres - chambresDisponibles) / totalChambres * 100).toFixed(2)
      : 0;

    res.status(200).json({
      totalChambres,
      chambresDisponibles,
      totalReservations,
      reservationsActives,
      totalClients,
      totalEmployees,
      tauxOccupation
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des statistiques:', error);
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};