'use strict';
const { Skill } = require('../../models');
const { BadRequestError, NotFoundError } = require('../core/error.response');

class SkillServices {
    static getAll = async () => {
        const skills = await Skill.findAll();

        return {
            length: skills.length,
            skills,
        }
    }

    static create = async (name) => {
        const newSkill = await Skill.create({ name });

        if (newSkill.id) {
            return newSkill;
        }
    }

    static update = async (id, name) => {
        const result = await Skill.update({ name }, {
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
        const result = await Skill.destroy({
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

module.exports = SkillServices;