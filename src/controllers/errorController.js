module.exports = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';

    console.log(err.stack);

    res.status(err.statusCode).json({
        status: err.status,
        message: err.message
    })
}

const x = 1;
const y = 2;
