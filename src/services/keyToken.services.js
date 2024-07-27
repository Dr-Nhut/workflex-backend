'use strict';
const { KeyToken } = require('../../models');

class KeyTokenServices {
    static createKeyToken = async ({ userId, publicKey }) => {
        try {
            const publicKeyString = publicKey.toString();
            const token = await KeyToken.create({
                userId,
                publicKey: publicKeyString,
            })

            return token ? token.publicKey : null;
        } catch (err) {
            return {
                status: 'error',
                message: err.message,
            }
        }
    }
}

module.exports = KeyTokenServices;