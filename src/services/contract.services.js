var _ = require('lodash')
const { Offer, Job, Contract } = require('../../models');
const { Op } = require('sequelize');
const { BadRequestError, NotFoundError } = require('../core/error.response');

class ContractServices {
    static async getByUser({ userId }) {
        return await Contract.findAll({
            where: {
                [Op.or]: [
                    { freelancerId: userId },
                    { employerId: userId },
                ]
            }
        })
    }

    static async create({ contractData, jobId, offerId, userId }) {
        const offer = await Offer.findOne({
            where: {
                id: offerId,
                jobId
            },
            include: Job
        })

        if (!offer || offer.Job.creatorId !== userId) {
            throw new BadRequestError("Cann't find offer to create contract!")
        }

        const newContract = Contract.create({
            ...contractData,
            jobId,
            offerId,
            employerId: userId,
            freelancerId: offer.creatorId
        });

        if (!newContract) {
            throw new BadRequestError("Couldn't create a contract!")
        }

        return newContract;
    }

    static async update({ contractData, contractId, userId }) {
        const contractObjFilter = _.pick(contractData, ['status', 'dateStart', 'dateEnd', 'value']);

        const contract = await Contract.update({
            ...contractObjFilter,
            lastUserModified: userId
        }, {
            where: {
                id: contractId,
            },
            returning: true,
            // plain: true
        })

        return contract;
    }

    static async delete({ contractId, userId }) {
        return Contract.destroy({
            where: {
                id: contractId,
                creatorId: userId,
                status: "0"
            }
        })
    }
}

module.exports = ContractServices;