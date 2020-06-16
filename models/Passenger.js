module.exports = (sequelize, DataTypes) => {
  const Passenger = sequelize.define('Passenger', {
    email: {
      type: DataTypes.STRING,
    },
    password: {
      type: DataTypes.STRING
    },
    profile_pic: {
      type: DataTypes.STRING
    },
    first_name: {
      type: DataTypes.STRING
    },
    last_name: {
      type: DataTypes.STRING
    },
    address: {
      type: DataTypes.STRING
    },
  })
  return Passenger;
}