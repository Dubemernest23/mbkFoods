const userService = require("./user.service");

function getCurrentUser(req, res) {
    return res.status(200).json({
        success: true,
        data: req.user
    });
}

function getUserById(req, res) {
    const user = userService.findById(req.params.id);

    if (!user) {
        return res.status(404).json({ success: false, message: "User not found" });
    }

    return res.status(200).json({ success: true, data: user });
}

function updateCurrentUser(req, res) {
    return res.status(501).json({
        success: false,
        message: "Profile updates will be connected to the database in the next backend pass."
    });
}

module.exports = {
    getCurrentUser,
    getUserById,
    updateCurrentUser
};
