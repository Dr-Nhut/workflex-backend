const conn = require('../config/db.config')
const { Skill } = require('../../models');
const sequelizeErrorHandler = require("../utils/sequelizeErrorHandler");
const AppError = require('../utils/errorHandler');

class SkillController {
    async getAll(req, res, next) {
        try {
            const skills = await Skill.findAll();

            res.status(200).json({
                status: 'success',
                result: skills.length,
                data: skills,
            })
        }
        catch (err) {
            next(new AppError('Unexpected error', 500));
        }
    }

    async create(req, res, next) {
        try {
            const skill = await Skill.create({ name: req.body.name });

            if (skill.id) {
                res.status(200).json({
                    status: 'success',
                    message: 'Thêm ngôn ngữ lập trình thành công!!!',
                    data: skill
                })
            }
        }
        catch (err) {
            sequelizeErrorHandler(err, next);
        }
    }

    async update(req, res, next) {
        const name = req.body.name;

        if (!name) {
            next(new AppError("Tên ngôn ngữ lập trình không hợp lệ!!!", 400));
            return;
        }

        try {
            const [result, [updatedSkill]] = await Skill.update({ name }, {
                where: {
                    id: req.params.id,
                },
                returning: true,
            });

            if (result === 0) {
                next(new AppError("Ngôn ngữ lập trình không tồn tại!!!", 404))
            }
            else {
                res.status(200).json({
                    status: 'success',
                    message: 'Chỉnh sửa ngôn ngữ lập trình thành công!!!',
                    data: updatedSkill
                })
            }
        }
        catch (err) {
            sequelizeErrorHandler(err, next);
        }
    }

    async delete(req, res, next) {
        try {
            const result = await Skill.destroy({
                where: {
                    id: req.params.id,
                },
            })
            if (result === 0) {
                next(new AppError('Ngôn ngữ lập trình không tồn tại!!!', 404))
            }
            else {
                res.status(204).json({
                    status: 'success',
                });
            }
        }
        catch (err) {
            next(new AppError("Unexpected Error", 500))
        }
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