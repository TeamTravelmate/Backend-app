'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User_order extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.product_details, {
        foreignKey : 'product_id'
      })
      this.belongsTo(models.vendor_essential, {
        foreignKey : 'vendor_essential_id'
      })
      this.belongsTo(models.user, {
        foreignKey : 'traveler_id'
      })
      this.belongsTo(models.user, {
        foreignKey : 'vendor_id'
      })
    }
  }
  User_order.init({
    product_id: DataTypes.INTEGER,
    quantity: DataTypes.INTEGER,
    product_amount: DataTypes.NUMERIC,
    traveler_id: DataTypes.INTEGER,
    vendor_id: DataTypes.INTEGER,
    colour: DataTypes.STRING,
    size: DataTypes.STRING,
    vendor_essential_id: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'User_order',
  });
  return User_order;
};