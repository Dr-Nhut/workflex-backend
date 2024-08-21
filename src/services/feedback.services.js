const { Op } = require("sequelize");
const { Feedback, Job, Contract } = require("../../models");
const { NotFoundError, BadRequestError } = require("../core/error.response");

class FeedbackServices {
    static async getByUserId({ userId }) {
        return await Feedback.findAll({
            where: {
                [Op.or]: [
                    { senderId: userId },
                    { receiverId: userId },
                ]
            }
        })
    }

    static async create({ feedbackData, jobId, userId }) {
        /**
         * Check user sent feedback?
         */
        const job = await Job.findOne({
            where: {
                id: jobId,
                // status: '6'
            },
            include: [Contract]
        })

        if (!job) {
            throw new NotFoundError("Job not exist!");
        }

        const newFeedback = await Feedback.create({
            ...feedbackData,
            jobId,
            senderId: userId,
            receiverId: job.Contract.employerId === userId ? job.Contract.freelancerId : job.Contract.employeeId
        })

        if (!newFeedback) {
            throw new BadRequestError("Can't send feedback to job!");
        }

        return newFeedback
    }

    static async update({ feedbackData, feedbackId, userId }) {
        const feedbackFilter = _.pick(feedbackData, ["star", "review"]);
        return await Feedback.update(feedbackFilter, {
            where: {
                id: feedbackId,
                senderId: userId
            }
        })
    }

    static async delete({ feedbackId, userId }) {
        return await Feedback.destroy({
            where: {
                id: feedbackId,
                senderId: userId
            },
        })
    }
}

module.exports = FeedbackServices;