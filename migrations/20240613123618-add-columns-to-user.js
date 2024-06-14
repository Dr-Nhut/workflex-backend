'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    queryInterface.addColumn('Users', 'dayOfBirth', Sequelize.DATE);
    queryInterface.addColumn('Users', 'experience', Sequelize.STRING);
  },

  async down(queryInterface, Sequelize) {
    queryInterface.removeColumn('Users', 'dayOfBirth');
    queryInterface.removeColumn('Users', 'experience');
  }
};
