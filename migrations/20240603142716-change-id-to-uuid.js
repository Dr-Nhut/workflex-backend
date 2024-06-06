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
    // Enable the uuid-ossp extension if it is not already enabled
    await queryInterface.sequelize.query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp";');

    // Create a new id column with type UUID
    await queryInterface.addColumn('Users', 'new_id', {
      type: Sequelize.UUID,
      defaultValue: Sequelize.literal('uuid_generate_v4()'),
      allowNull: false
    });

    // Remove the old id column
    await queryInterface.removeColumn('Users', 'id');

    // Rename the new_id column to id
    await queryInterface.renameColumn('Users', 'new_id', 'id');

    // Add primary key constraint
    await queryInterface.addConstraint('Users', {
      fields: ['id'],
      type: 'primary key',
      name: 'Users_pkey'
    });
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    // Remove primary key constraint
    await queryInterface.removeConstraint('Users', 'Users_pkey');

    // Rename the current id column to new_id
    await queryInterface.renameColumn('Users', 'id', 'new_id');

    // Add a new integer id column
    await queryInterface.addColumn('Users', 'id', {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false
    });

    // Copy data from new_id back to id (assuming no data loss)
    await queryInterface.sequelize.query('UPDATE "Users" SET id = new_id');

    // Remove the new_id column
    await queryInterface.removeColumn('Users', 'new_id');

    // Add primary key constraint
    await queryInterface.addConstraint('Users', {
      fields: ['id'],
      type: 'primary key',
      name: 'Users_pkey'
    });
  }
};
