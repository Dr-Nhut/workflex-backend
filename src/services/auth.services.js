const crypto = require('crypto');
const jwt = require('jsonwebtoken');
require('dotenv/config');
const { User, sequelize } = require('../../models');
const KeyTokenServices = require('./keyToken.services');
const { createTokenPair } = require('../utils/auth/authUtils');

class AuthServies {
    static register = async (user) => {
        const { name, email, password, passwordConfirm, address, role, sex, bankAccount, phone, dataOfBirth, experience, avatar } = user;

        if (password !== passwordConfirm) {
            throw new Error('Mật khẩu không khớp!!!');
            // next(new AppError('Mật khẩu không khớp!!!', 400))
        }
        try {
            const newUser = await User.create({
                name, email, password, address, role, avatar, sex, bankAccount, phone, dataOfBirth, experience
            });

            if (newUser) {
                // create privateKey, publicKey
                const { privateKey, publicKey } = crypto.generateKeyPairSync('rsa', {
                    modulusLength: 4096,
                    publicKeyEncoding: {
                        type: 'pkcs1',
                        format: 'pem'
                    },
                    privateKeyEncoding: {
                        type: 'pkcs1',
                        format: 'pem'
                    }
                })

                const publicKeyString = await KeyTokenServices.createKeyToken({ userId: newUser.id, publicKey });

                if (!publicKeyString) {
                    return {
                        status: 'error',
                        message: 'Public key string error'
                    }
                }

                const publicKeyObject = crypto.createPublicKey(publicKeyString);

                const tokens = await createTokenPair({ id: newUser.id, email }, publicKeyObject, privateKey);

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
        catch (err) {
            throw new Error(err);
        }
    }
}

module.exports = AuthServies