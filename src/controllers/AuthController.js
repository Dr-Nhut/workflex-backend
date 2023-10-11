const crypto = require('crypto');

const bcrypt = require('bcrypt');

const conn = require('../config/db.config')
const mailer = require('../utils/mailer');

class AuthController {
    checkUserExisted(req, res, next) {
        conn.promise().query(`SELECT id FROM user WHERE email = '${req.body.email}';`)
            .then(([rows, fields]) => {
                if (!rows[0]?.id) next();
                else res.status(404).json({ message: 'Email đã tồn tại' });
            })
            .catch(err => console.error(err));
    }

    sendEmail(req, res) {
        const { email } = req.body;
        bcrypt.hash(email, 10)
            .then(hash => {
                mailer.sendMail('leminhnhut1612@gmail.com', "Xác thực email đăng ký tài khoản Workflex", `<p>Vui lòng nhấn vào đường dẫn đính kèm để xác thực email của bạn, <a href="${process.env.APP_FE_URL}/verify-email?email=${email}&token=${hash}">Chính là tôi</a ></p >`)

                res.send("Email đã được gửi đi");
            })
            .catch(err => console.log(err));
    }

    verifyEmail(req, res) {
        bcrypt.compare(req.query.email, req.query.token, (err, result) => {
            if (result === true) {
                if (!err) {
                    res.json({
                        status: 'success',
                        emailVerifiedAt: new Date().toLocaleString()
                    });
                }
                else res.json({ status: 'fail' })
            }
            else res.status(404).send('fail');
        })
    }

    registerUser(req, res, next) {
        const { fullname, email, password, address, role, emailVerifiedAt } = req.body;
        bcrypt.hash(password, 10)
            .then(hash => {
                req.id = crypto.randomUUID();
                const sql = "INSERT INTO user (id, fullname, email, password, address, role, email_verified_at) VALUES(?, ?, ?, ?, ?, ?, ?)";
                return conn.promise().query(sql, [req.id, fullname, email, hash, address, role, new Date(emailVerifiedAt)])
            })
            .then(() => {
                const { categories } = req.body;
                const sql = `INSERT INTO usercategory (userId, categoryId) VALUES ${categories.map(category => `('${req.id}', '${category}')`).join(',')}`;
                return conn.promise().query(sql)
            })
            .then(() => {
                if (req.body.role !== 'fre')
                    res.json({ message: 'Đăng ký tài khoản thành công' })
                else next();
            })
            .catch((e) => console.error(e));
    }

    registerFreelancer(req, res, next) {
        const { dataOfBirth, experience, skills } = req.body;
        console.log(req.body)
        const sql = `INSERT INTO freelancer (userId, dateofbirth, experience) VALUES(?, ?, ?);`;
        conn.promise().query(sql, [req.id, new Date(dataOfBirth), experience.label])
            .then(() => {
                const { skills } = req.body;
                const sql = `INSERT INTO freelancerSkill (freelancerId, skillId) VALUES ${skills.map(skill => `('${req.id}', '${skill}')`).join(',')}`;
                return conn.promise().query(sql)
            })
            .then(() => {
                res.json({ message: 'Đăng ký tài khoản thành công' })

            })
            .catch((e) => console.error(e));
    }
}

module.exports = new AuthController;