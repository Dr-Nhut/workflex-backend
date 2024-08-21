const conn = require('../config/db.config')
const SkillServices = require('../services/skill.services');
const { OK, NoContent } = require('../core/success.reponse');

class SkillController {
    async getAll(req, res, next) {
        return OK.create({
            message: 'Thành công!',
            metadata: await SkillServices.getAll()
        }).send(res);
    }

    async create(req, res, next) {
        return OK.create({
            message: 'Thêm mới kỹ năng thành công!',
            metadata: {
                skill: await SkillServices.create(req.body.name)
            }
        }).send(res);
    }

    async update(req, res, next) {
        return OK.create({
            message: 'Cập nhật kỹ năng thành công!',
            metadata: await SkillServices.update(req.params.id, req.body.name)
        }).send(res);
    }

    async delete(req, res, next) {
        await SkillServices.delete(req.params.id);
        return NoContent.create().send(res);
    }

    getAllByUser(req, res) {
        const userId = req.params.userId;
        const sql = `SELECT * FROM freelancerskill LEFT JOIN skill ON freelancerskill.skillId=skill.id WHERE freelancerskill.freelancerId='${userId}'`;
        conn.promise().query(sql)
            .then(([rows, fields]) => {
                res.send(rows);
            })
            .catch(err => console.error(err));
    }
}

module.exports = new SkillController;