const { Job, User, Category, Skill, Experience } = require("../../models");
const sequelize = require('../config/db.config');
const { Op } = require("sequelize");
const { BadRequestError, NotFoundError } = require("../core/error.response");
const { includes } = require("lodash");


class JobServices {
  static async getAll(filter) {
    /**
     * filter:
     * -text: title
     * -budget: integer
     * -experience: [el, el, el]
     * -categories: [category, category]
     * -skills: [skill, skill]
     */
    const { text, budget, experience, categories, skills } = filter;

    const where = {
      status: 2,
    };

    if (text?.length > 0) {
      where.title = {
        [Op.iLike]: `%${text}%`
      }
    }

    if (budget > 999) {
      where.minBudget = {
        [Op.gte]: budget,
      };
    }

    if (Array.isArray(categories) && categories?.length > 0) {
      where.categoryId = {
        [Op.in]: categories
      }
    }

    const include = ['Category'];
    if (Array.isArray(experience) && experience?.length > 0) {
      include.push({
        model: Experience,
        where: {
          title: {
            [Op.in]: experience,
          },
        },
      });
    }

    if (Array.isArray(skills) && skills?.length > 0) {
      include.push({
        model: Skill,
        where: {
          id: {
            [Op.in]: skills,
          },
        },
      });
    }

    return await Job.findAll({
      where,
      include,
      attributes: { exclude: ['reasonRefused', 'completedAt'] }
    })
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
      if (!job.categoryId) {
        throw new BadRequestError('Vui lòng chọn lĩnh vực cho công việc')
      }

      let experience = await Experience.findByPk(job.experience);

      if (!experience) {
        experience.name = ''
      }

      const jobResult = await sequelize.transaction(async (transaction) => {
        const newJob = await Job.create({ ...job, experience: experience.name, creatorId },
          {
            include: ['Category'],
            transaction
          });
        await newJob.addSkills(job.skills, { transaction });

        return newJob
      });


      if (!jobResult) {
        throw new BadRequestError("Không thể tạo mới việc làm")
      }

      return jobResult;
    }
    catch (err) {
      throw new BadRequestError(err.message);
    }
  }

  static async update({ job, jobId, creatorId }) {
    delete job.status;

    try {
      return await sequelize.transaction(async (transaction) => {
        const currentJob = await Job.findOne({
          where: { creatorId, id: jobId, status: 0 },
          include: ["Skills", "Category"],
        });

        if (!currentJob) {
          throw new NotFoundError('Không tìm thấy thông tin công việc');
        }

        await currentJob.set(job, { transaction });
        console.log(job.skills)
        if (job.skills?.length > 0) {
          await currentJob.setSkills(job.skills, { transaction });
        }

        return await currentJob.save();
      });

    } catch (err) {
      throw new BadRequestError(err.message);
    }
  }

  static async submit({ jobId, creatorId }) {
    const response = await Job.update({
      status: 1,
    }, {
      where: {
        id: jobId,
        creatorId,
        status: 0,
      },
    })

    if (response[0] === 0) {
      throw new BadRequestError('Không tìm thấy công việc đăng trình duyệt')
    }
    return
  }

  static async approve({ approveContent, jobId }) {
    if (approveContent.result !== 1 || approveContent.result !== 0) {
      throw new BadRequestError('Kết quả phê duyệt không hợp lệ')
    }
    const response = await Job.update({
      status: approveContent.result === 0 ? 11 : 2,
      reasonRefused: approveContent.result === 0 ? approveContent.reasonRefused : ''
    }, {
      where: {
        id: jobId,
        status: 1,
      },
    })

    if (response[0] === 0) {
      throw new BadRequestError('Không tìm thấy công việc phê duyệt')
    }
    return
  }

  static async delete({ jobId, creatorId }) {
    return await Job.destroy({
      where: {
        id: jobId,
        creatorId,
        status: {
          [Op.lte]: 2,
        }
      },
    });
  }
}

module.exports = JobServices;
