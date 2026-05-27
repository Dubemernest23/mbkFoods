const crypto = require("crypto");
const httpStatus = require("../constants/httpStatus");

function hashPayload(payload) {
    return crypto
        .createHash("sha256")
        .update(JSON.stringify(payload || {}))
        .digest("hex");
}

function getScopeKey(req) {
    if (req.user && req.user.id) {
        return `user:${req.user.id}`;
    }

    return `anonymous:${req.ip}`;
}

function requireIdempotencyKey(req, res, next) {
    const key = req.headers["idempotency-key"];

    if (!key) {
        return res.status(httpStatus.BAD_REQUEST).json({
            success: false,
            message: "Idempotency-Key header is required for this request"
        });
    }

    req.idempotency = {
        key,
        scopeKey: getScopeKey(req),
        requestHash: hashPayload({
            body: req.body,
            params: req.params,
            query: req.query
        })
    };

    return next();
}

module.exports = {
    requireIdempotencyKey
};
