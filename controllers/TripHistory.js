const db = require('../models');

const saveTrip = async (req, res) => {
  let userData = await req.user;

  const {
    driverId,
    passengerFrom,
    from,
    to,
    price,
    rating,
    passengerReview,
  } = req.body;

  await db.trip_history.create({
    driver_id: driverId,
    passenger_from: passengerFrom,
    rating,
    price,
    from,
    to,
    passenger_review: passengerReview,
    passenger_id: userData.id,
  });

  res.status(201).json({ message: 'Trip hitory save to database' });
};

module.exports = { saveTrip };
