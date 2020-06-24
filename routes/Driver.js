const express = require('express');
const router = express.Router();
const controllerDriver = require('../controllers/Driver');

const passport = require('passport');
const auth = passport.authenticate("jwt-authentication", { session: false });

router.post('/register',auth ,controllerDriver.registerDriver);
router.delete('/delete/:userId', auth, controllerDriver.deleteDriver);

router.get('/getDriverInformation/:userId',auth,controllerDriver.getDriverInformation)
router.get('/registered/:userId', controllerDriver.registered)
router.patch('/service', auth, controllerDriver.offerRoute);

module.exports = router