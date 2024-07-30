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
    queryInterface.changeColumn('ApiKeys', 'permissions', {
      type: Sequelize.ARRAY(Sequelize.STRING),
      allowNull: false,
      values: ['0000', '1111', '2222']
    })
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    queryInterface.changeColumn('ApiKeys', 'permissions', {
      type: Sequelize.ARRAY(Sequelize.STRING),
      allowNull: false,
      enum: ['0000', '1111', '2222']
    })
  }
};
