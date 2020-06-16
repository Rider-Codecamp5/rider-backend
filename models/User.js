module.exports = (sequelize, DataTypes) => {
  const user = sequelize.define('user', {
    email: {
      type: DataTypes.STRING,
    },
    password: {
      type: DataTypes.STRING
    },
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
  })

  user.associate = models => {
    user.hasOne(models.driver, {
      through: models.reserve
    });
    user.hasMany(models.trip_history);
  }

  return user;
}

//     User.associate = models => {
//         User.belongToMany(models.report, { through: 'Report' })

//     }

//     return User;
// }