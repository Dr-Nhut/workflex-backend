const AppError = require("../utils/errorHandler");

const handleJWTError = () => {
    return new AppError('Token không hợp lệ!!!', 401);
}

const handleTokenExpiredError = () => {
    return new AppError('Tài khoản quá hạn! Vui lòng đăng nhập lại!!!', 401);
}


module.exports = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';

    if (process.env.NODE_ENV === 'development') {
        // if (err.name === 'JsonWebTokenError') {
        //     err = handleJWTError();
        // }

        // if (err.name === 'TokenExpiredError') {
        //     err = handleTokenExpiredError();
        // }
        const errObj = {
            'JsonWebTokenError': handleJWTError,
            'TokenExpiredError': handleTokenExpiredError
        }

        if (errObj[err.name]) {
            err = errObj[err.name]()
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