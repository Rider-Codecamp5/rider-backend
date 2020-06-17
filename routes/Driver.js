const express = require('express');
const router = express.Router();
const controllerDriver = require('../controllers/Driver');
const { route } = require('./User');

const passport = require('passport');
const auth = passport.authenticate("jwt-authentication", { session: false });

router.post('/registerDriver/:userId',auth ,controllerDriver.registerDriver)





router.delete('/deleteDriver/:userId', auth, controllerDriver.deleteDriver)



module.exports = router