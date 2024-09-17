'use strict';
const {
    Model
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Role extends Model {

        static associate(models) {
            this.hasMany(models.User, {
                foreignKey: 'roleId',
                constraints: false,
            })
            this.belongsToMany(models.Permission, { through: 'RolePermissions' });
        }
    }
    Role.init({
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        title: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: {
                msg: 'Tên vai trò đã tồn tại!!!'
            },
            validate: {
                notNull: {
                    msg: 'Tên vai trò không hợp lệ!!!'
                },
                notEmpty: {
                    msg: 'Tên vai trò không được bỏ trống!!!'
                }
            }
        },
        description: DataTypes.TEXT
    }, {
        sequelize,
        modelName: 'Role',
    });

    return Role;
};