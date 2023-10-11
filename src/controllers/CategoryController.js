const crypto = require('crypto');
const conn = require('../config/db.config')

class CategoryController {
    getAll(req, res, next) {
        const sql = "SELECT * FROM category";
        conn.promise().query(sql)
            .then(([rows, fields]) => {
                res.send(rows);
            })
            .catch(err => console.error(err));
    }

    create(req, res, next) {
        const { name } = req.body;
        console.log(req.body);
        const sql = "INSERT INTO category (id, name) VALUES(?, ?)";
        const id = crypto.randomUUID();
        conn.promise().query(sql, [id, name])
            .then(() => {
                res.send({ message: 'Thêm lĩnh vực thành công' });
            })
            .catch(err => console.error(err));
    }
}

module.exports = new CategoryController;