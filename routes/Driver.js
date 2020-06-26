const express = require('express');
const router = express.Router();
const controllerDriver = require('../controllers/Driver');

const passport = require('passport');
const auth = passport.authenticate('jwt-authentication', { session: false });

router.post('/register', auth, controllerDriver.registerDriver);
router.delete('/delete/:userId', auth, controllerDriver.deleteDriver);

router.get('/get', auth, controllerDriver.get);
router.get('/registered/:userId', controllerDriver.registered);
router.patch('/service', auth, controllerDriver.offerRoute);

router.patch('/service/join', auth, controllerDriver.getPassenger);

router.patch('/edited', auth, controllerDriver.edited);

module.exports = router;
