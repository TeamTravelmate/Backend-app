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
    return queryInterface.addColumn('shipping_addresses', 'house_no', {
      type: Sequelize.INTEGER,
    }),
    queryInterface.addColumn('shipping_addresses', 'street', {
      type: Sequelize.STRING,
    }),
    queryInterface.addColumn('shipping_addresses', 'city', {
      type: Sequelize.STRING,
    }),
    queryInterface.addColumn('shipping_addresses', 'state', {
      type: Sequelize.STRING,
    }),
    queryInterface.addColumn('shipping_addresses', 'country', {
      type: Sequelize.STRING,
    }),
    queryInterface.addColumn('shipping_addresses', 'zip_code', {
      type: Sequelize.INTEGER,
    });
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    return queryInterface.removeColumn('shipping_addresses', 'shipping_address')
  }
};
