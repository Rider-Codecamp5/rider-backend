module.exports = (sequelize, DataTypes) => {
  const driver = sequelize.define('driver', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: false,
      primaryKey: true,
    },
    driver_license: {
      type: DataTypes.STRING,
    },
    seat: {
      type: DataTypes.INTEGER,
    },
    car_model: {
      type: DataTypes.STRING,
    },
    car_color: {
      type: DataTypes.STRING,
    },
    bank_account: {
      type: DataTypes.STRING,
    },
    from: {
      type: DataTypes.STRING,
    },
    to: {
      type: DataTypes.STRING,
    },
    from_lat: {
      type: DataTypes.FLOAT,
    },
    from_lng: {
      type: DataTypes.FLOAT,
    },
    to_lat: {
      type: DataTypes.FLOAT,
    },
    to_lng: {
      type: DataTypes.FLOAT,
    },
    date_time: {
      type: DataTypes.BIGINT,
    },
    seating_capacity: {
      type: DataTypes.INTEGER,
    },
    luggage: {
      type: DataTypes.BOOLEAN,
    },
    price: {
      type: DataTypes.STRING,
    },
    status: {
      type: DataTypes.STRING,
    },
    confirmation: {
      type: DataTypes.STRING,
    },
    is_paid: {
      type: DataTypes.BOOLEAN,
    },
  });

  driver.associate = models => {
    driver.belongsTo(models.user, {
      foreignKey: 'passenger_id',
    });
    driver.hasMany(models.trip_history, {
      foreignKey: 'driver_id',
    });
  };

  return driver;
};
