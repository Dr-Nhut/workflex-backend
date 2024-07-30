const { ForbiddenRequestError } = require('../core/error.response');
const ApiKeyServices = require('../services/apiKey.services');
const { findOneApiKey } = require('../services/apiKey.services');
const HEADER = {
    APIKEY: 'x-api-key',
    AUTHORIZATION: 'authorization'
}

const apiKey = async (req, res, next) => {
    const apiKey = req.headers[HEADER.APIKEY]?.toString();

    if (!apiKey) throw new ForbiddenRequestError();

    const objKey = await findOneApiKey(apiKey);

    if (!objKey) throw new ForbiddenRequestError();

    req.objKey = objKey;
    next();
};

module.exports = apiKey;