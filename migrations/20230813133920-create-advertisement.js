'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('advertisements', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      content: {
        type: Sequelize.STRING
      },
      media: {
        type: Sequelize.BLOB
      },
      duration: {
        type: Sequelize.INTEGER
      },
      fee: {
        type: Sequelize.NUMERIC
      },
      adType: {
        type: Sequelize.STRING
      },
      userID: {
        type: Sequelize.INTEGER
      },
      status: {
        type: Sequelize.STRING
      },
      adminID: {
        type: Sequelize.INTEGER
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('advertisements');
  }
};