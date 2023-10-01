'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class checkout extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  checkout.init({
    amount: DataTypes.NUMERIC,
    traveler_id: DataTypes.INTEGER,
    vendor_id: DataTypes.INTEGER,
    status: DataTypes.STRING,
    delivery_method: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'checkout',
  });
  return checkout;
};