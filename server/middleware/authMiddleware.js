const { verifyToken } = require("../utils/jwt.config");
const httpStatus = require("../constants/httpStatus");

function requireAuth(req, res, next) {
    const authHeader = req.headers.authorization || "";
    const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : null;

    if (!token) {
        return res.status(httpStatus.UNAUTHORIZED).json({ success: false, message: "Authentication required" });
    }

    try {
        req.user = verifyToken(token);
        return next();
    } catch (error) {
        return res.status(httpStatus.UNAUTHORIZED).json({ success: false, message: "Invalid or expired token" });
    }
}

function requireAdmin(req, res, next) {
    if (!req.user) {
        return requireAuth(req, res, () => requireAdmin(req, res, next));
    }

    if (req.user.role !== "admin" && req.user.role !== "super_admin") {
        return res.status(httpStatus.FORBIDDEN).json({ success: false, message: "Admin access required" });
    }

    return next();
}

module.exports = {
    requireAdmin,
    requireAuth
};
