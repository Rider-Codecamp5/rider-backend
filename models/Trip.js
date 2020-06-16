module.exports = (sequelize, DataTypes) => {
    const Trip = sequelize.define('Trips', {
        from : {
            type: DataTypes.STRING,
        },
        to : {
            type: DataTypes.STRING,
        },
        date_time : {
            type: DataTypes.STRING,
        },
        number_of_seat : {
            type: DataTypes.INTEGER,
        },
        price : {
            type: DataTypes.STRING,
        },
        rating : {
            type: DataTypes.STRING,
        },
        passenger_review : {
            type: DataTypes.STRING,
        }
    })
    return Trip
}