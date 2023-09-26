'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class trip_reminder extends Model {
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
  trip_reminder.init({
    user_id: DataTypes.INTEGER,
    trip_id: DataTypes.INTEGER,
    title: DataTypes.STRING,
    date: DataTypes.DATE,
    time: DataTypes.TIME
  }, {
    sequelize,
    modelName: 'trip_reminder',
  });
  return trip_reminder;
};