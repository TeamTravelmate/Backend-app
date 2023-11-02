'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class react_trip extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.User, {
        foreignKey: 'user_id'
      })
      this.belongsTo(models.trip, {
        foreignKey: 'trip_id'
      })
    }
  }
  react_trip.init({
    user_id: DataTypes.INTEGER,
    trip_id: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'react_trip',
  });
  return react_trip;
};