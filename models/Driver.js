module.exports = (sequelize, DataTypes) => {
    const Driver = sequelize.define('Driver', {
        DriverLicense : {
            type : DataTypes.STRING,
        },
        Seat : {
            type : DataTypes.INTEGER,
        },
        CarModel : {
            type : DataTypes.STRING,
        },
        BankAccount : {
            type : DataTypes.STRING,
        }
    })

    return Driver
}