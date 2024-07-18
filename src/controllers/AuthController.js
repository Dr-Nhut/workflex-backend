const bcrypt = require('bcrypt');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
require('dotenv/config');
const { User, Category, Skill, sequelize } = require('../../models');
const conn = require('../config/db.config')
const mailer = require('../utils/mailer');
const AppError = require('../utils/errorHandler');
const sequelizeErrorHandler = require('../utils/sequelizeErrorHandler');
const { Op } = require('sequelize');


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

    async login(req, res, next) {
        try {
            const { email, password } = req.body;

            if (!email || !password) {
                return next(new AppError('Email và mật khẩu không được bỏ trống!!!', 400))
            }

            const user = await User.scope('withPassword').findOne({
                where: {
                    email
                },
            });

            if (!user || !(await User.comparePassword(password, user.password))) {
                return next(new AppError('Tài khoản hoặc mật khẩu không đúng!!!', 401));
            }
            else {
                const token = jwt.sign({ id: user.id },
                    process.env.JWT_SECRET_KEY,
                    { expiresIn: process.env.JWT_SECRET_EXPIRATION }
                );

                res.status(200).json({
                    status: 'success',
                    token,
                });
            }
        }
        catch (err) {
            next(new AppError(err.message, 500));
        }
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
        jwt.verify(token, process.env.JWT_SECRET_KEY, (err, decoded) => {
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

    async protect(req, res, next) {
        let token;
        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
            token = req.headers.authorization.split(" ")[1];
        }

        if (!token) {
            return next(new AppError('Bạn chưa đăng nhập tài khoản!!!', 401));
        }

        try {
            const decode = await jwt.verify(token, process.env.JWT_SECRET_KEY);
            const currentUser = await User.findByPk(decode.id);

            if (!currentUser) {
                return next(new AppError('Tài khoản không tồn tại!!!', 401));
            }

            if (currentUser.changedPasswordAfter(decode.iat)) {
                return next(new AppError('Mật khẩu của bạn đã được thay đổi! Vui lòng đăng nhập lại!!!', 401));
            }

            req.user = currentUser;
            next()
        }
        catch (err) {
            next(err);
        }
    }

    async forgetPassword(req, res, next) {
        const email = req.body.email;

        if (!email) {
            return next(new AppError('Vui lòng nhập email tài khoản của bạn!!!', 400));
        }

        const user = await User.findOne({
            where: {
                email: req.body.email
            }
        })

        if (!user) {
            return next(new AppError('Tài khoản không tồn tại!!!', 404));
        }


        const resetToken = user.createPasswordResetToken();
        await user.save();

        const resetUrl = `${req.protocol}://${req.hostname}/api/auth/resetPassword/${resetToken}`;

        try {
            await mailer.sendMail(user.email, 'Đặt lại mật khẩu Work Flex', `<p>${resetUrl}</p>`)

            return res.status(200).json({
                result: 'success',
                message: 'Token sent to email',
            })
        } catch (err) {
            user.passwordResetToken = undefined;
            user.passwordResetExpires = undefined;
            user.save();

            return next(new AppError('Đã có lỗi xảy ra khi gửi email xác thực. Vui lòng thử lại sau!!!'), 500)
        }
    }

    async resetPassword(req, res, next) {
        const token = req.params.token;

        try {
            const hashedToken = crypto.createHash("sha256").update(token).digest('hex');

            const user = await User.findOne({
                where: {
                    passwordResetToken: hashedToken,
                    passwordResetExpires: {
                        [Op.gt]: Date.now()
                    }
                }
            });

            if (!user) {
                return next(new AppError('Token is expired!', 400));
            }

            if (req.body.password !== req.body.passwordConfirm) {
                next(new AppError('Mật khẩu không khớp!!!', 400))
            }


            user.passwordResetToken = null;
            user.passwordResetExpires = null;
            const hashedPassword = await bcrypt.hash(req.body.password, 10);
            user.password = hashedPassword;
            await user.validate();
            await user.save();

            const tokenJWT = jwt.sign({ id: user.id },
                process.env.JWT_SECRET_KEY,
                { expiresIn: process.env.JWT_SECRET_EXPIRATION }
            );

            res.status(200).json({
                status: 'success',
                token: tokenJWT,
            });
        } catch (err) {
            next(new AppError(err.message, 400));
        }
    }

    async updatePassword(req, res, next) {
        const { currentPassword, passwordNew, passwordConfirm } = req.body;

        if (!currentPassword || !passwordNew || !passwordConfirm) {
            return next(new AppError("Vui lòng nhập đầy đủ thông tin!", 400));
        }

        try {
            const user = await User.scope('withPassword').findByPk(req.user.id);

            //compare password with current password
            const match = await bcrypt.compare(currentPassword, user.password);

            if (!match) {
                return next(new AppError("Mật khẩu hiện tại không đúng!", 401))
            }

            if (passwordNew !== passwordConfirm) {
                return next(new AppError('Mật khẩu không khớp!!!', 400))
            }

            await user.validate();
            const hashedPassword = await bcrypt.hash(passwordNew, 10);
            user.password = hashedPassword;
            await user.save();

            const tokenJWT = jwt.sign({ id: user.id },
                process.env.JWT_SECRET_KEY,
                { expiresIn: process.env.JWT_SECRET_EXPIRATION }
            );

            res.status(200).json({
                status: 'success',
                token: tokenJWT,
            });
        }
        catch (err) {
            next(new AppError(err.message, 400));
        }
    }
}

module.exports = new AuthController;