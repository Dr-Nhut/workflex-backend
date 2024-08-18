'use strict';
const {
  Model
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Category extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsToMany(models.User, { through: 'UserCategories' });
      this.hasMany(models.Job, {
        foreignKey: 'categoryId',
        constraints: false,
      })
    }
  }
  Category.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: {
        msg: 'Tên lĩnh vực đã tồn tại!!!'
      },
      validate: {
        notNull: {
          msg: 'Tên lĩnh vực không hợp lệ!!!'
        },
        notEmpty: {
          msg: 'Tên lĩnh vực không được bỏ trống!!!'
        }
      }
    }
  }, {
    sequelize,
    modelName: 'Category',
  });

  return Category;
};