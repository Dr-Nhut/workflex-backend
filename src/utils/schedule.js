const conn = require('../config/db.config')

require('dotenv/config')

module.exports.blockBidding = (id) => {
    console.log('Khoá chào giá');
    const sql = `UPDATE job SET status=4 WHERE id='${id}';`
    conn.promise().query(sql)
        .then(() => res.json({ message: 'Đã khóa chào giá' }))
        .catch((err) => console.log(err));
}

module.exports.blockJob = function (jobId) {
    console.log('Khoá công việc');
    const sql = `UPDATE job SET status=0 WHERE id='${jobId}';`
    conn.promise().query(sql)
        .then(() => res.json({ message: 'Đã thay đổi trạng thái công việc' }))
        .catch((err) => console.log(err));
}