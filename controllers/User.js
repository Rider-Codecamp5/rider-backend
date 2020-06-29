const Sequelize = require('sequelize');
const { QueryTypes } = require('sequelize');
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

      // check whether the user is a driver or not
      try {
        const driverInfo = await db.driver.findOne({ where: { id: user.id } });
        res.status(200).send({
          message: `Driver is logged in`,
          isSuccess,
          token,
          isDriver: true,
          driverId: driverInfo.id,
        });
      } catch (err) {
        res.status(200).send({
          message: `User is logged in`,
          isSuccess,
          token,
          isDriver: false,
        });
      }
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
  const destinationLat = Number(req.query.destinationLat);
  const destinationLng = Number(req.query.destinationLng);
  // req.user.user_id

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

    const driverResultIdx = [];
    for (let i of result) {
      driverResultIdx.push(i.id);
    }

    let allIdIwant = '';
    for (let item of driverResultIdx) {
      if (allIdIwant !== '') allIdIwant += ' or ';
      allIdIwant += `users_data.id = ${item}`;
    }

    const driversData = await db.sequelize.query(
      `SELECT * FROM rider_development.drivers drivers_data 
      join rider_development.users users_data on users_data.id = drivers_data.id
      and (${allIdIwant})
      `,
      { type: QueryTypes.SELECT }
    );

    res.status(200).send(driversData);
  } catch (err) {
    console.log(err);
  }
};

const selectDriver = async (req, res) => {
  const { id } = req.params;
  let driverData;

  try {
    const driver = await db.driver.findOne({
      where: { id },
      raw: true,
    });

    const user = await db.user.findOne({
      where: { id },
    });

    driverData = {
      ...driver,
      first_name: user.first_name,
      last_name: user.last_name,
      phone_number: user.phone_number,
      profile_pic: user.profile_pic,
    };

    res.status(200).send(driverData);
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

  const values = { first_name: first_name };
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
  getUser,
  findTrip,
  edited,
  selectDriver,
};
