const { BadRequestError } = require("../core/error.response");

const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const validateUUID = (req, res, next) => {
    const id = req.params.id;
    if (!uuidRegex.test(id)) {
        next(new BadRequestError('Id không hợp lệ!!!'))
    }
    next();
};

module.exports = validateUUID;