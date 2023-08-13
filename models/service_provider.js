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
    }
  }
  service_provider.init({
    joined_date: DataTypes.DATE,
    nic_copy: DataTypes.BLOB,
    type: DataTypes.STRING,
    license_id: DataTypes.STRING,
    copy_of_license: DataTypes.BLOB,
    experience_category: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'service_provider',
  });
  return service_provider;
};