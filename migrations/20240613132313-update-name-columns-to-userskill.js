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
    await queryInterface.renameColumn('UserSkills', 'userId', 'UserId');
    await queryInterface.renameColumn('UserSkills', 'categoryId', 'SkillId');
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.renameColumn('UserSkills', 'UserId', 'userId');
    await queryInterface.renameColumn('UserSkills', 'SkillId', 'skillId');
  }
};
