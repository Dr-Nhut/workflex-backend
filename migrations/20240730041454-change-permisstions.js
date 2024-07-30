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
    await queryInterface.changeColumn('ApiKeys', 'permissions', {
      type: Sequelize.ENUM,
      values: ['0000', '1111', '2222'],
      allowNull: false
    });

  },

  async down(queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    queryInterface.changeColumn('ApiKeys', 'permissions', {
      type: Sequelize.STRING,
      allowNull: false,
      values: ['0000', '1111', '2222']
    })
  }
};
