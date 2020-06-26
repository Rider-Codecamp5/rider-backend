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
  const phone_number = req.body.phone_number;
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
        phone_number,
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

const get = async (req, res) => {
  const id = await req.user.id;
  const userData = await db.user.findOne({ where: { id: id } });
  try {
    res.send({ userData: userData });
  } catch (e) {
    console.log(e);
    res.send('error');
  }
};

const findTrip = async (req, res) => {
  const destinationLat = Number(req.query.destinationLat);
  const destinationLng = Number(req.query.destinationLng);

  const DISTANCE = 0.00899322;

  try {
    const result = await db.driver.findAll({
      where: {
        to_lat: {
          [Op.between]: [destinationLat - DISTANCE, destinationLng + DISTANCE],
        },
        to_lng: {
          [Op.between]: [destinationLat - DISTANCE, destinationLng + DISTANCE],
        },
      },
    });

    res.status(200).send(result);
  } catch (err) {
    console.log(err);
  }
};

const selectDriver = async (req, res) => {
  const { id } = req.params;

  try {
    const driver = await db.driver.findOne({
      where: { id },
    });
    res.status(200).send(driver);
  } catch (err) {
    console.log(err);
  }
};

const edited = async (req, res) => {
  const id = await req.user.id;
  const first_name = req.body.first_name;
  const last_name = req.body.last_name;
  const address = req.body.address;
  const phone_number = req.body.phone_number;
  const profile_pic = req.body.profile_pic;

  const user = await db.user.findOne({ where: { id: id } });

  const values = {};
  if (first_name) {
    values['first_name'] = first_name;
  }
  if (last_name) {
    values['last_name'] = last_name;
  }
  if (address) {
    values['address'] = address;
  }
  if (phone_number) {
    values['phone_number'] = phone_number;
  }
  if (profile_pic) {
    values['profile_pic'] = profile_pic;
  }

  if (user) {
    const edited = await db.user.update(values, { where: { id: id } });
    try {
      res.status(200).send({ message: 'user edited', edited: edited });
    } catch (error) {
      res.status(400).send(error);
    }
  } else {
    res.status(400).send(`Invalid user`);
  }
};

module.exports = {
  createUser,
  loginUser,
  get,
  findTrip,
  edited,
  selectDriver,
};
