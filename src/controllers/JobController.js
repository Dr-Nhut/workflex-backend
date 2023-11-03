const crypto = require('crypto');
const conn = require('../config/db.config')

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

        const sql = `SELECT job.id, job.name, job.description, job.maxBudget, job.bidDeadline, job.createAt, job.duration, job.type, job.experience, job.status, job.completedAt, category.name as category, user.email, user.fullname, user.avatar FROM job LEFT JOIN category ON job.categoryId=category.id LEFT JOIN user ON job.employerId=user.id WHERE job.status${comparison}${status} AND job.employerId='${employerId}';`;

        console.log('sql ', sql);

        conn.promise().query(sql)
            .then(([rows, fields]) => {
                res.send(rows);
            })
            .catch(err => console.error(err));
    }

    // getFreelancerJob(req, res) {
    //     const { freelancerId, status } = req.query;

    //     const sql = `SELECT job.id, job.name, job.description, job.maxBudget, job.bidDeadline, job.createAt, job.duration, job.type, job.experience, job.status, job.completedAt, category.name as category FROM job LEFT JOIN category ON job.categoryId=category.id LEFT JOIN offer ON offer.jobId=job.id WHERE offer.freelancerId='${freelancerId}' AND job.status=${status};`;

    //     conn.promise().query(sql)
    //         .then(([rows, fields]) => {
    //             res.send(rows);
    //         })
    //         .catch(err => console.error(err));
    // }


    getFreelancerJob(req, res) {
        const { freelancerId, status } = req.query;

        const sql = `SELECT job.id, job.name, job.description, job.maxBudget, job.bidDeadline, job.createAt, job.duration, job.type, job.experience, job.status, job.completedAt, category.name as category FROM job LEFT JOIN category ON job.categoryId=category.id LEFT JOIN offer ON offer.jobId=job.id WHERE offer.freelancerId='${freelancerId}' AND offer.status="Đang thực hiện" AND job.status=${status};`;

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
        const sql = "SELECT job.id, job.name, job.description, job.maxBudget, job.bidDeadline, job.createAt, job.duration, job.type, job.experience, category.name as category, user.email, user.fullname, user.avatar FROM job LEFT JOIN category ON job.categoryId=category.id LEFT JOIN user ON job.employerId=user.id WHERE job.status=3;";
        conn.promise().query(sql)
            .then(([rows, fields]) => {
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

    create(req, res, next) {
        const { employerId, name, description, categoryId, maxBudget, experience, duration, bidDeadline, dateStart, type, skills } = req.body;

        const jobId = crypto.randomUUID();

        const sql = "INSERT INTO job (id, name, description, categoryId, employerId, maxBudget, experience, duration, bidDeadline, dateStart, type, status, createAt ) VALUES(?, ?, ?, ? , ?, ?, ?, ?, ?, ?, ?, ?, ?)";
        const id = crypto.randomUUID();
        conn.promise().query(sql, [jobId, name, description, categoryId, employerId, maxBudget, experience, duration, new Date(bidDeadline), new Date(dateStart), type, 1, new Date()])
            .then(() => {
                if (!skills) res.json({ status: 'success', message: 'Đăng công việc thành công!' });
                const sql = `INSERT INTO skilljob (skillId, jobId) VALUES ${skills.map(skill => `('${skill}', '${jobId}')`).join(',')}`;
                return conn.promise().query(sql)
            })
            .then(() => {
                res.json({ status: 'success', message: 'Đăng công việc thành công!' });
            })
            .catch(err => console.error(err));
    }

    getDetailJob(req, res) {
        const id = req.params.id;
        const sql = `SELECT job.id, job.name, job.description, job.maxBudget, job.experience, job.duration, job.bidDeadline, job.dateStart, job.type, job.status, job.createAt, job.reasonRefused, category.name as category, user.id as employerId, user.fullname, user.avatar, user.email FROM job LEFT JOIN category ON job.categoryId=category.id LEFT JOIN user ON job.employerId=user.id WHERE job.id='${id}';`;
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

    update(req, res, next) {
        const id = req.params.id;
        const { name = null, description = null, categoryId = null, employerId = null, maxBudget = null, experience = null, duration = null, bidDeadline = null, dateStart = null, type = null, status = null, reasonRefused = null, completedAt = null } = req.body;

        const sql = `UPDATE job SET name = IFNULL(?, name), description = IFNULL(?, description), categoryId = IFNULL(?, categoryId), employerId = IFNULL(?, employerId), maxBudget = IFNULL(?, maxBudget), experience = IFNULL(?, experience), duration = IFNULL(?, duration), bidDeadline = IFNULL(?, bidDeadline), dateStart = IFNULL(?, dateStart), type = IFNULL(?, type), status = IFNULL(?, status), reasonRefused = IFNULL(?, reasonRefused), completedAt = IFNULL(?, completedAt) WHERE id='${id}';`
        conn.promise().query(sql, [name, description, categoryId, employerId, maxBudget, experience, duration, new Date(bidDeadline), new Date(dateStart), type, status, reasonRefused, new Date(completedAt)])
            .then(() => res.json({ message: 'Công việc đã được thay đổi' }))
            .catch((err) => console.log(err));
    }
}

module.exports = new JobController;