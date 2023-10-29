'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  User.init({
    firstName: DataTypes.STRING,
    lastName: DataTypes.STRING,
    birthday: DataTypes.STRING,
    gender: DataTypes.STRING,
    username: DataTypes.STRING,
    email: DataTypes.STRING,
    phoneNo: DataTypes.STRING,
    password: DataTypes.STRING,
    profile_pic: {
      type: DataTypes.STRING,
      defaultValue:''
    }

  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};