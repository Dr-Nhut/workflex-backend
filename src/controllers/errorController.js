module.exports = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';

    console.log(process.env.NODE_ENV);

    if (process.env.NODE_ENV === 'development') {
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
            console.error(err);
            res.status(500).json({
                status: 'error',
                message: 'Unexpected error'
            })
        }

    }


}