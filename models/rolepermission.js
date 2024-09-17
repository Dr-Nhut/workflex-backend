'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class RolePermissions extends Model {
    static associate(models) {

    }
  }
  RolePermissions.init({
    RoleId: DataTypes.UUID,
    PermissionId: DataTypes.UUID
  }, {
    sequelize,
    modelName: 'RolePermissions',
  });
  return RolePermissions;
};