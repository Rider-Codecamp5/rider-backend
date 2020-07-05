module.exports = (sequelize, DataTypes) => {
  const tripHistory = sequelize.define('trip_history', {
    passenger_from: {
      type: DataTypes.STRING,
    },
    from: {
      type: DataTypes.STRING,
    },
    to: {
      type: DataTypes.STRING,
    },
    date_time: {
      type: DataTypes.STRING,
    },
    price: {
      type: DataTypes.STRING,
    },
    rating: {
      type: DataTypes.STRING,
    },
    passenger_review: {
      type: DataTypes.STRING,
    },
  });

  tripHistory.associate = models => {
    tripHistory.belongsTo(models.user, {
      foreignKey: 'passenger_id',
    });
    tripHistory.belongsTo(models.driver, {
      foreignKey: 'driver_id',
    });
  };

  return tripHistory;
};
