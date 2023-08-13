'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class vendor_essential extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  vendor_essential.init({
    category: DataTypes.STRING,
    assential_name: DataTypes.STRING,
    price: DataTypes.NUMERIC,
    quantity: DataTypes.INTEGER,
    seller_name: DataTypes.STRING,
    address: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'vendor_essential',
  });
  return vendor_essential;
};