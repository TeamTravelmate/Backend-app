'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class trip_user extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  trip_user.init({
    tripID: DataTypes.INTEGER,
    userID: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'trip_user',
  });
  return trip_user;
};