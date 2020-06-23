const Sequelize = require('sequelize');
const db = require('../models');
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { Op } = Sequelize;

const createUser = async (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  const profile_pic = req.body.profile_pic;
  const first_name = req.body.first_name;
  const last_name = req.body.last_name;
  const address = req.body.address;
  try {
    const filters = { email: email };
    const user = await db.user.findOne({ where: filters });
    if (user) {
      res.status(400).send({ message: 'Invalid your E-mail' });
    } else {
      const salt = bcryptjs.genSaltSync(12);
      const hashedPassword = bcryptjs.hashSync(password, salt);
      const body = {
        email,
        password: hashedPassword,
        profile_pic,
        first_name,
        last_name,
        address,
      };
      const created = await db.user.create(body);
      res.status(200).send({ message: 'User created', created });
    }
  } catch (error) {
    console.log(error);
    res.send(error);
  }
};

const loginUser = async (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  const user = await db.user.findOne({ where: { email: email } });
  if (!user) {
    res.status(400).send({ message: 'Invalid Username or Password' });
  } else {
    const isSuccess = bcryptjs.compareSync(password, user.password);
    if (isSuccess) {
      const payload = {
        id: user.id,
        name: user.first_name,
      };
      const token = jwt.sign(payload, 'superSecretKey', { expiresIn: 10800 });
      res.status(200).send({ message: `It's OK`, isSuccess, token });
    } else {
      res.status(400).send({ message: 'Invalid Username or Password' });
    }
  }
};

const getUser = async (req, res) => {
  const id = req.params.id;
  const userData = await db.user.findOne({ where: { id: id } });
  try {
    res.send({ userData: userData });
  } catch (e) {
    console.log(e);
    res.send('error');
  }
};

const findTrip = async (req, res) => {
  // 13.8162899 100.5609968 central ladprao

  // 13.8133627 100.5618615 union mall
  // 13.8043117 100.5538347 chatuchak park
  // 13.8286184 100.5686844 major ratchayothin
  // 13.8023369 100.5533361 bts mor chit

  // 13.9888426 100.6177962 future rangsit
  // 13.7449649 100.5338814 siam square

  const { geocode_to } = req.query;

  const DISTANCE = 0.00899322;

  try {
    const result = await db.driver.findAll({
      where: {
        // geocode_from: {
        //   [Op.between]: [geocode_from - DISTANCE, geocode_from + DISTANCE],
        // },
        geocode_to: {
          [Op.between]: [geocode_to - DISTANCE, geocode_to + DISTANCE],
        },
      },
    });

    res.status(200).send(result);
  } catch (err) {
    console.log(err);
  }
};

module.exports = { createUser, loginUser, getUser, findTrip };
