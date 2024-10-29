const { Permission } = require('../../models');
const { UnprocessableEntityError } = require('../core/error.response');

class PermissionServices {
    static getAll = async () => {
        return await Permission.findAll();
    }

    static create = async ({ title = '', description }) => {
        const permission = await Permission.findOne({ where: { title } });

        if (permission) {
            throw new UnprocessableEntityError('Quyền đã tồn tại!')
        }

        const newPermission = await Permission.create({ title, description });

        if (newPermission.id) {
            return newPermission;
        }
    }
}

module.exports = PermissionServices