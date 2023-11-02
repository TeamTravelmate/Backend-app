'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class budget_category extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.hasMany(models.expense, {
        foreignKey: 'category'
      })
    }
  }
  budget_category.init({
    category_name: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'budget_category',
  });
  return budget_category;
};