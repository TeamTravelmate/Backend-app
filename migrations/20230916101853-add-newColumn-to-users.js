'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Users', 'type', {
      type: Sequelize.DataTypes.INTEGER,
      defaultValue:0,
    });
  },
};