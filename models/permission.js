'use strict';
const {
    Model
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Permission extends Model {
        static associate(models) {
            this.belongsToMany(models.Role, { through: 'RolePermissions' });
        }
    }
    Permission.init({
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        title: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: { args: true, msg: "Quyền đã tồn tại!" },
            validate: {
                notNull: {
                    msg: 'Tên quyền không hợp lệ!!!'
                },
                notEmpty: {
                    msg: 'Tên quyền không được bỏ trống!!!'
                }
            }
        },
        description: DataTypes.TEXT
    }, {
        sequelize,
        modelName: 'Permission',
    });

    return Permission;
};