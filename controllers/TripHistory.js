const db = require('../models');

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
        passenger_id: userData.id,
      },
    }
  );

  res.status(201).json({ message: 'Trip hitory save to database' });
};

module.exports = { saveTrip };
