const crypto = require('crypto');
const conn = require('../config/db.config')

class OfferController {
    createOffer(req, res, next) {
        const { price, dateEnd, description, plan, jobId, freelancerId } = req.body;

        const offerId = crypto.randomUUID();

        const sql = "INSERT INTO offer (id, price, dateEnd, description, plan, jobId, freelancerId, status, createAt) VALUES(?, ?, ?, ? , ?, ?, ?, ?)";
        conn.promise().query(sql, [offerId, price, new Date(dateEnd), description, plan, jobId, freelancerId, 'Đang duyệt', new Date()])
            .then(() => {
                res.json({ status: 'success', message: 'Gửi báo giá thành công!' });
            })
            .catch(err => console.error(err));
    }

    getOffersJob(req, res) {
        const id = req.query.id;
        conn.promise().query(`SELECT offer.id, offer.price, offer.description, offer.plan, offer.dateEnd, offer.jobId, offer.freelancerId, offer.status, offer.createAt, user.fullname, user.email, user.avatar FROM offer LEFT JOIN user ON offer.freelancerId = user.id WHERE jobId='${id}'`)
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
}

module.exports = new OfferController;