'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class post extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.User, {
        foreignKey: 'userID'
      });
    }
  }
  post.init({
    content: DataTypes.STRING,
    media: DataTypes.STRING,
    userID: DataTypes.INTEGER,
    reactCount: DataTypes.INTEGER,
    commentCount: DataTypes.INTEGER,
    shareCount: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'post',
  });
  return post;
};