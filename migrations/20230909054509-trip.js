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
    await queryInterface.addColumn('trips', 'user_id', Sequelize.INTEGER);
    //add a column for status(active, inactive, completed). Defaults to active. 
    await queryInterface.addColumn('trips', 'status', {
      type: Sequelize.ENUM('active', 'inactive', 'completed'),
      defaultValue: 'active'
    });
    
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
      await queryInterface.removeColumn('trips', 'user_id');
      await queryInterface.removeColumn('trips', 'status');
  }
};
