const express = require("express");
const adminRouter = express.Router();

const {
    createAdmin,
    deleteAdmin,
    getAdmin,
    getAllAdmins,
    updateAdmin
} = require("./admin.controller");
const { requireAdmin } = require("../../middleware/authMiddleware");

adminRouter.get("/", getAllAdmins);
adminRouter.post("/", createAdmin);
adminRouter.get("/:id", getAdmin);
adminRouter.put("/:id", updateAdmin);
adminRouter.delete("/:id", requireAdmin, deleteAdmin);

// food related
// adminRouter.get("/foods")

// user related

module.exports = adminRouter;
