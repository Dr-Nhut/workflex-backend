const conn = require('../config/db.config')
const schedule = require('node-schedule');
require('dotenv').config()
const crypto = require('crypto');
const { blockBidding } = require('../utils/schedule');

class AdminController {
    approvalJob(req, res, next) {
        const id = req.params.id;
        const { approval, bidDeadline } = req.body;
        const sql = `UPDATE job SET status='${approval ? 3 : 2}' ${approval ? '' : `,reasonRefused='${req.body.reasonRefused}'`
            }  WHERE id='${id}';`

        conn.promise().query(sql)
            .then(() => {
                if (approval) {
                    var bidDeadlineDate = new Date(bidDeadline);

                    var day = 60 * 60 * 24 * 1000;

                    const date = new Date(bidDeadlineDate.getTime() + day)

                    const job = schedule.scheduleJob(date, () => blockBidding(id));

                    // Save schedule in db
                    const sql = "INSERT INTO schedule (id, date, type, jobId) VALUES (?, ?, ?, ?)"
                    conn.promise().query(sql, [crypto.randomUUID(), date, 'blockBidding', id])
                        .then(() => console.log('Saved schedule'))
                }
                res.json({ message: `${approval ? 'Đã xét duyệt công việc' : 'Đã từ chối công việc'}`, type: `${approval ? 'approval' : 'refused'}` })
            })
            .catch((err) => console.log(err));
    }

    checkSchedule(req, res) {
        // Lấy danh sách tất cả lịch trình đã tạo
        const allJobs = schedule.scheduledJobs;

        // Lặp qua danh sách lịch trình và in ra thông tin lịch trình
        const result = []
        for (let jobName in allJobs) {
            if (allJobs.hasOwnProperty(jobName)) {
                const job = allJobs[jobName];
                result.push({ name: job.name, datetime: job.nextInvocation() })
                // console.log(`Tên lịch trình: ${job.name} `);
                // console.log(`Thời gian được lên lịch: ${job.nextInvocation()} `);
                // console.log('-------------------------');
            }
        }

        res.json(result)
    }

    blockAccount(req, res, next) {
        const userId = req.params.id;
        const status = req.body.status;

        const sql = `UPDATE user SET status=${status} WHERE id='${userId}';`
        conn.promise().query(sql)
            .then(() => res.json({ message: 'Thông tin user đã được thay đổi' }))
            .catch((err) => console.log(err));
    }
}

module.exports = new AdminController;