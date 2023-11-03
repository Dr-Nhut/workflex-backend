const crypto = require('crypto');
const conn = require('../config/db.config');
const { response } = require('express');
const { fields } = require('../config/upload.config');

class RecommendationController {
    getFreelancerForNewJob(req, res) {
        // 1. Get all freelancer of category job
        const categoryId = req.query.categoryId;
        const sql = `SELECT user.id as userId, user.fullname FROM usercategory LEFT JOIN user ON usercategory.userId=user.id WHERE categoryId='${categoryId}' AND user.role='fre'`;

        conn.promise().query(sql)
            // 2. Get scores for freelancer
            .then(async ([rows, fields]) => {
                return Promise.all(rows.map((row) => {
                    const sql = `SELECT offer.freelancerId, job.id, job.status FROM offer LEFT JOIN job ON offer.jobId=job.id WHERE offer.freelancerId='${row.userId}' AND offer.status='Đang thực hiện'`
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
                            status: item.status
                        }))
                    })
                })


                return Promise.all(req.result.map((listJobOfFreelancer) => {

                    const sql = `SELECT stars FROM evaluation WHERE userId!='${listJobOfFreelancer.freelancerId}' AND (${listJobOfFreelancer.job.map(item => `jobId='${item.id}'`).join(' OR ')})`

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
                // 3. Get top 10 freelancer 
                req.result = req.result.filter(item => item.score)
                console.log(req.result.sort((a, b) => b.score - a.score));

                res.json(req.result.slice(0.10))

            })
            .catch(err => console.error(err));
    }
}

module.exports = new RecommendationController;