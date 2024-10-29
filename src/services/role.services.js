const { Op } = require('sequelize');
const { Role, Permission } = require('../../models');
const { NotFoundError, UnprocessableEntityError } = require('../core/error.response');

class RoleServices {
    static getAllExceptAdmin = async () => {
        const roles = await Role.findAll({
            where: {
                title: {
                    [Op.ne]: 'admin',
                },
            },
        });

        if (!roles) {
            throw new NotFoundError('Không tìm thấy vai trò')
        }

        return roles;
    }

    static create = async ({ title = '', description }) => {
        const role = await Role.findOne({ where: { title } });

        if (role) {
            throw new UnprocessableEntityError('Vai trò đã tồn tại!')
        }

        const newRole = await Role.create({ title, description });

        if (newRole.id) {
            return newRole;
        }
    }

    static addPermission = async ({ roleId, permissionId }) => {
        const role = await Role.findOne({ where: { id: roleId } });

        if (!role) {
            throw new NotFoundError('Không tìm thấy vai trò!')
        }

        const permisson = await Permission.findOne({ where: { id: permissionId } });

        if (!permisson) {
            throw new NotFoundError('Không tìm thấy phân quyền!')
        }

        await role.addPermission(permisson)

        return role;
    }
}

module.exports = RoleServices