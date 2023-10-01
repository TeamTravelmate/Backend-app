'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class shipping_address extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  shipping_address.init({
    user_id: DataTypes.INTEGER,
    shipping_address: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'shipping_address',
  });
  return shipping_address;
};