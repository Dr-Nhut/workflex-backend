'use strict';

const StatusCode = {
    OK: 200,
    Created: 201,
}

const ReasonStatusCode = {
    OK: 'success',
    Created: 'created',
}

class SuccessResponse {
    constructor({ message, statusCode = StatusCode.OK, reasonStatusCode = ReasonStatusCode.OK, metadata =
        {}
    }) {
        this.message = !message ? reasonStatusCode : message;
        this.status = statusCode;
        this.metadata = metadata;
    }

    send(res, header = {}) {
        res.status(this.status).json(this);
    }

    static create({ message, statusCode, metadata }) {
        return new SuccessResponse({ message, statusCode, metadata });
    }
}

class OK extends SuccessResponse {
    constructor({ message, metadata }) {
        super({ message, metadata });
    }

    static create({ message, metadata }) {
        return new OK({ message, metadata });
    }
}

class Created extends SuccessResponse {
    constructor({ message, statusCode = StatusCode.Created, reasonStatusCode = ReasonStatusCode.Created, metadata }) {
        super({ message, statusCode, reasonStatusCode, metadata });
    }

    static create({ message, metadata, options }) {
        return new Created({ message, metadata, options });
    }
}

module.exports = {
    OK,
    Created
};