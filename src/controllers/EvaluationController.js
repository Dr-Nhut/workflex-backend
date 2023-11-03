const crypto = require('crypto');
const conn = require('../config/db.config')

class EvaluationController {
    getEvaluation(req, res) {
        const jobId = req.params.jobId;
        console.log(jobId, req.userId);

        const sql = `SELECT * from evaluation WHERE jobId='${jobId}' AND userId='${req.userId}'`;
        conn.promise().query(sql)
            .then(([rows, fields]) => {
                res.json(rows[0])
            })
            .catch(err => console.log(err))
    }

    getAllEvaluationByUser(req, res) {
        const userId = req.params.userId;

        const sql = `SELECT * from evaluation WHERE userId='${userId}'`;
        conn.promise().query(sql)
            .then(([rows, fields]) => {
                res.json(rows)
            })
            .catch(err => console.log(err))
    }

    createEvaluation(req, res) {
        const jobId = req.params.jobId;
        const { stars, comment } = req.body;
        const id = crypto.randomUUID();
        console.log(req.userId);

        const sql = 'INSERT INTO evaluation VALUES(?,?,?,?, ?);';
        conn.promise().query(sql, [id, jobId, stars, comment, req.userId])
            .then(response => {
                res.json({ message: 'Gửi nhận xét thành công' })
            })
            .catch(err => console.log(err))
    }

    checkCompleted(req, res) {
        const jobId = req.params.jobId;

        const sql = `SELECT * from evaluation WHERE jobId='${jobId}'`;
        conn.promise().query(sql)
            .then(([rows, fields]) => {
                if (rows.length === 2) res.json({ result: true })
                else res.json({ result: false });
            })
            .catch(err => console.log(err))
    }
}

module.exports = new EvaluationController;