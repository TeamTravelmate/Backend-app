'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class complaint extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  complaint.init({
    title: DataTypes.STRING,
    reason: DataTypes.STRING,
    category: DataTypes.STRING,
    date: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'complaint',
  });
  return complaint;
};