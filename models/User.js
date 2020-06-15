module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define('User', {
        email : {
            type: DataTypes.STRING,
        },
    })
    return User;
}