'use strict';
const { KeyToken } = require('../../models');
const SequelizeHelpers = require('../utils/SequelizeHelpers');

class KeyTokenServices {
    static createKeyToken = async ({ userId, publicKey, privateKey, refreshToken }) => {
        try {
            const newKeyToken = await SequelizeHelpers.upsert(KeyToken, { userId }, { publicKey, privateKey, refreshToken });

            return newKeyToken.publicKey;
        } catch (err) {
            throw err;
        }
    }

    static update = async ({ updateFields, filters }) => {
        const result = await KeyToken.update(
            updateFields,
            {
                where: filters,
            },)

        return result;
    }

    static findKeyTokenByUserId = async ({ userId }) => {
        return await KeyToken.findOne({ where: { userId } });
    }

    static removeById = async ({ id }) => {
        return await KeyToken.destroy({ where: { id } });
    }
}

module.exports = KeyTokenServices;