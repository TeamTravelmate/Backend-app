'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class product_rating extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  product_rating.init({
    vendor_essential_id: DataTypes.INTEGER,
    ratings: DataTypes.NUMERIC
  }, {
    sequelize,
    modelName: 'product_rating',
  });
  return product_rating;
};