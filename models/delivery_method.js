'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class delivery_method extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  delivery_method.init({
    user_id: DataTypes.INTEGER,
    delivery_method: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'delivery_method',
  });
  return delivery_method;
};