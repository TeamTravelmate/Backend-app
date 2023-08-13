'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class tour_essential extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  tour_essential.init({
    essential_name: DataTypes.STRING,
    status: DataTypes.STRING,
    tripID: DataTypes.INTEGER,
    userID: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'tour_essential',
  });
  return tour_essential;
};