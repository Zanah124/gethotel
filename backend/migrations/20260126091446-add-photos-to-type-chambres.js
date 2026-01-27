'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('type_chambres', 'photos', {
      type: Sequelize.JSON,           // Permet de stocker un tableau d'URLs : ["url1.jpg", "url2.jpg", ...]
      allowNull: true,                // Autorise NULL pour les anciens types existants
      defaultValue: []                // Tableau vide par défaut pour les nouveaux
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('type_chambres', 'photos');
  }
};