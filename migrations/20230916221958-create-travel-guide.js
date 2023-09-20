'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('travel_guides', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      nic: {
        type: Sequelize.STRING
      },
      nic_copy: {
        type: Sequelize.STRING
      },
      SLTDA_License: {
        type: Sequelize.STRING
      },
      language: {
        type: Sequelize.STRING
      },
      experience: {
        type: Sequelize.STRING,
        defaultValue:0
      },
      experience_field: {
        type: Sequelize.STRING
      },
      price_per_day: {
        type: Sequelize.FLOAT
      },
      user_id: {
        type: Sequelize.INTEGER
      },
      status: {
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
    await queryInterface.dropTable('travel_guides');
  }
};