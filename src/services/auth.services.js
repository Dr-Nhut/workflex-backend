const crypto = require('crypto');
const jwt = require('jsonwebtoken');
require('dotenv/config');
const { User, sequelize } = require('../../models');
const KeyTokenServices = require('./keyToken.services');
const { createTokenPair } = require('../utils/auth/authUtils');
const { BadRequestError, UnauthorizedError, ForbiddenRequestError } = require('../core/error.response');
const { findUserByEmail } = require('./user.services');

class AuthServies {
    static register = async (user) => {
        const { name, email, password, passwordConfirm, address, role, sex, bankAccount, phone, dataOfBirth, experience, avatar } = user;

        if (password !== passwordConfirm) {
            throw new BadRequestError('Mật khẩu không khớp!!!');
        }
        const newUser = await User.create({
            name, email, password, address, role, avatar, sex, bankAccount, phone, dataOfBirth, experience
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
                metadata: {
                    tokens,
                    user: newUser,
                }
            }
        }

        return {
            code: '200',
            metadata: null
        }
    }

    static login = async ({ email, password, refreshToken = null }) => {
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
                throw new BadRequestError('Public key string error');
            }

            return {
                message: 'Đăng nhập thành công!',
                metadata: {
                    tokens,
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

        if (!foundUser) throw new UnauthorizedError("User not existed");

        const tokens = await createTokenPair({ id, email }, keyStore.publicKey, keyStore.privateKey);

        //update keyToken
        await KeyTokenServices.update({
            updateFields: {
                refreshToken,
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
}

module.exports = AuthServies