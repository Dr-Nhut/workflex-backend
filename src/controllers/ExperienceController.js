const conn = require('../config/db.config')
const ExperienceServices = require('../services/experience.services');
const { OK, Created } = require('../core/success.reponse');

class ExperienceController {
  async getAll(req, res) {
    return OK.create({
      message: 'Thành công!',
      metadata: await ExperienceServices.getAll()
    }).send(res);
  }

  async create(req, res) {
    return Created.create({
      message: 'Thêm mới danh mục kinh nghiệm thành công!',
      metadata: await ExperienceServices.create(req.body.name)
    }).send(res);
  }
}

module.exports = new ExperienceController;