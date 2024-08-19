const { Offer, Job } = require("../../models");
const { BadRequestError } = require("../core/error.response");

class OfferRepository {
    static async findAllByJobIdAndUserId({ jobId, userId }) {
        const job = await Job.findOne({
            where: {
                id: jobId,
                creatorId: userId
            },
            include: [{
                model: Offer,
            }]
        })

        if (!job) {
            throw new BadRequestError("Couldn't find job")
        }

        return job.Offers;
    }
}

module.exports = OfferRepository