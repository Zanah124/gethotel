'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('planning_employees', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      employee_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'employees', key: 'id' },
        onDelete: 'CASCADE',
      },
      hotel_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'hotels', key: 'id' },
        onDelete: 'CASCADE',
      },
      week_start: {
        type: Sequelize.DATEONLY,
        allowNull: false,
      },
      slots: {
        type: Sequelize.JSON,
        allowNull: true,
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'),
      },
    });
    await queryInterface.addIndex('planning_employees', ['employee_id', 'week_start'], { unique: true });
    await queryInterface.addIndex('planning_employees', ['hotel_id', 'week_start']);
  },

  async down(queryInterface) {
    await queryInterface.dropTable('planning_employees');
  },
};
