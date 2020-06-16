const express = require('express');
const router = express.Router();
const userController = require('../controllers/User')

router.post('/createUser', userController.createUser)

module.exports = router;