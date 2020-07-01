const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/Payment');

const passport = require('passport');
const auth = passport.authenticate('jwt-authentication', { session: false });

router.post(
  '/payment-internetBanking',
  auth,
  paymentController.omiseCheckoutInternetBanking
);

module.exports = router;
