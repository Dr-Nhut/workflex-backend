const jwt = require('jsonwebtoken');
require('dotenv/config');

const createTokenPair = async (payload, publicKey, privateKey) => {
    try {
        //encode with privatekey
        const accessToken = await jwt.sign(payload, privateKey, {
            expiresIn: process.env.JWT_SECRET_EXPIRATION,
            algorithm: 'RS256'
        });

        const refreshToken = await jwt.sign({ id: payload.id }, privateKey, {
            expiresIn: process.env.JWT_REFRESH_SECRET_EXPIRATION,
            algorithm: 'RS256'
        });

        return { accessToken, refreshToken };
    } catch (err) {
        throw new Error(err);
    }
}

module.exports = { createTokenPair }