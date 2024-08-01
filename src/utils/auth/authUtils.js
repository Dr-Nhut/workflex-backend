const jwt = require('jsonwebtoken');
require('dotenv/config');
const { catchAsyncError } = require('../catchAsyncError');
const { UnauthorizedError, NotFoundError } = require('../../core/error.response');

//services
const { findKeyTokenByUserId } = require('../../services/keyToken.services');

const HEADER = {
    CLIENT_ID: 'x-client-id',
    AUTHORIZATION: 'authorization',
    REFRESHTOKEN: 'refresh-token',
}

const createTokenPair = async (payload, publicKey, privateKey) => {
    try {
        //encode with privatekey
        const accessToken = await jwt.sign(payload, publicKey, {
            expiresIn: process.env.JWT_SECRET_EXPIRATION,
        });

        const refreshToken = await jwt.sign(payload, privateKey, {
            expiresIn: process.env.JWT_REFRESH_SECRET_EXPIRATION,
        });

        return { accessToken, refreshToken };
    } catch (err) {
        throw new Error(err);
    }
}

const authentication = catchAsyncError(async (req, res, next) => {
    const userId = req.headers[HEADER.CLIENT_ID];
    if (!userId) throw new UnauthorizedError('Invalid client ID');

    const keyStore = await findKeyTokenByUserId({ userId })
    if (!keyStore) throw new NotFoundError('No key store found');

    let accessToken;
    if (req.headers[HEADER.AUTHORIZATION] && req.headers[HEADER.AUTHORIZATION].startsWith('Bearer ')) {
        accessToken = req.headers[HEADER.AUTHORIZATION].split(" ")[1];
    }

    if (!accessToken) throw new UnauthorizedError('Invalid token');

    try {
        const decode = jwt.verify(accessToken, keyStore.publicKey);
        if (decode.id !== userId) throw new UnauthorizedError('Invalid user ID');
        req.keyStore = keyStore;
        return next();
    } catch (err) {
        throw err;
    }
})

const authRefreshToken = catchAsyncError(async (req, res, next) => {
    const userId = req.headers[HEADER.CLIENT_ID];
    if (!userId) throw new UnauthorizedError('Invalid client ID');

    const keyStore = await findKeyTokenByUserId({ userId })
    if (!keyStore) throw new NotFoundError('No key store found');

    let refreshToken = req.headers[HEADER.REFRESHTOKEN];
    if (!refreshToken) throw new UnauthorizedError('Invalid token');

    try {
        const decode = jwt.verify(refreshToken, keyStore.privateKey);
        if (decode.id !== userId) throw new UnauthorizedError('Invalid user ID');
        req.keyStore = keyStore;
        req.user = decode;
        req.refreshToken = refreshToken;
        return next();
    } catch (err) {
        throw err;
    }
})

module.exports = { createTokenPair, authentication, authRefreshToken }