const crypto = require('crypto');
const conn = require('../config/db.config');
const JobServices = require('../services/job.services');
const { Created, OK, NoContent } = require('../core/success.reponse')

class JobController {
    getJobByStatus(req, res, next) {
        const status = req.query.status;
        const sql = `SELECT job.id, job.name, job.maxBudget, job.bidDeadline, job.createAt, category.name as category, user.email as employerEmail FROM job LEFT JOIN category ON job.categoryId=category.id LEFT JOIN user ON job.employerId=user.id WHERE job.status='${status}';`;
        conn.promise().query(sql)
            .then(([rows, fields]) => {
                res.send(rows);
            })
            .catch(err => console.error(err));
    }

    getEmployerJob(req, res, next) {
        const { employerId, status, comparison } = req.query;

        const sql = `SELECT job.id, job.name, job.description, job.maxBudget, job.bidDeadline, job.createAt, job.dateStart, job.duration, job.type, job.experience, job.status, job.completedAt,job.employerId, category.name as category, user.email, user.fullname, user.avatar FROM job LEFT JOIN category ON job.categoryId=category.id LEFT JOIN user ON job.employerId=user.id WHERE job.status${comparison}${status} AND job.employerId='${employerId}';`;


        conn.promise().query(sql)
            .then(([rows, fields]) => {
                res.send(rows);
            })
            .catch(err => console.error(err));
    }

    getFreelancerJob(req, res) {
        const { freelancerId, status, comparison } = req.query;

        const sql = `SELECT job.id, job.name, job.description, job.maxBudget, job.bidDeadline, job.createAt, job.duration, job.dateStart, job.type, job.experience, job.status, job.completedAt, job.employerId, category.name as category FROM job LEFT JOIN category ON job.categoryId=category.id LEFT JOIN offer ON offer.jobId=job.id WHERE offer.freelancerId='${freelancerId}' AND offer.status="Đang thực hiện" AND job.status${comparison}${status};`;

        conn.promise().query(sql)
            .then(([rows, fields]) => {
                res.send(rows);
            })
            .catch(err => console.error(err));
    }

    getFreelancerCompletedAndFailJob(req, res) {
        const { freelancerId } = req.query;

        const sql = `SELECT job.id, job.name, job.description, job.maxBudget, job.bidDeadline, job.createAt, job.dateStart, job.duration, job.type, job.employerId, job.experience, job.status, job.completedAt, category.name as category FROM job LEFT JOIN category ON job.categoryId=category.id LEFT JOIN offer ON offer.jobId=job.id WHERE offer.freelancerId='${freelancerId}' AND offer.status="Đang thực hiện" AND (job.status >= 6 OR job.status = 0);`;

        conn.promise().query(sql)
            .then(([rows, fields]) => {
                res.send(rows);
            })
            .catch(err => console.error(err));
    }

    getFreelancerCurrentAndFailJob(req, res) {
        const { freelancerId } = req.query;

        const sql = `SELECT job.id, job.name, job.description, job.maxBudget, job.bidDeadline, job.createAt, job.duration, job.type, job.experience, job.status, job.completedAt, category.name as category, user.id as employerId FROM job LEFT JOIN user ON job.employerId = user.id LEFT JOIN category ON job.categoryId=category.id LEFT JOIN offer ON offer.jobId=job.id WHERE offer.freelancerId='${freelancerId}' AND offer.status="Đang thực hiện" AND (job.status >= 5 OR job.status = 0);`;

        conn.promise().query(sql)
            .then(([rows, fields]) => {
                res.send(rows);
            })
            .catch(err => console.error(err));
    }


    getPendingJob(req, res) {
        const sql = "SELECT job.id, job.name, job.maxBudget, job.bidDeadline, job.createAt, category.name as category, user.email FROM job LEFT JOIN category ON job.categoryId=category.id LEFT JOIN user ON job.employerId=user.id WHERE job.status=1;";
        conn.promise().query(sql)
            .then(([rows, fields]) => {
                res.send(rows);
            })
            .catch(err => console.error(err));
    }

