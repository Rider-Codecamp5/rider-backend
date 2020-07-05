module.exports = (sequelize, DataTypes) => {
  const user = sequelize.define('user', {
    email: {
      type: DataTypes.STRING,
    },
    password: {
      type: DataTypes.STRING,
    },
    profile_pic: {
      type: DataTypes.STRING,
    },
    first_name: {
      type: DataTypes.STRING,
    },
    last_name: {
      type: DataTypes.STRING,
    },
    address: {
      type: DataTypes.STRING,
    },
    phone_number: {
      type: DataTypes.STRING,
    },
  });

  user.associate = models => {
    user.hasOne(models.driver, {
      foreignKey: 'passenger_id',
    });
    user.hasMany(models.trip_history, {
      foreignKey: 'passenger_id',
    });
  };

  return user;
};
