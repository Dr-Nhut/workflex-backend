'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class UserCategories extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  UserCategories.init({
    UserId: DataTypes.UUID,
    CategoryId: DataTypes.UUID
  }, {
    sequelize,
    modelName: 'UserCategories',
  });
  return UserCategories;
};