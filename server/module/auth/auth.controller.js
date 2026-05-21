const authService = require("./auth.service");

function register(req, res) {
    return res.status(501).json({
        success: false,
        message: "Customer registration will be connected to the database in the next backend pass."
    });
}

function login(req, res) {
    const token = authService.issueDemoToken(req.body || {});

    return res.status(200).json({
        success: true,
        message: "Temporary login response. Replace with password verification before production.",
        token
    });
}

module.exports = {
    login,
    register
};
