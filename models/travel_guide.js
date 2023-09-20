'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class travel_guide extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  travel_guide.init({
    nic: DataTypes.STRING,
    nic_copy: DataTypes.STRING,
    SLTDA_License: DataTypes.STRING,
    language: DataTypes.STRING,
    experience: DataTypes.STRING,
    experience_field: DataTypes.STRING,
    price_per_day: DataTypes.FLOAT,
    user_id: DataTypes.INTEGER,
    status: {
      type: DataTypes.INTEGER,
      defaultValue:0
    }
  }, {
    sequelize,
    modelName: 'travel_guide',
  });
  return travel_guide;
};