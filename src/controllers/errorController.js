const { AppError } = require("../core/error.response");

const handleJWTError = () => {
    return new AppError('Token không hợp lệ!!!', 401);
}

const handleTokenExpiredError = () => {
    return new AppError('Tài khoản quá hạn! Vui lòng đăng nhập lại!!!', 401);
}

const handleSequelize = (message) => {
    return new AppError(message, 400);
}

module.exports = (err, req, res, next) => {
    console.log(err);
    err.statusCode = err.status || 500;
    err.status = `${err.status}`.startsWith('4') ? 'fail' : 'error';

    if (process.env.NODE_ENV === 'development') {
        const errObj = {
            'SequelizeUniqueConstraintError': handleSequelize,
            'SequelizeValidationError': handleSequelize,
            'JsonWebTokenError': handleJWTError,
            'TokenExpiredError': handleTokenExpiredError,
        }

        if (errObj[err.name]) {
            err = errObj[err.name](err.message)
        }

        res.status(err.statusCode).json({
            status: err.status,
            message: err.message,
            stack: err.stack
        })
    }
    else if (process.env.NODE_ENV === 'production') {
        if (err.isOperational) {
            res.status(err.statusCode).json({
                status: err.status,
                message: err.message,
            })
        }
        else {
            res.status(500).json({
                status: 'error',
                message: 'Unexpected error'
            })
        }

    }
}