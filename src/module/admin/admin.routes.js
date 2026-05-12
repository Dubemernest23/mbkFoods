const express = require("express");
const adminrouter = express.Router()

const { getAllAdmins } = require("./admin.controller")

adminrouter.get("/admins", getAllAdmins)
adminrouter.post("/create", createAdmin)
adminrouter.get("/admin/:id", getAdminm)
adminrouter.put("/admin/:id", updateAdmin)
adminrouter.delete("/admin/:id", checkRole,deleteAdmin)

// food related
// adminrouter.get("/foods")

// user related

module.exports = adminrouter;