'use strict';
const {
  Model
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Skill extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsToMany(models.User, { through: 'UserSkills' });
      this.belongsToMany(models.Job, { through: 'JobSkills' });
    }
  }
  Skill.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: {
        msg: 'Tên ngôn ngữ lập trình đã tồn tại!!!'
      },
      validate: {
        notNull: {
          msg: 'Tên ngôn ngữ lập trình không hợp lệ!!!'
        },
        notEmpty: {
          msg: 'Tên ngôn ngữ lập trình không được bỏ trống!!!'
        }
      }
    }
  }, {
    sequelize,
    modelName: 'Skill',
  });

  return Skill;
};