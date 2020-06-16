module.exports = (sequelize, DataTypes) => {
  const Passenger = sequelize.define('Passenger', {
    name: {
      type: DataTypes.STRING
    }
      
  }, {
    timestamps: false
  })

  return Passenger;
}