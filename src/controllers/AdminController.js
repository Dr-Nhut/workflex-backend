const conn = require('../config/db.config')

class AdminController {
    approvalJob(req, res, next) {
        const id = req.params.id;
        console.log(req.body);
        const approval = req.body.approval;
        const sql = `UPDATE job SET status='${approval ? 'Đang chào giá' : 'Từ chối'}' ${approval ? '' : `,reasonRefused='${req.body.reasonRefused}'`
            }  WHERE id='${id}';`

        conn.promise().query(sql)
            .then(() => res.json({ message: `${approval ? 'Đã xét duyệt công việc' : 'Đã từ chối công việc'} ` }))
            .catch((err) => console.log(err));
    }
}

module.exports = new AdminController;