const { ValidationError } = require('sequelize');

module.exports = (err) => {
    if (err instanceof ValidationError) {
        const errorMessages = err.errors.map(err => err.message)
        err.message = errorMessages.join(', ');
    }
}