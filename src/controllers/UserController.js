const crypto = require('crypto');
const conn = require('../config/db.config');

class UserController {
    getInfor(req, res) {
        const userId = req.params.id;

        conn.promise().query(`SELECT fullname, avatar, email, role FROM user WHERE user.id='${userId}'`)
            .then(([rows, fields]) => {
                res.json(rows[0])
            })
            .catch((err) => console.error(err));
    }
}

module.exports = new UserController;