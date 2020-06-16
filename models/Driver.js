module.exports = (sequelize, DataTypes) => {
    const driver = sequelize.define('driver', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: false,
            primaryKey: true
        },
        driver_license : {
            type : DataTypes.STRING,
        },
        seat : {
            type : DataTypes.INTEGER,
        },
        car_model : {
            type : DataTypes.STRING,
        },
        car_color: {
            type: DataTypes.STRING,
        },
        bank_account : {
            type : DataTypes.STRING,
        }
    })

    driver.associate = models => {
        driver.belongsTo(models.user, {
            through: models.reserve
        });
        driver.hasMany(models.trip_history);
    }

    return driver
}