'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class vendor extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  vendor.init({
    address: DataTypes.STRING,
    business_reg_no: DataTypes.STRING,
    license_copy: DataTypes.BLOB
  }, {
    sequelize,
    modelName: 'vendor',
  });
  return vendor;
};