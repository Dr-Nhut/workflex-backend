const { Category } = require('../../models');
const AppError = require('../utils/errorHandler');
const sequelizeErrorHandler = require('../utils/sequelizeErrorHandler');

class CategoryController {
    async getAll(req, res, next) {
        try {
            const categories = await Category.findAll();

            res.status(200).json({
                status: 'success',
                result: categories.length,
                data: categories,
            })
        }
        catch (err) {
            next(new AppError('Unexpected error', 500));
        }
    }

    async create(req, res, next) {
        try {
            const category = await Category.create({ name: req.body.name });

            if (category.id) {
                res.status(200).json({
                    status: 'success',
                    message: 'Thêm lĩnh vực thành công!!!',
                    data: category
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
            next(new AppError("Tên lĩnh vực không hợp lệ!!!", 400));
            return;
        }

        try {
            const [result, [updatedCategory]] = await Category.update({ name }, {
                where: {
                    id: req.params.id,
                },
                returning: true,
            });

            if (result === 0) {
                next(new AppError("Lĩnh vực không tồn tại!!!", 404))
            }
            else {
                res.status(200).json({
                    status: 'success',
                    message: 'Chỉnh sửa lĩnh vực thành công!!!',
                    data: updatedCategory
                })
            }
        }
        catch (err) {
            sequelizeErrorHandler(err, next);
        }
    }

    async delete(req, res, next) {
        try {
            const result = await Category.destroy({
                where: {
                    id: req.params.id,
                },
            })
            if (result === 0) {
                next(new AppError('Lĩnh vực không tồn tại!!!', 404))
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