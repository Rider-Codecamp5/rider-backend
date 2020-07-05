const Sequelize = require('sequelize');
const { QueryTypes } = require('sequelize');
const db = require('../models');
const { Op } = Sequelize;

require('dotenv').config();

const omise = require('omise')({
  publicKey: process.env.OMISE_PUBLIC_KEY,
  secretKey: process.env.OMISE_SECRET_KEY,
});

const payToDriver = async (req, res) => {
  const { id } = req.params;
  let driverPaymentInfo;

  try {
    const driver = await db.driver.findOne({
      where: { id },
      raw: true,
    });

    const driverInfo = await db.user.findOne({
      where: { id },
    });

    const passenger = await db.user.findOne({
      where: { id: driver.passenger_id },
    });

    driverPaymentInfo = {
      ...driver,
      first_name: driverInfo.first_name,
      last_name: driverInfo.last_name,
      phone_number: driverInfo.phone_number,
      profile_pic: driverInfo.profile_pic,
      email: driverInfo.email,
      currentPassenger: passenger,
    };

    res.status(200).send(driverPaymentInfo);
  } catch (err) {
    console.log(err);
  }
};

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

    console.log('charge item', charge);

    res.send({ authorizeUri: charge.authorize_uri });
  } catch (err) {
    console.log(err);
  }
  next();
};

module.exports = { omiseCheckoutInternetBanking, payToDriver };
