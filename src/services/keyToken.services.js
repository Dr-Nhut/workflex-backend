'use strict';
const { KeyToken } = require('../../models');
const SequelizeHelpers = require('../utils/sequelizeHelpers');

class KeyTokenServices {
    static createKeyToken = async ({ userId, publicKey, privateKey }) => {
        try {
            const newKeyToken = await SequelizeHelpers.upsert(KeyToken, { userId }, { publicKey, privateKey });

            return newKeyToken.publicKey;
        } catch (err) {
            return {
                status: 'error',
                message: err.message,
            }
        }
    }
}

module.exports = KeyTokenServices;