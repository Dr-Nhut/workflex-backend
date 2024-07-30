const { ForbiddenRequestError } = require("../core/error.response")

const checkPermission = (permission) => {
    return async (req, res, next) => {
        if (req.objKey.permissions !== permission) {
            throw new ForbiddenRequestError('Permission denied');
        }
        next()
    }
}

module.exports = checkPermission