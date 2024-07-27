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
    await queryInterface.addColumn(
      'KeyTokens',
      'userId',
      {
        type: Sequelize.UUID,
        allowNull: false,
      }
    );

    await queryInterface.addColumn(
      'KeyTokens',
      'refreshToken',
      {
        type: Sequelize.ARRAY(Sequelize.STRING),
        defaultValue: [],
      }
    );

  },

  async down(queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.removeColumn('KeyTokens', 'userId');
    await queryInterface.removeColumn('KeyTokens', 'refreshToken');
  }
};
