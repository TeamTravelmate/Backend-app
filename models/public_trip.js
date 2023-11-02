'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class public_trip extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo( models.trip, { 
        foreignKey: 'trip_id' 
      });
    }
  }
  public_trip.init({
    trip_id: DataTypes.INTEGER,
    max_traveler_count: DataTypes.INTEGER,
    remaining_slots: DataTypes.INTEGER,
    amount_per_head: DataTypes.NUMERIC,
    important_notes: DataTypes.STRING,
    hotels: DataTypes.STRING,
    resturants: DataTypes.STRING,
    transport: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'public_trip',
  });
  return public_trip;
};