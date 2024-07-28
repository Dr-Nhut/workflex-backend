'use strict';

const Reason = require("../constants/reasonnPhrases");
const StatusCode = require("../constants/statusCodes");

class ErrorResponse extends Error {
    constructor(message, status) {
        super(message);
        this.status = status;
    }
}

class BadRequestError extends ErrorResponse {
    constructor(message = Reason.BAD_REQUEST, status = StatusCode.BAD_REQUEST) {
        super(message, status);
    }
}

class UnauthorizedError extends ErrorResponse {
    constructor(message = Reason.UNAUTHORIZED, status = StatusCode.UNAUTHORIZED) {
        super(message, status);
    }
}

class ForbiddenRequestError extends ErrorResponse {
    constructor(message = Reason.FORBIDDEN, status = StatusCode.FORBIDDEN) {
        super(message, status);
    }
}


class AppError extends Error {
    constructor(message, statusCode) {
        super(message)

        this.statusCode = statusCode;
        this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
        this.isOperational = true;

        Error.captureStackTrace(this, this.contructor);
    }
}

module.exports = {
    BadRequestError,
    UnauthorizedError,
    ForbiddenRequestError,
    AppError
};