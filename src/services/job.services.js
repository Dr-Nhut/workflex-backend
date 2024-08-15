const { Job } = require("../../models");
const { BadRequestError } = require("../core/error.response");

class JobServices {
  static async getAll() {
    return await Job.findAll();
  }

  static async create(job, creatorId) {
    console.log(creatorId);
    try {
      const newJob = await Job.create({ ...job, creatorId });

      if (!newJob) {
        throw new BadRequestError("Couldn't create job")
      }

      return newJob;
    }
    catch (err) {
      throw new BadRequestError(err.message);
    }
  }
}

module.exports = JobServices;
