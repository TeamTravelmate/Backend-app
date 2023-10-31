'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class service_provider extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.User, {
        foreignKey: 'user_id'
      });
    }
  }
  service_provider.init({
    nic: DataTypes.STRING,
    nic_copy: DataTypes.STRING,
    STLDA_license: DataTypes.STRING,
    language: DataTypes.STRING,
    field: DataTypes.STRING,
    no_of_year: DataTypes.INTEGER,
    price_per_hour: DataTypes.FLOAT,
    address: DataTypes.STRING,
    tel_no: DataTypes.INTEGER,
    user_id: DataTypes.INTEGER,
    status: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'service_provider',
  });
  return service_provider;
};