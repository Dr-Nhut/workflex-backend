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
      'privateKey',
      {
        type: Sequelize.STRING,
        allowNull: false,
      }
    );
    await queryInterface.renameColumn(
      'KeyTokens',
      'refreshToken',
      'refreshTokenUsed',
    );

    await queryInterface.addColumn(
      'KeyTokens',
      'refreshToken',
      {
        type: Sequelize.STRING,
        allowNull: false,
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
    await queryInterface.removeColumn(
      'KeyTokens',
      'privateKey'
    );
    await queryInterface.renameColumn(
      'KeyTokens',
      'refreshTokenUsed',
      'refreshToked',
    );

    await queryInterface.removeColumn(
      'KeyTokens',
      'refreshToken'
    );
  }
};
