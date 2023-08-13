'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class route extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  route.init({
    starting_place: DataTypes.STRING,
    destination: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'route',
  });
  return route;
};