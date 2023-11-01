'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class trip_location extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.location, {
        foreignKey: 'location_id'
      })
      this.belongsTo(models.activity, {
        foreignKey: 'activity_id'
      })
    }
  }
  trip_location.init({
    tripID: DataTypes.INTEGER,
    location_id: DataTypes.INTEGER,
    day: DataTypes.STRING,
    activity_id: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'trip_location',
  });
  return trip_location;
};