const crypto = require('crypto');
const bcrypt = require('bcrypt');
require('dotenv/config');
const { User } = require('../../models');
const KeyTokenServices = require('./keyToken.services');
const { createTokenPair } = require('../utils/auth/authUtils');
const { BadRequestError, UnauthorizedError, ForbiddenRequestError, NotFoundError } = require('../core/error.response');
const { findUserByEmail } = require('./user.services');

class AuthServies {
    static register = async (user) => {
        const { name, email, password, passwordConfirm, address, roleId, sex, phone, dataOfBirth, experience } = user;

        if (password !== passwordConfirm) {
            throw new BadRequestError('Mật khẩu không khớp!!!');
        }
        const newUser = await User.create({
            name, email, password, address, roleId, sex, phone, dataOfBirth, experience
        });

        if (newUser) {
            // create privateKey, publicKey
            const privateKey = crypto.randomBytes(64).toString('hex');
            const publicKey = crypto.randomBytes(64).toString('hex');

            const publicKeyString = await KeyTokenServices.createKeyToken({ userId: newUser.id, publicKey, privateKey });

            if (!publicKeyString) {
                throw new BadRequestError('Public key string error');
            }

            const tokens = await createTokenPair({ id: newUser.id, email }, publicKey, privateKey);

            return {
                code: '201',
                message: 'Tạo tài khoản thành công',
                metadata: {
                    tokens,
                    id: newUser.id,
                }
            }
        }
    }

    static login = async ({ email, password }) => {
        if (!email || !password) {
            throw new BadRequestError('Tài khoản hoặc mật khẩu bỏ trống!');
        }

        const user = await findUserByEmail({ email, withPassword: true });

        if (!user || !(await User.comparePassword(password, user.password))) {
            throw new UnauthorizedError('Tài khoản hoặc mật khẩu không đúng!');
        }
        else {
            // create privateKey, publicKey
            const privateKey = crypto.randomBytes(64).toString('hex');
            const publicKey = crypto.randomBytes(64).toString('hex');

            const tokens = await createTokenPair({ id: user.id, email }, publicKey, privateKey);

            const publicKeyString = await KeyTokenServices.createKeyToken({ userId: user.id, publicKey, privateKey, refreshToken: tokens.refreshToken });

            if (!publicKeyString) {
                throw new BadRequestError('Đã xảy ra lỗi khi đăng nhập');
            }

            return {
                message: 'Đăng nhập thành công!',
                metadata: {
                    tokens,
                    id: user.id
                }
            }
        }
    }

    static logout = async (keyStore) => {
        return await KeyTokenServices.removeById({ id: keyStore.id })
    }

    static handleRefreshToken = async ({ keyStore, user, refreshToken }) => {
        const { id, email } = user;

        const refreshTokenUsed = keyStore.refreshTokenUsed;

        if (refreshTokenUsed.includes(refreshToken)) {
            await KeyTokenServices.removeById({ id: keyStore.id })
            throw new ForbiddenRequestError('Something wrong happened!! Please try login again');
        }

        if (keyStore.refreshToken !== refreshToken) throw new UnauthorizedError('User not registered');

        const foundUser = await findUserByEmail({ email });

        if (!foundUser) throw new UnauthorizedError("Tài khoản không tồn tại");

        const tokens = await createTokenPair({ id, email }, keyStore.publicKey, keyStore.privateKey);

        //update keyToken
        await KeyTokenServices.update({
            updateFields: {
                refreshToken: tokens.refreshToken,
                refreshTokenUsed: [...keyStore.refreshTokenUsed, refreshToken]
            },
            filters: { id: keyStore.id }
        });

        return {
            metadata: {
                user,
                tokens,
            }
        }
    }

    static async verifyEmail(email, token) {
        if (!email || !token) throw new BadRequestError('Mã xác thực không hợp lệ')

        try {
            const match = await bcrypt.compare(email, token);

            if (match) {
                return { emailVerifiedAt: new Date().toLocaleString() }
            } else {
                throw new NotFoundError('Email không hợp lệ')
            }
        } catch (err) {
            throw new BadRequestError('Xác thực email không thành công')
        }
    }
}

module.exports = AuthServies