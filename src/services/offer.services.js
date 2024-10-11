const { Offer, Job } = require("../../models");
const { BadRequestError, NotFoundError } = require("../core/error.response");
const OfferRepository = require("../repo/offer.repo");

class OfferServices {
    static async getByJob({ jobId, userId }) {
        return await OfferRepository.findAllByJobIdAndUserId({ jobId, userId });
    }

    static async getByFreelancer({ employeeId }) {
        const offers = await Offer.findAll({
            where: {
                creatorId: employeeId,
            }
        })

        if (offers.length === 0) {
            throw new BadRequestError('Bạn chưa gửi lời chào giá.')
        }

        return offers;
    }

    static async create({ creatorId, jobId, offerData }) {
        /*
        1/ Check job exists
        2/ Check user sent offer to job?
        3/ Send offer 
        */
        //1
        const job = await Job.findByPk(jobId, {
            include: Offer
        });

        if (!job) {
            throw new NotFoundError('Job not exists');
        }
        //2
        const offers = job.Offers;

        const offerByMe = offers.find(offer => {
            return offer.creatorId === creatorId
        })

        if (offerByMe) {
            throw new BadRequestError('You sent an offer for this job!');
        }

        //3
        const newOffer = Offer.create({ ...offerData, creatorId, jobId });
        if (!newOffer) {
            throw new BadRequestError("Couldn't create");
        }
        return newOffer;
    }

    static async update({ }) {

    }

    static async delete({ offerId, userId }) {
        /*
        1/ Check offer exists
        2/ Check job status
        3/ Delete
        */
        const offer = await Offer.findOne({
            where: {
                id: offerId,
                creatorId: userId
            },
            attributes: [],
            include: Job
        })

        if (!offer) {
            throw new BadRequestError("Offer not exist!");
        }

        //2 check job status
        if (offer.Job.status) {

        }

        return Offer.destroy({
            where: {
                id: offerId,
                creatorId: userId
            }
        })
    }
}

module.exports = OfferServices