const { AppError } = require("../core/error.response");

const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const validateUUID = (req, res, next) => {
    const id = req.params.id;
    if (!uuidRegex.test(id)) {
        next(new AppError('ID không hợp lệ!!!', 400))
    }
    next();
};

module.exports = validateUUID;