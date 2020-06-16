module.exports = (sequelize, DataTypes) => {
    const tripHistory = sequelize.define('trip_history', {
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

    tripHistory.associate = models => {
        tripHistory.belongsTo(models.user);
        tripHistory.belongsTo(models.driver);
    }

    return tripHistory
}