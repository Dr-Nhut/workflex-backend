

const { OK, Created, } = require('../core/success.reponse');
const RoleServices = require('../services/role.services');

class RoleController {
    async create(req, res) {
        return Created.create({
            message: `Thêm vai trò mới thành công!`,
            metadata: {
                role: await RoleServices.create(req.body)
            }
        }).send(res);
    }

    async addPermission(req, res) {
        return OK.create({
            message: `Thêm quyền mới cho ${req.body.roleId} thành công!`,
            metadata: {
                role: await RoleServices.addPermission(req.body)
            }
        }).send(res);
    }
}

module.exports = new RoleController;