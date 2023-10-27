'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class trip_user extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.trip, {
        foreignKey: 'trip_id'
      })
      this.belongsTo(models.User, {
        foreignKey: 'user_id'
      })
    }
  }
  trip_user.init({
    trip_id: DataTypes.INTEGER,
    user_id: DataTypes.INTEGER,
    address: DataTypes.STRING,
    payment_status: DataTypes.STRING,
    no_of_travelers: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'trip_user',
  });
  return trip_user;
};