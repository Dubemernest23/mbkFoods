const logger = require("../config/logger");
const httpStatus = require("../constants/httpStatus");

function notFound(req, res, next) {
    res.status(httpStatus.NOT_FOUND);

    const error = new Error(`Route not found - ${req.originalUrl}`);

    next(error);
}

function appError(err, req, res, next) {
    const statusCode = res.statusCode !== httpStatus.OK
        ? res.statusCode
        : err.statusCode || httpStatus.SERVER_ERROR;

    // structured logging
    logger.error({
        message: err.message,
        method: req.method,
        url: req.originalUrl,
        ip: req.ip,
        statusCode,
        stack: err.stack
    });

    res.status(statusCode).json({
        success: false,
        statusCode,

        message:
            process.env.NODE_ENV === "production"
                ? statusCode === httpStatus.SERVER_ERROR
                    ? "Internal server error"
                    : err.message
                : err.message,

        ...(process.env.NODE_ENV !== "production" && {
            stack: err.stack
        })
    });
}

module.exports = {
    appError,
    notFound
};