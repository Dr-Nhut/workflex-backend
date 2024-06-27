class AppError extends Error {
    constructor(message, statusCode) {
        super(message) // due to message is built-in error object

        this.statusCode = statusCode;
        this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
        this.isOperational = true;

        Error.captureStackTrace(this, this.contructor); //contructor be omitted from the generated stack trace
    }
}

module.exports = AppError;