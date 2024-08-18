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
    await queryInterface.renameColumn('JobSkills', 'jobId', 'JobId');
    await queryInterface.renameColumn('JobSkills', 'skillId', 'SkillId');

  },

  async down(queryInterface, Sequelize) {
    await queryInterface.renameColumn('JobSkills', 'JobId', 'jobId');
    await queryInterface.renameColumn('JobSkills', 'SkillId', 'skillId');
  }
};
