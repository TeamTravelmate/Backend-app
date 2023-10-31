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
    //change column name from locationID to location_id
    await queryInterface.renameColumn('trip_locations', 'locationID', 'location_id');
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    //change column name from location_id to locationID
    await queryInterface.renameColumn('trip_locations', 'location_id', 'locationID');
  }
};
