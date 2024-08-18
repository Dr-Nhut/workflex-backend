const { Offer, Job } = require("../../models");
const { BadRequestError, NotFoundError } = require("../core/error.response");

class OfferServices {
    static async create({ creatorId, jobId, offerData }) {
        if (!await Job.findByPk(jobId)) {
            throw new NotFoundError('Job not exists');
        }

        const newOffer = Offer.create({ ...offerData, creatorId, jobId });
        if (!newOffer) {
            throw new BadRequestError("Couldn't create");
        }
        return newOffer;
    }
}

module.exports = OfferServices