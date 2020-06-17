const express = require('express');
const router = express.Router();
const controllerDriver = require('../controllers/Driver');
const { route } = require('./User');

router.post('/registerDriver/:userId', controllerDriver.registerDriver)





router.delete('/deleteDriver/:userId',controllerDriver.deleteDriver)



module.exports = router