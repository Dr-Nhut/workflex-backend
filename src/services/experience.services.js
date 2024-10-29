const { BadRequestError, NotFoundError } = require("../core/error.response")
const { Experience } = require('../../models');

class ExperienceServices {
  static getAll = async () => {
    const experiences = await Experience.findAll();

    if (!experiences) {
      throw new NotFoundError('Không tìm thấy danh sách kinh nghiệm')
    }

    return {
      length: experiences.length,
      experiences,
    }
  }

  static create = async (name) => {
    const newExperience = await Experience.create({ name });

    if (!newExperience.id) {
      throw new BadRequestError('Đã xảy ra lỗi');
    }

    return newExperience;
  }
}

module.exports = ExperienceServices