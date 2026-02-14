'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    const tableInfo = await queryInterface.describeTable('planning_employees');
    if (!tableInfo.slots) {
      await queryInterface.addColumn(
        'planning_employees',
        'slots',
        {
          type: Sequelize.JSON,
          allowNull: true,
        }
      );
    }
  },

  async down(queryInterface) {
    await queryInterface.removeColumn('planning_employees', 'slots');
  },
};
