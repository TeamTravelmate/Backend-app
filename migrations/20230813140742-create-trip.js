'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('trips', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      starting_date: {
        type: Sequelize.DATE
      },
      category: {
        type: Sequelize.STRING
      },
      no_of_days: {
        type: Sequelize.INTEGER
      },
      route_id: {
        type: Sequelize.INTEGER
      },
      adult_count: {
        type: Sequelize.INTEGER
      },
      children_count: {
        type: Sequelize.INTEGER
      },
      starting_place: {
        type: Sequelize.STRING
      },
      destination: {
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
    await queryInterface.dropTable('trips');
  }
};