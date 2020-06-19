const { Sequelize } = require('sequelize');
const db = require('../models');
const { Op } = Sequelize;

const findDrivers = async (req, res) => {
  const { from, to, price, number_of_seat, status } = req.query;
  const results = await db.reserves.findAll({
    where: {
      from,
      to,
      price: {
        [Op.lte]: price,
      },
      number_of_seat: {
        [Op.lte]: number_of_seat,
      },
      status,
    },
  });

  if (!results) {
    res.status(404).send({ message: 'No driver found' });
  }

  res.status(200).send(results);
};

module.exports = { findDrivers };
