'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class share_trip extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.trip, {
        foreignKey: 'trip_id'
      })
      this.belongsTo(models.User, {
        foreignKey: 'user_id'
      })
    }
  }
  share_trip.init({
    trip_id: DataTypes.INTEGER,
    user_id: DataTypes.INTEGER,
    link: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'share_trip',
  });
  return share_trip;
};