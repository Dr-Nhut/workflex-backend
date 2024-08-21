const crypto = require('crypto');
const conn = require('../config/db.config');
const { Created, OK, NoContent } = require('../core/success.reponse');
const FeedbackServices = require('../services/feedback.services');

class FeedbackController {
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

    async getByUser(req, res) {
        const feedbacks = await FeedbackServices.getByUserId({ userId: req.user.id });
        return OK.create({
            message: 'success',
            metadata: {
                length: feedbacks.length,
                data: feedbacks
            }
        }).send(res)
    }

    async create(req, res) {
        return Created.create({
            message: 'Create feedback successfully',
            metadata: await FeedbackServices.create({
                feedbackData: req.body,
                jobId: req.body.jobId,
                userId: req.user.id
            })
        }).send(res);
    }

    async update(req, res) {
        return OK.create({
            message: "Update feedback succesfully",
            metadata: await FeedbackServices.update({
                feedbackData: req.body,
                feedbackId: req.params.id,
                userId: req.user.id
            })
        }).send(res)
    }

    async delete(req, res) {
        await FeedbackServices.delete({
            feedbackId: req.params.id,
            userId: req.user.id
        });
        return NoContent.create().send(res)
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

module.exports = new FeedbackController;