const express = require('express');
const router = express.Router();
const userController = require('../controllers/User')

const passport = require('passport');
const auth = passport.authenticate("jwt-authentication",{session:false});

router.post('/createUser', userController.createUser)
router.post('/loginUser', userController.loginUser)
router.get('/getUser/:id',auth,userController.getUser)

module.exports = router;