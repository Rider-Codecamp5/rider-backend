const express = require('express');
const router = express.Router();
const tripController = require('../controllers/TripHistory');

const passport = require('passport');
const auth = passport.authenticate('jwt-authentication', { session: false });

router.get('/passenger', auth, tripController.getAllPassengerTrip);
router.get('/driver', auth, tripController.getAllDriverTrip);
router.get('/recent', auth, tripController.getRecentTrip);
router.post('/review', auth, tripController.saveTrip);

module.exports = router;