    getBiddingJob(req, res) {
        const { budget, category, q = '' } = req.query

        const sql = `SELECT job.id, job.name, job.description, job.maxBudget, job.bidDeadline, job.createAt, job.duration, job.type, job.experience, category.name as category, user.id as employerId, user.email, user.fullname, user.avatar FROM job LEFT JOIN category ON job.categoryId=category.id LEFT JOIN user ON job.employerId=user.id WHERE job.status=3 ${budget ? `AND job.maxBudget <= ${+budget}` : ''} ${category ? Array.isArray(category) ? `AND (${category.map(item => `category.id='${item}'`).join(' OR ')})` : `AND category.id='${category}'` : ''} ORDER BY createAt DESC;`

        conn.promise().query(sql)
            .then(([rows, fields]) => {
                if (q) {
                    rows = rows.filter(row => row.name.includes(q));
                }
                res.send(rows);
            })
            .catch(err => console.error(err));
    }

    getBiddingAndLockingJob(req, res) {
        const employerId = req.query.id;
        const sql = `SELECT job.id, job.name, job.description, job.maxBudget, job.bidDeadline, job.createAt, job.duration, job.type, job.experience, job.status, category.name as category, user.email, user.fullname, user.avatar FROM job LEFT JOIN category ON job.categoryId=category.id LEFT JOIN user ON job.employerId=user.id WHERE (job.status=3 OR job.status=4) AND job.employerId='${employerId}';`;
        conn.promise().query(sql)
            .then(([rows, fields]) => {
                res.send(rows);
            })
            .catch(err => console.error(err));
    }

    getRefusedJob(req, res) {
        const sql = "SELECT job.id, job.name, job.maxBudget, job.bidDeadline, job.createAt, job.duration, category.name as category, user.email FROM job LEFT JOIN category ON job.categoryId=category.id LEFT JOIN user ON job.employerId=user.id WHERE job.status=2;";
        conn.promise().query(sql)
            .then(([rows, fields]) => {
                res.send(rows);
            })
            .catch(err => console.error(err));
    }

    async getAll(req, res, next) {
        const jobs = await JobServices.getAll();
        return OK.create({
            message: "Success",
            result: jobs.length,
            metadata: jobs
        }).send(res);
    }

    async getById(req, res, next) {
        return OK.create({
            message: "Success",
            metadata: await JobServices.getById(req.params.id)
        }).send(res);
    }

    async create(req, res, next) {

        return Created.create({
            message: 'Job created successfully!',
            metadata: await JobServices.create(req.body, req.user.id)
        }).send(res);
    }

    getDetailJob(req, res) {
        const id = req.params.id;
        const sql = `SELECT job.id, job.name, job.description, job.maxBudget, job.experience, job.duration, job.bidDeadline, job.dateStart, job.type, job.status, job.createAt, job.reasonRefused, category.name as category, category.id as categoryId, user.id as employerId, user.fullname, user.avatar, user.email FROM job LEFT JOIN category ON job.categoryId=category.id LEFT JOIN user ON job.employerId=user.id WHERE job.id='${id}';`;
        conn.promise().query(sql)
            .then(([rows, fields]) => {
                req.result = rows[0];
                return conn.promise().query(`SELECT skill.name FROM skilljob LEFT JOIN skill ON skilljob.skillId=skill.id WHERE skilljob.jobId='${id}';`)
            })
            .then(([rows, fields]) => {
                res.send({ ...req.result, skills: rows.map(row => row.name) });
            })
            .catch((err) => console.log(err));
    }

    async update(req, res, next) {
        return OK.create({
            message: await JobServices.update({ job: req.body, jobId: req.params.id, creatorId: req.user.id }) ? 'Update successfully' : "Don't update"
        }).send(res)
    }

    async delete(req, res, next) {
        await JobServices.delete({
            jobId: req.params.id, creatorId: req.user.id
        })
        return NoContent.create().send(res);
    }
}
module.exports = new JobController;