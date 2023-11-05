const crypto = require('crypto');
const conn = require('../config/db.config')

class EvaluationController {
    getEvaluation(req, res) {
        const jobId = req.params.jobId;

        const sql = `SELECT * from evaluation WHERE jobId='${jobId}' AND senderId='${req.userId}'`;
        conn.promise().query(sql)
            .then(([rows, fields]) => {
                res.json(rows[0])
            })
            .catch(err => console.log(err))
    }

    getAllEvaluationByUser(req, res) {
        const userId = req.params.userId;

        const sql = `SELECT evaluation.id, evaluation.jobId, evaluation.stars, evaluation.comment, evaluation.createAt, user.fullname, user.avatar from evaluation LEFT JOIN user ON evaluation.senderId=user.id WHERE receiverId='${userId}'`;
        conn.promise().query(sql)
            .then(([rows, fields]) => {
                res.json(rows)
            })
            .catch(err => console.log(err))
    }

    createEvaluation(req, res) {
        const jobId = req.params.jobId;
        const { stars, comment, receiverId } = req.body;
        const id = crypto.randomUUID();
        console.log(req.userId);

        const sql = 'INSERT INTO evaluation VALUES(?,?,?,?,?,?,?);';
        conn.promise().query(sql, [id, jobId, stars, comment, req.userId, receiverId, new Date()])
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