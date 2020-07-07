const db = require('../models');

const getRecentTrip = async (req, res) => {
  let passengerId = await req.user.id;
  let selectedHistory = await db.trip_history.findOne({
    where: {
      passenger_id: passengerId,
    },
    order: [['date_time', 'DESC']]
  })

  console.log('recent trip', selectedHistory)

  res.status(200).json({
    message: 'success getting the lastest trip',
    selectedHistory,
  })
}

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

module.exports = { getRecentTrip, saveTrip };
