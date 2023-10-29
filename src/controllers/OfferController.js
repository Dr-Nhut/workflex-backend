const crypto = require('crypto');
const conn = require('../config/db.config')

class OfferController {
    createOffer(req, res, next) {
        const { price, dateEnd, description, plan, jobId, freelancerId } = req.body;

        const offerId = crypto.randomUUID();

        const sql = "INSERT INTO offer (id, price, dateEnd, description, plan, jobId, freelancerId, status, createAt) VALUES(?, ?, ?, ? , ?, ?, ?, ?, ?)";
        conn.promise().query(sql, [offerId, price, new Date(dateEnd), description, plan, jobId, freelancerId, 'Đang duyệt', new Date()])
            .then(() => {
                res.json({ status: 'success', message: 'Gửi báo giá thành công!' });
            })
            .catch(err => console.error(err));
    }

    getOffersJob(req, res) {
        const id = req.query.id;
        conn.promise().query(`SELECT offer.id, offer.price, offer.description, offer.plan, offer.dateEnd, offer.jobId, offer.freelancerId, offer.status, offer.createAt, user.fullname, user.email as freelancerEmail, user.avatar FROM offer LEFT JOIN user ON offer.freelancerId = user.id WHERE jobId='${id}'`)
            .then(([rows, fields]) => res.json(rows))
            .catch((err => console.error(err)));
    }

    getOffersByFreelancer(req, res) {
        const id = req.query.id;
        const sql = `SELECT offer.id, offer.price, offer.description, offer.plan, offer.dateEnd, offer.status, offer.jobId, offer.freelancerId, job.name as jobName, job.maxBudget, category.name as categoryName FROM offer LEFT JOIN job ON offer.jobId=job.id LEFT JOIN category ON job.categoryId=category.id WHERE offer.freelancerId='${id}' AND offer.status='Đang duyệt'`
        conn.promise().query(sql)
            .then(([rows, fields]) => res.json(rows))
            .catch((err => console.error(err)));
    }

    getProcessingOffer(req, res, next) {
        const jobId = req.query.jobId;

        const sql = `SELECT offer.id, offer.price, offer.description, offer.plan, offer.dateEnd, offer.status, offer.jobId, offer.freelancerId, user.fullname, user.avatar, user.email as freelancerEmail FROM offer LEFT JOIN user ON offer.freelancerId=user.id WHERE offer.jobId='${jobId}' AND offer.status='Đang thực hiện'`
        conn.promise().query(sql)
            .then(([rows, fields]) => res.json(rows[0]))
            .catch((err => console.error(err)));
    }

    update(req, res) {
        const id = req.params.id;
        const { price = null, description = null, plan = null, dateEnd = null, status = null } = req.body;

        const sql = `UPDATE offer SET price = IFNULL(?, price), description = IFNULL(?, description), plan = IFNULL(?, plan), dateEnd = IFNULL(?, dateEnd), status = IFNULL(?, status) WHERE id='${id}';`
        conn.promise().query(sql, [price, description, plan, dateEnd, status])
            .then(() => res.json({ message: 'Thay đổi chào giá thành công' }))
            .catch((err) => console.log(err));
    }
}

module.exports = new OfferController;