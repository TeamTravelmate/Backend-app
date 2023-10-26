'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class comment_post extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.User, {
        foreignKey: 'user_id'
      })
      this.belongsTo(models.post, {
        foreignKey: 'post_id'
      })
    }
  }
  comment_post.init({
    user_id: DataTypes.INTEGER,
    post_id: DataTypes.INTEGER,
    comment: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'comment_post',
  });
  return comment_post;
};