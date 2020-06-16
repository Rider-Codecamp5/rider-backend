module.exports = (sequelize, DataTypes) => {
    const Driver = sequelize.define('Driver', {
        driver_license : {
            type : DataTypes.STRING,
        },
        seat : {
            type : DataTypes.INTEGER,
        },
        car_model : {
            type : DataTypes.STRING,
        },
        bank_account : {
            type : DataTypes.STRING,
        }
    })

    return Driver
}