const { signToken } = require("../../utils/jwt.config");

function issueDemoToken(payload = {}) {
    return signToken({
        id: payload.id || 1,
        email: payload.email || "customer@example.com",
        role: payload.role || "customer"
    });
}

module.exports = {
    issueDemoToken
};
