'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class product_details extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.vendor_essential, {
        foreignKey: 'vendor_essential_id'
      })
    }
  }
  product_details.init({
    vendor_essential_id: DataTypes.INTEGER,
    colour: DataTypes.STRING,
    size: DataTypes.STRING,
    price: DataTypes.NUMERIC,
    quantity: DataTypes.INTEGER,
    photo: DataTypes.BLOB
  }, {
    sequelize,
    modelName: 'product_details',
  });
  return product_details;
};