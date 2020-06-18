const express = require('express');
const router = express.Router();
const controllerDriver = require('../controllers/Driver');

const passport = require('passport');
const auth = passport.authenticate("jwt-authentication", { session: false });

router.post('/register/:userId',auth ,controllerDriver.registerDriver);
router.delete('/delete/:userId', auth, controllerDriver.deleteDriver);

router.patch('/service', auth, controllerDriver.offerRoute);

module.exports = router