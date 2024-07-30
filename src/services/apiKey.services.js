const { ApiKey } = require('../../models');
const crypto = require('crypto');
const { BadRequestError } = require('../core/error.response');

class ApiKeyServices {
    static async findOneApiKey(key) {
        return await ApiKey.findOne({ where: { key } });
    }

    static async create({ permissions }) {
        const newApiKey = await ApiKey.create({ key: crypto.randomBytes(64).toString('hex'), permissions });

        if (!newApiKey) throw new BadRequestError("Cann't create api key");

        return newApiKey;
    }
}

module.exports = ApiKeyServices;