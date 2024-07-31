'use strict';
const { KeyToken } = require('../../models');
const SequelizeHelpers = require('../utils/sequelizeHelpers');

class KeyTokenServices {
    static createKeyToken = async ({ userId, publicKey, privateKey }) => {
        try {
            const newKeyToken = await SequelizeHelpers.upsert(KeyToken, { userId }, { publicKey, privateKey });

            return newKeyToken.publicKey;
        } catch (err) {
            throw err;
        }
    }

    static findKeyTokenByUserId = async ({
        userId
    }) => {
        return await KeyToken.findOne({ where: { userId } });
    }

    static removeById = async ({ id }) => {
        return await KeyToken.destroy({ where: { id } });
    }
}

module.exports = KeyTokenServices;