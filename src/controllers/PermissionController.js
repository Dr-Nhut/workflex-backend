
const { permission } = require('process');
const { OK, NoContent, Created } = require('../core/success.reponse');
const PermissionServices = require('../services/permission.services');

class PermissionController {
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