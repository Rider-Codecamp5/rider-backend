module.exports = (sequelize, DataTypes) => {
    const Reserve = sequelize.define('Reserves', {
        from : {
            type: DataTypes.STRING,
        },
        to : {
            type: DataTypes.STRING,
        },
        date_time : {
            type: DataTypes.STRING,
        },
        price : {
            type: DataTypes.STRING,
        },
        number_of_seat : {
            type: DataTypes.INTEGER,
        },
        status : {
            type: DataTypes.STRING,
        },
        cancel_reason : {
            type: DataTypes.STRING,
        }
    })
    return Reserve
}