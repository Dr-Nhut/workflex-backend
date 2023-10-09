const crypto = require('crypto');

const bcrypt = require('bcrypt');

const conn = require('../database');

class AuthController {
    checkUserExisted(req, res, next) {
        const { email } = req.body;
        conn.promise().query(`SELECT id FROM user WHERE email = ${email};`)
            .then(([rows, fields]) => {
                if (!rows[0]?.id) next();
                else res.send({ message: 'Email đã tồn tại' })
            })
            .catch(err => console.error(err));
    }

    registerUser(req, res, next) {
        const { fullname, email, password, address, role } = req.body;
        bcrypt.hash(password, 10)
            .then(hash => {
                const sql = "INSERT INTO user (id, fullname, email, password, address, role) VALUES(?, ?, ?, ?, ?, ?)";
                const id = crypto.randomUUID();
                conn.promise().query(sql, [id, fullname.trim(), email, hash, address, role])
                    .then(() => {
                        if (role === 'fre') {
                            req.userId = id;
                            next();
                        }
                        else res.send({ message: 'Đăng ký tài khoản thành công' });
                    })
                    .catch(err => console.error(err));
            })
            .catch((e) => console.error(e));
    }

    registerFreelancer(req, res, next) {
        const { dateofbirth } = req.body;
        const sql = "INSERT INTO freelancer (userId, dateofbirth) VALUES(?, ?)";
        conn.promise().query(sql, [req.userId, dateofbirth])
            .then(() => {
                res.send({ message: 'Đăng ký tài khoản thành công' });
            })
            .catch(err => console.error(err));
    }
}

module.exports = new AuthController;