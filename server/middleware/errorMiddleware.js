const logger = require("../config/logger");

function notFound(req, res, next) {
    res.status(404);

    const error = new Error(`Route not found - ${req.originalUrl}`);

    next(error);
}

function appError(err, req, res, next) {
    const statusCode = res.statusCode !== 200
        ? res.statusCode
        : err.statusCode || 500;

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
                ? statusCode === 500
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