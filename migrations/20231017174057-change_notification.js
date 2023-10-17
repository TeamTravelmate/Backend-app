'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    return queryInterface.addColumn('notifications', 'sender_id', {
      type: Sequelize.INTEGER
    }),
    queryInterface.addColumn('notifications', 'receiver_id', {
      type: Sequelize.INTEGER
    }),
    queryInterface.addColumn('notifications', 'status', {
      type: Sequelize.STRING
    }),
    queryInterface.addColumn('notifications', 'time', {
      type: Sequelize.TIME
    });
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
  }
};
