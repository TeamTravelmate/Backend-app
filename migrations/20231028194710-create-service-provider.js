'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('service_providers', {
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
      STLDA_license: {
        type: Sequelize.STRING
      },
      language: {
        type: Sequelize.STRING
      },
      field: {
        type: Sequelize.STRING
      },
      no_of_year: {
        type: Sequelize.INTEGER
      },
      price_per_hour: {
        type: Sequelize.FLOAT
      },
      address: {
        type: Sequelize.STRING
      },
      tel_no: {
        type: Sequelize.INTEGER
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
    await queryInterface.dropTable('service_providers');
  }
};