const { Category } = require('../../models');
const { AppError } = require('../core/error.response');
const { OK, NoContent } = require('../core/success.reponse');
const CategoryServices = require('../services/category.services');
const sequelizeErrorHandler = require('../utils/sequelizeErrorHandler');

class CategoryController {
    async getAll(req, res, next) {
        return OK.create({
            message: 'Thành công!',
            metadata: await CategoryServices.getAll()
        }).send(res);
    }

    async create(req, res, next) {
        return OK.create({
            message: 'Thêm mới lĩnh vực thành công!',
            metadata: {
                caegtory: await CategoryServices.create(req.body.name)
            }
        }).send(res);
    }

    async update(req, res, next) {
        return OK.create({
            message: 'Cập nhật lĩnh vực thành công!',
            metadata: await CategoryServices.update(req.params.id, req.body.name)
        }).send(res);
    }

    async delete(req, res, next) {
        await CategoryServices.delete(req.params.id);
        return NoContent.create().send(res);
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