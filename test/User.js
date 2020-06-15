module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define('User', {
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
        email: {
            type: DataTypes.STRING,
        },
        password: {
            type: DataTypes.STRING
        }

    }, {
        timestamps: false
    })

    // User.associate = models => {
    //     User.belongToMany(models.report, { through: 'Report' })

    // }

    return User;
}