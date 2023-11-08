const conn = require('../config/db.config')
const schedule = require('node-schedule');
const { all } = require('../routes/admin.route');
require('dotenv').config()

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
                    const job = schedule.scheduleJob(date, function () {
                        console.log('Khoá chào giá');
                        const sql = `UPDATE job SET status=4 WHERE id='${id}';`
                        conn.promise().query(sql)
                            .then(() => res.json({ message: 'Đã khóa chào giá' }))
                            .catch((err) => console.log(err));
                    });
                }
                res.json({ message: `${approval ? 'Đã xét duyệt công việc' : 'Đã từ chối công việc'}`, type: `${approval ? 'approval' : 'refused'}` })
            })
            .catch((err) => console.log(err));
    }

    checkSchedule(req, res) {
        // Lấy danh sách tất cả lịch trình đã tạo
        const allJobs = schedule.scheduledJobs;

        // Lặp qua danh sách lịch trình và in ra thông tin lịch trình
        for (let jobName in allJobs) {
            if (allJobs.hasOwnProperty(jobName)) {
                const job = allJobs[jobName];
                console.log(`Tên lịch trình: ${job.name}`);
                console.log(`Lịch trình: ${job.spec}`);
                console.log(`Thời gian được lên lịch: ${job.nextInvocation()}`);
                console.log('-------------------------');
            }
        }

        res.json({ message: 'check' })
    }
}

module.exports = new AdminController;