const db = require('../models');

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
  const date_time = req.body.date + ' ' + req.body.time;
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

  await db.driver.update(body, { where: { id: userData.id } });

  res.status(201).json({
    message: 'created new route',
    driver: userData.id,
    details: body,
  });

  const checkPassenger = setInterval(async() => {
    let waitingDriver = await db.driver.findOne({ where: { id: userData.id, status: 'available', passenger_id: null } });
    if(!waitingDriver) {
      clearInterval(checkPassenger);
    }
    console.log(waitingDriver.status);
  }, 3000);
};

// const waitForPassenger = async(req, res) => {

//   let driverData = await db.driver.findOne({where: { id: userData.id }})
//   const checkPassenger = setInterval(async() => {
//     let waitingDriver = await db.driver.findOne({ where: { id: userData.id, status: 'available', passenger_id: null } });
//     if(!waitingDriver) {
//       clearInterval(checkPassenger);
//     }
//   }, 3000);

//   res.status(201).json({
//     message: 'driver is booked',
//     driver: userData.id,
//     status: driverData, 
//   })
// }

const get = async (req, res) => {
  const id = req.user.id;
  const driver = await db.driver.findOne({ where: { id: id } });
  try {
    if (driver) {
      res.status(200).send({ message: 'OK', driver: driver });
    } else {
      // res.status(400).send({message: "your aren't driver"})
      res.status(400).send();
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
  // res.status(200).send(passenger);
};

module.exports = {
  registerDriver,
  deleteDriver,
  offerRoute,
  get,
  registered,
  edited,
  getPassenger,
  // waitForPassenger,
};
