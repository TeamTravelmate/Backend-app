'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class CustomTrip extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  CustomTrip.init({
    userId: DataTypes.INTEGER,
    destination: DataTypes.STRING,
    startDate: DataTypes.DATE,
    numberOfDays: DataTypes.INTEGER,
    invitedFriends: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'CustomTrip',
  });
  return CustomTrip;
};