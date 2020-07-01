require('dotenv').config();

const omise = require('omise')({
  publicKey: process.env.OMISE_PUBLIC_KEY,
  secretKey: process.env.OMISE_SECRET_KEY,
});

const omiseCheckoutInternetBanking = async (req, res, next) => {
  try {
    const { email, name, amount, token } = req.body;
    console.log(req.body);

    const charge = await omise.charges.create({
      amount,
      source: token,
      currency: 'thb',
      return_uri: 'http://localhost:3000/payment-result',
    });

    console.log(charge);

    res.send({ authorizeUri: charge.authorize_uri });
  } catch (err) {
    console.log(err);
  }
  next();
};

module.exports = { omiseCheckoutInternetBanking };
