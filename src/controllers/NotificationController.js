const crypto = require('crypto');
const conn = require('../config/db.config')

class NotificationController {
    create(req, res) {
        const { senderId, receiverId, type, description } = req.body;
        const id = crypto.randomUUID();

        const sql = 'INSERT INTO notification VALUES(?,?,?,?,?, ?, ?);';
        conn.promise().query(sql, [id, senderId, receiverId, type, description, 0, new Date()])
            .then(response => {
                res.json({ message: 'Lưu thông báo thành công' })
            })
            .catch(err => console.log(err))
    }

    getNotifications(req, res) {
        const receiverId = req.params.userId;
        const sql = `SELECT * FROM notification WHERE receiverId='${receiverId}' ORDER BY createdAt DESC`;
        conn.promise().query(sql)
            .then(([rows, fields]) => {
                res.json(rows)
            })
            .catch(err => console.log(err))
    }

    update(req, res) {
        const id = req.params.id;
        const sql = `UPDATE notification SET seen = 1 WHERE id='${id}';`
        conn.promise().query(sql)
            .then(() => res.json({ message: 'Đã xem thông báo' }))
            .catch((err) => console.log(err));
    }
}

module.exports = new NotificationController;