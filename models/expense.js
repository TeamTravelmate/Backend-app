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
      this.belongsTo(models.budget, {foreignKey: 'budget_id'})
      this.belongsTo(models.budget_category, {foreignKey: 'category'})
      // this.belongsTo(models.user, {foreignKey: 'userID'})
      // this.hasMany(models.expense_category)
    }
  }
  expense.init({
    expense_name: DataTypes.STRING,
    amount: DataTypes.NUMERIC,
    category: DataTypes.INTEGER,
    date: DataTypes.DATE,
    userID: DataTypes.INTEGER,
    budget_id: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'expense',
  });
  return expense;
};