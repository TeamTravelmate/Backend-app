'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('public_trips', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      trip_id: {
        type: Sequelize.INTEGER
      },
      max_traveler_count: {
        type: Sequelize.INTEGER
      },
      remaining_slots: {
        type: Sequelize.INTEGER
      },
      amount_per_head: {
        type: Sequelize.NUMERIC
      },
      important_notes: {
        type: Sequelize.STRING
      },
      hotels: {
        type: Sequelize.STRING
      },
      resturants: {
        type: Sequelize.STRING
      },
      transport: {
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
    await queryInterface.dropTable('public_trips');
  }
};