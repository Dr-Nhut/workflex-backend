const { ValidationError } = require('sequelize');
const AppError = require('./errorHandler');

module.exports = (err, next) => {
    if (err instanceof ValidationError) {
        const errorMessages = err.errors.map(err => err.message)
        err.message = errorMessages.join(', ');
        next(new AppError(err.message, 400))
    }
    else {
        next(new AppError('Unexpected error', 500))
    }
}