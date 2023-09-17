'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class budget extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.trip, {foreignKey: 'tripID'});
      this.hasMany(models.expense, {foreignKey: 'budget_id'});
    }
  }
  budget.init({
    amount: DataTypes.NUMERIC,
    tripID: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'budget',
  });
  return budget;
};