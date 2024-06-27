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

    getAllByUser(req, res) {
        const userId = req.params.userId;
        const sql = `SELECT * FROM usercategory LEFT JOIN category ON category.id=usercategory.categoryId WHERE userId='${userId}'`;
        conn.promise().query(sql)
            .then(([rows, fields]) => {
                res.send(rows);
            })
            .catch(err => console.error(err));
    }

    create(req, res, next) {
        const {
            name
        } = req.body;

        const sql = "INSERT INTO category (id, name) VALUES(?, ?)";
        const id = crypto.randomUUID();
        conn.promise().query(sql, [id, name])
            .then(() => {
                res.send({
                    message: 'Thêm lĩnh vực thành công'
                });
            })
            .catch(err => console.error(err));
    }

    deleteCategory(req, res) {
        const id = req.query.id;

        const sql = `DELETE FROM category WHERE category.id = '${id}'`;
        conn.promise().query(sql)
            .then(response => res.json('Xóa thành công'))
            .catch(err => console.error(err))
    }

    updateCategories(req, res) {
        const userId = req.params.id;
        const categories = req.body.categories;

        const sql = `DELETE FROM usercategory WHERE userId = '${userId}'`;
        conn.promise().query(sql)
            .then(() => {
                const sql = `INSERT INTO usercategory (userId, categoryId) VALUES ${categories.map(category => `('${userId}', '${category}')`).join(',')}`;
                conn.promise().query(sql)
                    .then(() => res.json('Cập nhật thành công'))
            })
            .catch(err => console.error(err))
    }
}

module.exports = new CategoryController;