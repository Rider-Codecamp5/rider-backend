module.exports = (sequelize, DataTypes) => {
  const Report = sequelize.define('Report', {
    message: {
      type: DataTypes.STRING
    },
    report_status: {
      type: DataTypes.STRING
    }

  }, {
    timestamps: false
  })

  return Report
}