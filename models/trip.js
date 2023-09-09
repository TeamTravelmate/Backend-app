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
    starting_place: DataTypes.STRING,
    user_id: DataTypes.INTEGER,
    destination:{
      type: DataTypes.STRING,
      allowNull:true,
    },
    children_count:{
      type: DataTypes.INTEGER,
      allowNull:true,
    },
    adult_count:{
      type: DataTypes.INTEGER,
      allowNull:true,
    },
    route_id:{
      type: DataTypes.INTEGER,
      allowNull:true,
    }
  }, {
    sequelize,
    modelName: 'trip',
  });
  return trip;
};