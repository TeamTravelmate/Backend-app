'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class advertisement extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  advertisement.init({
    content: DataTypes.STRING,
    media: DataTypes.BLOB,
    duration: DataTypes.INTEGER,
    fee: DataTypes.NUMERIC,
    adType: DataTypes.STRING,
    userID: DataTypes.INTEGER,
    status: DataTypes.STRING,
    adminID: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'advertisement',
  });
  return advertisement;
};