const data = require("./admin.service");

const getAllAdmins = (req, res) => {
    return res.status(200).json({
        success: true,
        data: data,
        count: data.length
    });
};

const getAdmin = (req, res) => {
    const admin = data.find((item) => item.id === Number(req.params.id));

    if (!admin) {
        return res.status(404).json({ success: false, message: "Admin not found" });
    }

    return res.status(200).json({ success: true, data: admin });
};

const createAdmin = (req, res) => {
    return res.status(501).json({
        success: false,
        message: "Admin creation will be wired to the database in the next backend pass."
    });
};

const updateAdmin = (req, res) => {
    return res.status(501).json({
        success: false,
        message: "Admin updates will be wired to the database in the next backend pass."
    });
};

const deleteAdmin = (req, res) => {
    return res.status(501).json({
        success: false,
        message: "Admin deletion will be wired to the database in the next backend pass."
    });
};

module.exports = {
    createAdmin,
    deleteAdmin,
    getAdmin,
    getAllAdmins,
    updateAdmin
};
