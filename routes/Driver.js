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
router.patch('/service/wait', auth, controllerDriver.waitForPassenger);
router.patch('/service/wait-cancel', auth, controllerDriver.cancelWaitForPassenger);
router.patch('/service/confirm', auth, controllerDriver.driverConfirm);
router.get('/service/current', auth, controllerDriver.getTrip);
router.patch('/service/cancel', auth, controllerDriver.driverCancelTrip);

router.patch('/edited', auth, controllerDriver.edited);
//passenger
router.patch('/service/join', auth, controllerDriver.getPassenger);

router.patch('/service/selected', auth, controllerDriver.gotSelected);

module.exports = router;
