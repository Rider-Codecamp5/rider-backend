const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/Payment');

const passport = require('passport');
const auth = passport.authenticate('jwt-authentication', { session: false });

router.get('/info/:id', auth, paymentController.payToDriver);

router.post(
  '/payment-internetBanking',
  auth,
  paymentController.omiseCheckoutInternetBanking
);

module.exports = router;
