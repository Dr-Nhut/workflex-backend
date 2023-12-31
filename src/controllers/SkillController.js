const crypto = require('crypto');
const conn = require('../config/db.config')

class SkillController {
    getAll(req, res, next) {
        const sql = "SELECT * FROM skill";
        conn.promise().query(sql)
            .then(([rows, fields]) => {
                res.send(rows);
            })
            .catch(err => console.error(err));
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

    create(req, res, next) {
        const { name } = req.body;
        const sql = "INSERT INTO skill (id, name) VALUES(?, ?)";
        const id = crypto.randomUUID();
        conn.promise().query(sql, [id, name])
            .then(() => {
                res.send({ message: 'Thêm ngôn ngữ lập trình thành công' });
            })
            .catch(err => console.error(err));
    }

    deleteSkill(req, res, next) {
        const id = req.query.id;
        const sql = `DELETE FROM skill WHERE id = '${id}'`;
        conn.promise().query(sql)
            .then(() => {
                res.send({ message: 'Xoángôn ngữ lập trình thành công' });
            })
            .catch(err => console.error(err));
    }
}

module.exports = new SkillController;