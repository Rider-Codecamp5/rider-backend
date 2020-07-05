const db = require('../models');
const { Op, where } = require("sequelize");

const registerDriver = async (req, res) => {
  let userData = await req.user;
  const id = req.body.id;
  const driver_license = req.body.driver_license;
  const seat = req.body.seat;
  const car_model = req.body.car_model;
  const car_color = req.body.car_color;
  const bank_account = req.body.bank_account;

  const body = {
    id,
    driver_license,
    seat,
    car_model,
    car_color,
    bank_account,
  };

  const driver = await db.driver.findOne({ where: { id: id } });
  if (driver) {
    res.status(400).send({ message: 'Already register' });
  } else {
    const createDriver = await db.driver.create(body);
    res
      .status(201)
      .send({ message: 'Driver created', createDriver: createDriver });
  }
};

const deleteDriver = async (req, res) => {
  const id = req.params.userId;
  const driver = await db.driver.findOne({ where: { id: id } });
  if (driver) {
    const deleteDriver = await db.driver.destroy({ where: { id: id } });
    res
      .status(200)
      .send({ message: 'DriverId had deleted', deleteDriver: deleteDriver });
  } else {
    res.status(400).send({ message: 'Invalid driver ID' });
  }
};

const offerRoute = async (req, res) => {
  let userData = await req.user;
  const origin = req.body.origin;
  const originLat = req.body.originLat;
  const originLng = req.body.originLng;
  const destination = req.body.destination;
  const destinationLat = req.body.destinationLat;
  const destinationLng = req.body.destinationLng;
  const date_time = req.body.date;
  const luggage = req.body.luggage;
  const seating_capacity = req.body.seatingCapacity;
  const price = req.body.price;

  const body = {
    from: origin,
    from_lat: originLat,
    from_lng: originLng,
    to: destination,
    to_lat: destinationLat,
    to_lng: destinationLng,
    date_time,
    luggage,
    seating_capacity,
    price,
    status: 'available',
  };

  try {
    await db.driver.update(body, { where: { id: userData.id } });

    res.status(201).json({
      message: 'created new route',
      driver: userData.id,
      details: body,
    });
  } catch (err) {
    res.status(400).send({ message: 'Cannnot create route' });
    console.log(err);
  }
};

const waitForPassenger = async (req, res) => {
  let driverData = await req.user;
  let selectedDriver;
  let selectedDriverPromise = new Promise(function (resolve, reject) {
    const checkPassenger = setInterval(async () => {
      console.log('driver is waiting for passenger');
      let availableDriver = await db.driver.findOne({
        where: {
          id: driverData.id,
          status: 'available',
          passenger_id: null,
        },
      });

      try {
        if (!availableDriver) {
          console.log('hello from waitForpassenger !availableDriver')
          clearInterval(checkPassenger);
          let isSelected = await db.driver.update(
            {
              status: 'selected',
              confirmation: 'pending',
            },
            {
              where: {
                id: driverData.id,
                // passenger_id: {
                //   [Op.ne]: null,
                // },
              },
            }
          );
          if (isSelected) {
            selectedDriver = await db.driver.findOne({
              where: { id: driverData.id },
            });
            resolve('driver is selected');
            // console.log('driver status', currentDriver.status);
          } else {
            reject('something is wrong');
          }
        }
      } catch (err) {
        clearInterval(checkPassenger);
        reject(err);
      }
    }, 3000);
  });

  selectedDriverPromise
    .then(result => {
      res.status(201).json({
        message: result,
        driver: selectedDriver,
        status: selectedDriver.status,
      });
    })
    .catch(error => {
      res.status(400).json({
        message: error,
      });
    });
};

const driverConfirm = async (req, res) => {
  let driverData = await req.user;
  let confirmation = req.body.confirmation;

  try {
    if (confirmation) {
      await db.driver.update(
        {
          status: 'booked',
          confirmation: 'confirmed',
        },
        {
          where: { id: driverData.id },
        }
      );
      res.status(201).json({
        message: 'reservation is confirmed',
        status: 'booked',
        confirmation: 'confirmed',
      });
    } else {
      await db.driver.update(
        {
          status: 'available',
          confirmation: null,
          passenger_id: null,
        },
        {
          where: { id: driverData.id },
        }
      );
      res.status(201).json({
        message: 'reservation is confirmed',
        status: 'available',
        confirmation: null,
      });
    }
  } catch (err) {
    res.status(400).json({
      message: 'something is wrong',
    });
  }
};

const get = async (req, res) => {
  const id = await req.user.id;
  const driver = await db.driver.findOne({ where: { id: id } });
  try {
    if (driver) {
      res.status(200).send({ message: 'OK', driver: driver });
    } else {
      res.status(400).send({message: "your aren't driver"})
    }
  } catch (error) {
    res.status(400).send();
  }
};

const registered = async (req, res) => {
  const id = req.params.userId;
  const driver = await db.driver.findOne({ where: { id: id } });

  if (driver) {
    res.status(200).send(true);
  } else {
    res.status(404).send();
  }
};

const edited = async (req, res) => {
  const id = await req.user.id;
  const driver_license = req.body.driver_license;
  const car_model = req.body.car_model;
  const car_color = req.body.car_color;
  const seat = req.body.seat;
  const bank_account = req.body.bank_account;

  const values = {};
  if (driver_license) {
    values['driver_license'] = driver_license;
  }
  if (car_model) {
    values['car_model'] = car_model;
  }
  if (car_color) {
    values['car_color'] = car_color;
  }
  if (seat) {
    values['seat'] = seat;
  }
  if (bank_account) {
    values['bank_account'] = bank_account;
  }
  const user = await db.driver.findOne({ where: { id: id } });
  if (user) {
    const edit = await db.driver.update(values, { where: { id: id } });
    try {
      res.status(200).send({ edit: edit });
    } catch (error) {
      console.log(error);
      res.status(400).send({ message: 'error' });
    }
  } else {
    res.status(400).send({ message: `Don't have user` });
  }

  res.send({ id: id });
};

const getPassenger = async (req, res) => {
  const { passengerId, driverId } = req.body;

  const passengerToAdd = await db.driver.update(
    { passenger_id: passengerId },
    {
      where: {
        id: driverId,
      },
    }
  );

  console.log(passengerToAdd);
  res.status(200).send('tbd');
};

const getTrip = async (req, res) => {
  const id = await req.user.id;
  console.log('getTrip', id)

  try{
    // const currentTrip = await db.driver.findOne({
    //   where : {
    //     [Op.or]: [
    //       { id: id },
    //       { passenger_id: id },
    //     ]
    //   }
    // })
    let roleInTrip;
    let currentTrip = await db.driver.findOne({
      where: { passenger_id: id },
    })
    roleInTrip = 'passenger';

    // if not passenger, query as a driver
    if(!currentTrip) {
      console.log('hello')
      currentTrip = await db.driver.findOne({
        where: { id },
      })  
      console.log('hello')
      console.log(currentTrip)
      roleInTrip = 'driver';
    }


    res.status(200).json({
      currentTrip: currentTrip,
      roleInTrip: roleInTrip,
    })
  } catch(err) {
    res.status(404).json({
      message: 'no trip found',
    })
  }
}

module.exports = {
  registerDriver,
  deleteDriver,
  offerRoute,
  get,
  registered,
  edited,
  getPassenger,
  waitForPassenger,
  driverConfirm,
  getTrip,
};
