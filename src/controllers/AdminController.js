const conn = require('../config/db.config')
const schedule = require('node-schedule');

class AdminController {
    approvalJob(req, res, next) {
        const id = req.params.id;
        const { approval, bidDeadline } = req.body;
        const sql = `UPDATE job SET status='${approval ? 3 : 2}' ${approval ? '' : `,reasonRefused='${req.body.reasonRefused}'`
            }  WHERE id='${id}';`

        conn.promise().query(sql)
            .then(() => {
                if (approval) {
                    const date = new Date(bidDeadline);
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
}

module.exports = new AdminController;