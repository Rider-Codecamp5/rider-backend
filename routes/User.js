const express = require('express');
const router = express.Router();
const userController = require('../controllers/User');

const passport = require('passport');
const auth = passport.authenticate('jwt-authentication', { session: false });

router.post('/createUser', userController.createUser);
router.post('/loginUser', userController.loginUser);
router.get('/get/:id', auth, userController.get);
router.patch('/edit', auth, userController.edited);
router.get('/trip/confirmation', auth, userController.waitForConfirmation);

//  find trip
router.get('/trip', auth, userController.findTrip);
router.get('/trip/:id', auth, userController.selectDriver);

module.exports = router;
