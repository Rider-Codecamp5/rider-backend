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
        seating_capacity : {
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
        },
        from : {
            type: DataTypes.STRING,
        },
        to : {
            type: DataTypes.STRING,
        },
        date_time : {
            type: DataTypes.STRING,
        },
        luggage: {
            type : DataTypes.BOOLEAN,
        },
        price : {
            type: DataTypes.STRING,
        },
        booked_seat : {
            type: DataTypes.INTEGER,
        },
        status : {
            type: DataTypes.STRING,
        },
        cancel_reason : {
            type: DataTypes.STRING,
        }
    })

    driver.associate = models => {
        driver.belongsTo(models.user, {
            foreignKey: "passenger_id",
        });
        driver.hasMany(models.trip_history);
    }

    return driver
}