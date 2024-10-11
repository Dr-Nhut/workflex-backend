const crypto = require('crypto');
const conn = require('../config/db.config')
const schedule = require('node-schedule');
const { blockJob } = require('../utils/schedule');
const { Created, OK, NoContent } = require('../core/success.reponse');
const OfferServices = require('../services/offer.services');

class OfferController {
    async getByFreelancer(req, res) {
        return OK.create({
            message: "Thành công",
            metadata: await OfferServices.getByFreelancer({ freelancerId: req.user.jobId })
        }
        ).send(res)
    }

    async getByJob(req, res) {
        return OK.create({
            message: "Thành công",
            metadata: await OfferServices.getByJob({ jobId: req.params.jobId, userId: req.user.id })
        }
        ).send(res)
    }

    async create(req, res) {
        return Created.create({
            message: 'Gửi chào giá thành công.',
            metadata: await OfferServices.create({
                creatorId: req.user.id,
                jobId: req.params.id,
                offerData: req.body
            })
        }).send(res);
    }

    // update(req, res) {
    //     const id = req.params.id;
    //     const { jobId, price = null, description = null, plan = null, dateEnd = null, status = null } = req.body;

    //     const sql = `UPDATE offer SET price = IFNULL(?, price), description = IFNULL(?, description), plan = IFNULL(?, plan), dateEnd = IFNULL(?, dateEnd), status = IFNULL(?, status) WHERE id = '${id}'; `
    //     conn.promise().query(sql, [price, description, plan, dateEnd ? new Date(dateEnd) : null, status])
    //         .then(() => {
    //             if (status === 'Đang thực hiện') {
    //                 const dateEnd = new Date(dateEnd);
    //                 var day = 60 * 60 * 24 * 1000;
    //                 const date = new Date(dateEnd.getTime() + day);
    //                 const job = schedule.scheduleJob(date, () => blockJob(jobId));

    //                 // Save schedule in db
    //                 const sql = "INSERT INTO schedule (id, date, type, jobId) VALUES (?, ?, ?, ?)"
    //                 conn.promise().query(sql, [crypto.randomUUID(), date, 'blockJob', jobId])
    //                     .then(() => console.log('Saved schedule'))
    //             }
    //             res.json({ message: 'Thay đổi chào giá thành công' })
    //         })
    //         .catch((err) => console.log(err));
    // }

    async delete(req, res, next) {
        await OfferServices.delete({
            offerId: req.params.id,
            userId: req.user.id
        })

        return NoContent.create().send(res)
    }
}

module.exports = new OfferController;