const { BadRequestError, NotFoundError } = require("../core/error.response")
const { Category } = require('../../models');

class CategoryServices {
    static getAll = async () => {
        const categories = await Category.findAll();

        return {
            length: categories.length,
            categories,
        }
    }

    static create = async (name) => {
        const newCategory = await Category.create({ name });

        if (newCategory.id) {
            return newCategory;
        }
    }

    static update = async (id, name) => {
        const result = await Category.update({ name }, {
            where: { id },
            returning: true,
        });

        if (result[0] === 0) {
            throw new BadRequestError('Không có giá trị nào được cập nhật!')
        }

        // result = [length, [data]];
        return result[1][0];
    }

    static delete = async (id) => {
        const result = await Category.destroy({
            where: { id },
        })
        if (result === 0) {
            throw new NotFoundError('Lĩnh vực không tồn tại!')
        }
        else {
            return null;
        }
    }
}

module.exports = CategoryServices