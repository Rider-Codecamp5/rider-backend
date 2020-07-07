const express = require('express');
const db = require('./models');
const app = express();
const cors = require('cors');

// const reportRoutes = require('./routes/Report')
const userRoutes = require('./routes/User');
const driverRoutes = require('./routes/Driver');
const paymentRoutes = require('./routes/Payment');
const tripHistoryRoutes = require('./routes/TripHistory');

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Mouting routes
app.use('/user', userRoutes);
app.use('/driver', driverRoutes);
app.use('/payment', paymentRoutes);
app.use('/trip-history', tripHistoryRoutes);

require('./config/passport/passport');

db.sequelize.sync({ alter: false }).then(() => {
  app.listen(8000, () => {
    console.log('Server is running on port 8000');
  });
});
