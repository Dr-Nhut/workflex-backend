
const { Created, OK } = require('../core/success.reponse');
const PermissionServices = require('../services/permission.services');

class PermissionController {
    async getAll(req, res) {
        return OK.create({
            message: 'Thành công!',
            metadata: {
                permission: await PermissionServices.getAll()
            }
        }).send(res);
    }

    async create(req, res) {
        return Created.create({
            message: 'Thêm quyền mới thành công!',
            metadata: {
                permission: await PermissionServices.create(req.body)
            }
        }).send(res);
    }
}

module.exports = new PermissionController;