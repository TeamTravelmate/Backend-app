'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class cart extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.product_details, {
        foreignKey: 'product_id'
      })
      this.belongsTo(models.User, {
        foreignKey: 'traveler_id'
      })
      this.belongsTo(models.User, {
        foreignKey: 'vendor_id'
      })
    }
  }
  cart.init({
    product_id: DataTypes.INTEGER,
    quantity: DataTypes.INTEGER,
    product_amount: DataTypes.NUMERIC,
    traveler_id: DataTypes.INTEGER,
    vendor_id: DataTypes.INTEGER,
    status: {
      type: DataTypes.STRING,
      defaultValue: "pending"
    }
  }, {
    sequelize,
    modelName: 'cart',
  });
  return cart;
};