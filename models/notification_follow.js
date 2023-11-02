'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class notification_follow extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  notification_follow.init({
    sender_id: DataTypes.INTEGER,
    receiver_id: DataTypes.INTEGER,
    status: DataTypes.BOOLEAN,
    date: DataTypes.DATE,
    time: DataTypes.TIME
  }, {
    sequelize,
    modelName: 'notification_follow',
  });
  return notification_follow;
};