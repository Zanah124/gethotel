// backend/src/routes/client/hotelRoutes.js
const express = require('express');
const router = express.Router();
const hotelController = require('../../controllers/client/hotelController');
const { auth } = require('../../middleware/auth');
const { roleCheck } = require('../../middleware/roleCheck');

// Routes publiques (sans authentification)
router.get('/search', hotelController.searchHotels);
router.get('/popular', hotelController.getPopularHotels);
router.get('/destinations', hotelController.getPopularDestinations);
router.get('/:id', hotelController.getHotelDetails);

module.exports = router;