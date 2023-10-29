const crypto = require('crypto');
const conn = require('../config/db.config');

class PaymentController {
    getPaymentByOffer(req, res) {
        const offerId = req.query.offerId;

        conn.promise().query(`SELECT payment.id, payment.total, payment.createdAt, payment.paymentIntent FROM payment LEFT JOIN contract ON payment.contractId = contract.id LEFT JOIN offer ON contract.offerId = offer.id WHERE offer.id='${offerId}'`)
            .then(([rows, fields]) => {
                res.json(rows[0])
            })
            .catch((err) => console.error(err));
    }
}

module.exports = new PaymentController;