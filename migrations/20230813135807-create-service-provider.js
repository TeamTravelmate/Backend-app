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
      joined_date: {
        type: Sequelize.DATE
      },
      nic_copy: {
        type: Sequelize.BLOB
      },
      type: {
        type: Sequelize.STRING
      },
      license_id: {
        type: Sequelize.STRING
      },
      copy_of_license: {
        type: Sequelize.BLOB
      },
      experience_category: {
        type: Sequelize.STRING
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