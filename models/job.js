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

      this.hasOne(models.Contract, {
        foreignKey: 'jobId',
        constraints: false,
      })

      this.hasMany(models.Feedback, {
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
        validate: {
          notNull: {
            msg: 'Tiêu đề không được bỏ trống'
          }
        }
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: false,
        validate: {
          notNull: {
            msg: 'Mô tả không được bỏ trống'
          },
          notEmpty: {
            msg: 'Mô tả không được bỏ trống'
          }
        }
      },
      minBudget: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          notNull: {
            msg: 'Ngân sách không được bỏ trống'
          },
          min: {
            msg: 'Ngân sách thấp nhất phải lớn hơn 999đ',
            args: 1000,
          },
        }
      },
      maxBudget: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          notNull: {
            msg: 'Ngân sách không được bỏ trống'
          },
          isGreaterThanMinBudget(value) {
            if (parseInt(value) <= parseInt(this.minBudget)) {
              throw new Error('Ngân sách cao nhất phải lớn hơn hoặc bằng ngân sách thấp nhất.');
            }
          }
        }
      },
      experience: DataTypes.STRING,
      dateStart: {
        type: DataTypes.DATE,
        allowNull: false,
        validate: {
          notNull: {
            msg: 'Ngày bắt đầu không được bỏ trống',
          },
          isGreaterThanBidExperition(value) {
            if (new Date(value) <= new Date(this.bidExpiration)) {
              throw new Error('Ngày bắt đầu nên lớn hơn ngày hết hạn chào giá.');
            }
          }
        }
      },
      dateEnd: {
        type: DataTypes.DATE,
        allowNull: false,
        validate: {
          notNull: {
            msg: 'Ngày kết thúc không được bỏ trống'
          },
          isGreaterThanDateStart(value) {
            if (new Date(value) <= new Date(this.dateStart)) {
              throw new Error('Ngày kết thúc nên lớn hơn ngày bắt đầu.');
            }
          }
        }
      },
      bidExpiration: {
        type: DataTypes.DATE,
        allowNull: false,
        validate: {
          notNull: {
            msg: 'Hạn chào giá không được bỏ trống'
          },
          isDate: true,
          isAfter: new Date().toString(),
        }
      },
      reasonRefused: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      status: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
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
