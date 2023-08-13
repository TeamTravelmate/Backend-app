'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class trip extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  trip.init({
    starting_date: DataTypes.DATE,
    category: DataTypes.STRING,
    no_of_days: DataTypes.INTEGER,
    route_id: DataTypes.INTEGER,
    adult_count: DataTypes.INTEGER,
    children_count: DataTypes.INTEGER,
    starting_place: DataTypes.STRING,
    destination: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'trip',
  });
  return trip;
};