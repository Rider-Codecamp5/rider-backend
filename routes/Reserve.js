const express = require('express');
const router = express.Router();
const controllerReserve= require('../controllers/Reserve');

const passport = require('passport');
const auth = passport.authenticate("jwt-authentication", { session: false });

router.post('/driver', auth, controllerReserve.driverCreateRoute);

module.exports = router