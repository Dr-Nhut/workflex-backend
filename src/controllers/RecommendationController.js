const crypto = require('crypto');
const conn = require('../config/db.config');
const { response } = require('express');
const { fields } = require('../config/upload.config');
const { fileURLToPath } = require('url');

class RecommendationController {
    getFreelancerForNewJob(req, res) {
        // 1. Get all freelancer of category job
        const categoryId = req.query.categoryId;
        const sql = `SELECT user.id as userId, user.fullname FROM usercategory LEFT JOIN user ON usercategory.userId=user.id WHERE categoryId='${categoryId}' AND user.role='fre'`;

        conn.promise().query(sql)
            // 2. Get scores for freelancer
            .then(async ([rows, fields]) => {
                return Promise.all(rows.map((row) => {
                    const sql = `SELECT offer.freelancerId, job.id, job.status, job.employerId FROM offer LEFT JOIN job ON offer.jobId=job.id WHERE offer.freelancerId='${row.userId}' AND offer.status='Đang thực hiện'`
                    return conn.promise().query(sql)
                }))
            })
            .then((response) => {
                const listJobOfFreelancers = response.map((element) => element[0])
                req.result = []; //array freelancerId and job status array
                listJobOfFreelancers.forEach((job) => {
                    if (job.length > 0) req.result.push({
                        freelancerId: job.at(0).freelancerId,
                        job: job.map(item => ({
                            id: item.id,
                            status: item.status,
                            employerId: item.employerId
                        }))
                    })
                })

                return Promise.all(req.result.map((listJobOfFreelancer) => {

                    const sql = `SELECT stars FROM evaluation WHERE senderId!='${listJobOfFreelancer.freelancerId}' AND (${listJobOfFreelancer.job.map(item => `jobId='${item.id}'`).join(' OR ')})`

                    return conn.promise().query(sql)
                }))
            })
            .then((response) => {
                response.map((element, index) => {
                    const sumStars = element[0].reduce((value, current) => value + current.stars, 0);
                    const averageStars = sumStars / element[0].length;
                    const numCompletedJobs = req.result.at(index).job.filter(item => item.status >= 6).length

                    req.result.at(index).score = numCompletedJobs * averageStars - (req.result.at(index).job.length - numCompletedJobs) * 5;
                });

                // 3. Rehired
                req.result = req.result.filter(item => item.score)

                req.result.map(item => {
                    const jobs = item.job;
                    let duplicate = 0
                    const arr = jobs.filter((job, index) => {
                        const findElement = [...jobs]
                            .slice(0, index)
                            .filter((item) => item.employerId === job.employerId)

                        if (findElement.length === 0) return job
                        else {
                            duplicate += findElement.length
                        }
                    })

                    item.score += item.score * (duplicate / arr.length)
                    return item
                })

                // 4.Get top 10 freelancer
                req.result.sort((a, b) => b.score - a.score)

                req.result = req.result.map((item) => ({ freelancerId: item.freelancerId, score: item.score }))

                res.json(req.result.slice(0.10))

            })
            .catch(err => console.error(err));
    }

    getJobsThroughOfferForFreelancer(req, res, next) {
        const userId = req.userId;
        req.result = [];

        // Get jobs offer
        const sql = `SELECT jobId FROM offer WHERE freelancerId='${userId}' AND status='Đang duyệt'`

        conn.promise().query(sql)
            .then(([rows, fields]) => {
                //job dang chao gia
                req.biddingJobs = rows;
                return rows
            })
            .then(() => {
                const sql = `SELECT usercategory.categoryId FROM usercategory LEFT JOIN category ON category.id=usercategory.categoryId WHERE userId='${userId}'`;
                return conn.promise().query(sql)
            })
            .then(([rows, fields]) => {
                req.categories = rows.map(item => item.categoryId);
                if (req.biddingJobs.length > 0) {
                    const sql = `SELECT DISTINCT freelancerId FROM offer WHERE (${req.biddingJobs.length.map(item => `jobId='${item.jobId}'`).join(' OR ')}) AND freelancerId!='${userId}'`

                    return conn.promise().query(sql)
                }
                else {
                    return new Promise((resolve, reject) => reject());
                }
            })
            .then(([rows, fields]) => {
                // ds user cung chao gia
                const sql = `SELECT jobId FROM offer WHERE status='Đang duyệt' AND (${rows.map(row => `freelancerId='${row.freelancerId}'`).join(' OR ')}) AND (${req.biddingJobs.map(job => `jobId!='${job.jobId}'`).join(' AND ')})`

                return conn.promise().query(sql)
            })
            .then(([rows, fields]) => {
                req.biddingList = rows;
                const sql = `SELECT * FROM job WHERE ${req.biddingList.map(job => `id='${job.jobId}'`).join(' OR ')}`

                return conn.promise().query(sql)
            })
            .then(([rows, fields]) => {
                const similarJobs = rows.filter(item => req.categories.includes(item.categoryId))

                const newSimilarJobs = similarJobs.map(item => item.id)

                const result = [];
                newSimilarJobs.forEach((job, index) => {
                    const isAppear = [...newSimilarJobs].slice(0, index).filter(item => item === job).length > 0

                    if (!isAppear) {
                        result.push({ job, number: newSimilarJobs.filter(item => item === job).length })
                    }
                })
                const newResult = result.sort((a, b) => a.number - b.number).slice(0, 10)
                console.log('recommendation1: ', newResult);
                if (newResult.length === 10) {
                    res.json(newResult.map(item => item.job))
                }
                else {

                    req.result = newResult.map(item => item.job)
                    next();
                }
            })
            .catch(() => next());
    }

    getJobsThroughCategory(req, res, next) {
        console.log('result: ', req.result);
        const LIMIT = 10 - req.result.length;
        const sql = `SELECT job.id, COUNT(offer.id) FROM offer LEFT JOIN job ON offer.jobId=job.id WHERE job.status=3 ${req.biddingJobs.length > 0 ? `AND (${req.biddingJobs.map(item => `job.id!='${item.jobId}'`).join(' AND ')})` : ''} AND (${req.categories.map(category => `job.categoryId='${category}'`).join(' OR ')}) GROUP BY job.id ORDER BY COUNT(offer.id) DESC;`

        console.log(sql);

        conn.promise().query(sql)
            .then(([rows, fields]) => {
                console.log('recommendation2: ', rows)
                const idRows = rows.map(row => row.id)
                const newRows = idRows.filter(id => !req.result.includes(id)).slice(0, LIMIT)
                req.result = [...req.result, ...newRows];
                if (req.result.length > 0) {
                    const sql = `SELECT id, name, maxBudget FROM job WHERE ${req.result.map(id => `id='${id}'`).join(' OR ')}`
                    console.log(sql);
                    conn.promise().query(sql)
                        .then(([rows, fields]) => {
                            res.json(rows)
                        })
                }
                else {
                    next()
                }
            })
            .catch(err => console.log(err))
    }

    getNewJobs(req, res) {
        const sql = "SELECT id, name, maxBudget FROM job ORDER BY createAt LIMIT 10"
        conn.promise().query(sql)
            .then(([rows, fields]) => {
                res.json(rows)
            })
            .catch(err => console.log(err))
    }
}

module.exports = new RecommendationController;