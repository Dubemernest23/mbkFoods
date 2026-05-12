const express = require("express");
const adminRouter = require("../module/admin/admin.routes");

const router = express();

router.use("/api/v1/", adminRouter)

module.exports = router;