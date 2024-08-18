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

      this.belongsTo(models.Category, {
        foreignKey: 'categoryId',
        constraints: false,
      });

      this.belongsToMany(models.Skill, { through: 'JobSkills' });

      this.hasMany(models.Offer, {
        foreignKey: 'jobId',
        constraints: false,
      })
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
        validate: {
          min: 1000,
        }
      },
      maxBudget: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          isGreaterThanMinBudget(value) {
            if (parseInt(value) <= parseInt(this.minBudget)) {
              throw new Error('maxBudget must be greater than minBudget.');
            }
          }
        }
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
        validate: {
          isGreaterThanBidExperition(value) {
            if (new Date(value) <= new Date(this.bidExpiration)) {
              throw new Error('dateStart must be greater than bidExpiration.');
            }
          }
        }
      },
      dateEnd: {
        type: DataTypes.DATE,
        allowNull: false,
        validate: {
          isGreaterThanDateStart(value) {
            if (new Date(value) <= new Date(this.dateStart)) {
              throw new Error('dateEnd must be greater than dateStart.');
            }
          }
        }
      },
      bidExpiration: {
        type: DataTypes.DATE,
        allowNull: false,
        validate: {
          isDate: true,
          isAfter: new Date().toString(),
        }
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
