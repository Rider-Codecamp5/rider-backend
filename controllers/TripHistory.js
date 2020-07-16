const db = require('../models');

const getAllPassengerTrip = async (req, res) => {
  let userId = await req.user.id;
  let history = await db.trip_history.findAll({
    where: {
      passenger_id: userId,
    },
  });

  res.status(200).json({
    message: 'success getting all trip as a passenger',
    history,
  });
};

const getAllDriverTrip = async (req, res) => {
  let userId = await req.user.id;
  let history = await db.trip_history.findAll({
    where: {
      driver_id: userId,
    },
  });
  res.status(200).json({
    message: 'success getting all trip as a driver',
    history,
  });
};

const getRecentTrip = async (req, res) => {
  let passengerId = await req.user.id;
  let driverId = Number(req.params.id);
  console.log(driverId);
  console.log('params', driverId);

  try {
    let selectedHistory = await db.trip_history.findOne({
      where: {
        passenger_id: passengerId,
        driver_id: driverId,
      },
      // order: [['date_time', 'DESC']]
    });

    res.status(200).json({
      message: 'success getting the lastest trip',
      selectedHistory,
    });
  } catch (err) {
    res.status(400).json({
      message: 'something is wrong',
    });
  }
};

const saveTrip = async (req, res) => {
  let userData = await req.user;

  const { driverId, rating, passengerReview } = req.body;

  await db.trip_history.update(
    {
      rating,
      passenger_review: passengerReview,
    },
    {
      where: {
        driver_id: driverId,
      },
    }
  );

  res.status(201).json({ message: 'Trip hitory save to database' });
};

module.exports = {
  getAllDriverTrip,
  getAllPassengerTrip,
  getRecentTrip,
  saveTrip,
};
