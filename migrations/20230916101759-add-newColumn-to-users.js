'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Users', 'newColumn');
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Users', 'newColumn', {
      type: Sequelize.DataTypes.INTEGER,
      defaultValue:0,
    });
  },
};
