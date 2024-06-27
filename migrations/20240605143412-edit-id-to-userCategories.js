'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    await queryInterface.renameColumn('UserCategories', 'userId', 'UserId');
    await queryInterface.renameColumn('UserCategories', 'categoryId', 'CategoryId');
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.renameColumn('UserCategories', 'UserId', 'userId');
    await queryInterface.renameColumn('UserCategories', 'CategoryId', 'categoryId');
  }
};
