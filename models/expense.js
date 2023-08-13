'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class expense extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  expense.init({
    expense_name: DataTypes.STRING,
    amount: DataTypes.NUMERIC,
    category: DataTypes.STRING,
    userID: DataTypes.INTEGER,
    budget_id: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'expense',
  });
  return expense;
};