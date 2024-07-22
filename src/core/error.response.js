'use strict';

const { BAD_REQUEST: ReasonBadRequest } = require("../constants/reasonnPhrases");
const { BAD_REQUEST: StatusBadRequest } = require("../constants/statusCodes");

class ErrorResponse extends Error {
    constructor({ message, status }) {
        super(message);
        this.status = status;
    }
}

class BadRequestError extends ErrorResponse {
    constructor({ message = ReasonBadRequest, status = StatusBadRequest }) {
        super({ message, status });
    }
}

module.exports = {
    BadRequestError
};