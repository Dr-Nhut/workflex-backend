'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Jobs', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
      },
      title: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      minBudget: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      maxBudget: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      experience: {
        type: Sequelize.ENUM,
        defaultValue: "0",
        values: ["0", "1", "2", "3"],
        allowNull: false,
      },
      dateStart: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      dateEnd: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      bidExpiration: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      reasonRefused: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      status: {
        type: Sequelize.ENUM,
        values: ['0', '1', '2', '3', '4', '5', '6'],
        defaultValue: '0',
        allowNull: false
      },
      type: {
        type: Sequelize.ENUM,
        defaultValue: "Online",
        values: ["Online", "Offline"],
      },
      completedAt: {
        type: Sequelize.DATE,
      },
      creatorId: {
        type: Sequelize.UUID,
        references: {
          model: 'Users',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Jobs');
  }
};