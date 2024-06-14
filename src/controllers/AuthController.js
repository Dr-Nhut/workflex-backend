const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv/config');
const { User, Category, Skill, sequelize } = require('../../models');
const { config } = require("dotenv");

const conn = require('../config/db.config')
const mailer = require('../utils/mailer');
const AppError = require('../utils/errorHandler');
const sequelizeErrorHandler = require('../utils/sequelizeErrorHandler');


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

    async registerUser(req, res, next) {
        const { name, email, password, passwordConfirm, address, role, sex, bankAccount, phone, categories, dataOfBirth, experience, skills } = req.body;

        if (password !== passwordConfirm) {
            next(new AppError('Mật khẩu không khớp!!!', 400))
        }

        const transaction = await sequelize.transaction();
        try {
            const avatar = sex ? 'avatar-default/avatar-man.png' : 'avatar-default/avatar-woman.png'
            const newUser = await User.create({
                name, email, password, address, role, avatar, sex, bankAccount, phone, dataOfBirth, experience
            }, {
                transaction
            });

            await newUser.addCategories(categories, {
                transaction
            });

            if (role === 'fre') {
                await newUser.addSkills(skills, {
                    transaction
                });
            };

            await newUser.reload({ include: [Category, Skill], transaction });
            transaction.commit();

            const token = await jwt.sign({ id: newUser.id }, process.env.JWT_SECRET_KEY, { expiresIn: process.env.JWT_SECRET_EXPIRATION });

            res.status(200).json({
                status: 'success',
                message: 'Đăng ký tài khoản thành công!!!',
                token,
                data: newUser,
            })
        }
        catch (err) {
            await transaction.rollback();
            sequelizeErrorHandler(err, next);
        }
    }

    registerFreelancer(req, res, next) {
        const { dataOfBirth, experience, skills } = req.body;
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

    login(req, res, next) {
        const { email, password } = req.body;
        const sql = `SELECT * FROM user WHERE email=('${email.trim()}');`;
        conn.promise().query(sql)
            .then(async ([rows, fields]) => {
                if (rows[0]) {
                    const match = await bcrypt.compare(password, rows[0].password);
                    if (!match) {
                        return res.json({
                            status: "error",
                            message: "Tài khoản hoặc mật khẩu không đúng",
                        });
                    }
                    const token = jwt.sign(
                        {
                            userId: rows[0].id
                        },
                        process.env.JWT_KEY,
                        { expiresIn: "365d" }
                    );
                    if (rows[0].status === 1) {
                        res.json({
                            status: 'error',
                            message: 'Tài khoản của bạn đang bị khóa'
                        })
                    }
                    else {
                        const user = {
                            id: rows[0].id,
                            fullname: rows[0].fullname,
                            email: rows[0].email,
                            avatar: rows[0].avatar,
                            role: rows[0].role,
                            address: rows[0].address,
                        }
                        res.json({
                            status: 'success',
                            user,
                            token,
                        });
                    }
                }
                else {
                    return res.json({
                        status: "error",
                        message: "Tài khoản hoặc mật khẩu không đúng",
                    });
                }
            })
            .catch((e) => console.error(e));
    }

    getUser(req, res) {
        const token = req.cookies.token;

        jwt.verify(token, process.env.JWT_KEY, (err, decoded) => {
            if (err) res.status(404).send('Invalid token');
            if (decoded) {
                const sql = `SELECT id, fullname, avatar, email, role, address FROM user WHERE id='${decoded.userId}';`;
                conn.promise().query(sql)
                    .then(([rows, fields]) => res.json(rows[0]))
                    .catch(err => console.log(err))
            }
        });
    }

    getUserId(req, res, next) {
        const token = req.cookies.token;
        jwt.verify(token, process.env.JWT_KEY, (err, decoded) => {
            if (err) res.status(404).send('Invalid token');
            if (decoded) {
                const sql = `SELECT id FROM user WHERE id='${decoded.userId}';`;
                conn.promise().query(sql)
                    .then(([rows, fields]) => {
                        console.log(rows);
                        req.userId = rows[0].id;
                        next();
                    })
                    .catch(err => console.log(err))
            }
        });
    }
}

module.exports = new AuthController;