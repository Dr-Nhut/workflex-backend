const crypto = require('crypto');
const conn = require('../config/db.config');

class ContractController {
    createContract(req, res) {
        const { employerId, offerId } = req.body;

        console.log(employerId, offerId);

        const contractId = crypto.randomUUID();

        const sql = "INSERT INTO contract (id, employerId, offerId, signingDate) VALUES(?, ?, ?, ?)";
        conn.promise().query(sql, [contractId, employerId, offerId, new Date()])
            .then(() => {
                res.json({ status: 'success', message: 'Tạo hợp đồng thành công!' });
            })
            .catch(err => console.error(err));
    }

    getContractByOffer(req, res) {
        const offerId = req.query.offerId;
        const sql = `SELECT * FROM contract WHERE offerId='${offerId}'`
        conn.promise().query(sql)
            .then(([rows, fields]) => res.json(rows[0]))
            .catch((err => console.error(err)));
    }
}

module.exports = new ContractController;