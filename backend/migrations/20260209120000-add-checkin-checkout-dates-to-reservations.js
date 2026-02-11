'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn(
      'reservations',
      'date_check_in',
      { type: Sequelize.DATE, allowNull: true }
    );
    await queryInterface.addColumn(
      'reservations',
      'date_check_out',
      { type: Sequelize.DATE, allowNull: true }
    );
  },

  async down(queryInterface) {
    await queryInterface.removeColumn('reservations', 'date_check_in');
    await queryInterface.removeColumn('reservations', 'date_check_out');
  },
};
