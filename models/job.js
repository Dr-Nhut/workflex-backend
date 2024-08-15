"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Job extends Model {
    static associate(models) {
      // define association here
      this.belongsTo(models.User, {
        foreignKey: 'creatorId',
        constraints: false,
      });
    }
  }

  Job.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      minBudget: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      maxBudget: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      experience: {
        type: DataTypes.ENUM,
        defaultValue: "0",
        values: ["0", "1", "2", "3"],
        allowNull: false,
      },
      dateStart: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      dateEnd: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      bidExpiration: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      reasonRefused: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      status: {
        type: DataTypes.ENUM,
        defaultValue: "0",
        values: ["0", "1", "2", "3", "4", "5", "6"],
        allowNull: false,
      },
      type: {
        type: DataTypes.ENUM,
        defaultValue: "Online",
        values: ["Online", "Offline"],
      },
      completedAt: {
        type: DataTypes.DATE,
      }
    },
    {
      sequelize,
      modelName: "Job",
    }
  );
  return Job;
};
