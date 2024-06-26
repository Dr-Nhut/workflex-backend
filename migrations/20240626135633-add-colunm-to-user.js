'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    queryInterface.addColumn('Users', 'passwordChangedAt', Sequelize.DATE);
  },

  async down(queryInterface, Sequelize) {
    queryInterface.removeColumn('Users', 'passwordChangedAt');
  }
};
