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
    price:{
      type: DataTypes.NUMERIC,
      allowNull: true
    } ,
    quantity:{
      type: DataTypes.INTEGER,
      allowNull: true
    } ,
    seller_name:{
      type: DataTypes.STRING,
      allowNull: true
    } ,
    address:{
      type: DataTypes.STRING,
      allowNull: true
    } ,
    user_id: DataTypes.INTEGER,
    description: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'vendor_essential',
  });
  return vendor_essential;
};