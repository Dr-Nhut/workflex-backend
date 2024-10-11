const { Job, User, Category, Skill } = require("../../models");
const { Op } = require("sequelize");
const { BadRequestError, NotFoundError } = require("../core/error.response");

class JobServices {
  static async getAll() {
    return await Job.findAll();
  }

  static async getByEmployerId({ employerId, status, comparison }) {
    const jobs = await Job.findAll({
      where: {
        creatorId: employerId,
        status,
      }
    });

    if (!jobs) {
      throw new BadRequestError('Không tìm thấy công việc');
    }

    return jobs;
  }

  static async getById(id) {
    const job = await Job.findByPk(id, {
      include: [{
        model: User,
      }, {
        model: Category,
      }, {
        model: Skill,
      }]
    });

    if (!job) {
      throw new NotFoundError(`Không tìm thấy công việc ${id}`)
    }

    return job;
  }

  static async create({ job, creatorId }) {
    try {
      const newJob = await Job.create({ ...job, creatorId });

      if (!newJob) {
        throw new BadRequestError("Không thể tạo mới việc làm")
      }

      return newJob;
    }
    catch (err) {
      throw new BadRequestError(err.message);
    }
  }

  static async update({ job, jobId, creatorId }) {
    try {
      return await Job.update(
        {
          ...job,
          skills: job.skills
        },
        {
          include: Skill,
        }, {
        where: {
          id: jobId,
          status: '0',
          creatorId
        }
      })
    } catch (err) {
      throw new BadRequestError(err.message);
    }
  }

  static async delete({ jobId, creatorId }) {
    const result = await Job.destroy({
      where: {
        id: jobId,
        creatorId,
        status: {
          [Op.eq]: "0",
        }
      },
    });

    if (result === 0) {
      throw new BadRequestError("Not deleted");
    }

    return;
  }
}

module.exports = JobServices;
