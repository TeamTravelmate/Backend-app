'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class activity extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.location, {
        foreignKey: "lodation_id",
      })
      this.hasMany(models.trip_location, {
        foreignKey: "activity_id",
      })
    }
  }
  activity.init({
    activity_name: DataTypes.STRING,
    description: DataTypes.STRING,
    lodation_id: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'activity',
  });
  return activity;
};