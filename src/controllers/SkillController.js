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
}

module.exports = new SkillController;