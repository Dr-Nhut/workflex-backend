const conn = require('../config/db.config');
const { Created, NoContent, OK } = require('../core/success.reponse');
const ContractServices = require('../services/contract.services');

class ContractController {
    async getByUser(req, res, next) {
        const contracts = await ContractServices.getByUser({ userId: req.user.id })
        return OK.create({
            message: 'success',
            metadata: {
                length: contracts.length,
                data: contracts
            }
        }).send(res);
    }

    async create(req, res, next) {
        const { dateStart, dateEnd, value, offerId, jobId } = req.body;

        return Created.create({
            message: "Create contract successfully!",
            metadata: await ContractServices.create({
                contractData: { dateStart, dateEnd, value },
                jobId,
                offerId,
                userId: req.user.id
            })
        }).send(res)
    }

    async update(req, res, next) {
        return OK.create({
            message: "Update contract successfully!",
            metadata: await ContractServices.update({
                contractData: req.body,
                contractId: req.params.id,
                userId: req.user.id
            })
        }).send(res)
    }

    async delete(req, res, next) {
        await ContractServices.delete({
            contractId: req.params.id,
            userId: req.user.id
        })
        return NoContent.create().send(res);
    }

    // getByOffer(req, res, next) {
    //     const offerId = req.query.offerId;
    //     const sql = `SELECT * FROM contract WHERE offerId='${offerId}'`
    //     conn.promise().query(sql)
    //         .then(([rows, fields]) => res.json(rows[0]))
    //         .catch((err => console.error(err)));
    // }
}

module.exports = new ContractController;