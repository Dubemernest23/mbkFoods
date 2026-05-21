const express = require("express");
const {
    initializePayment,
    verifyPayment,
    webhook
} = require("./payment.controller");
const { requireAuth } = require("../../middleware/authMiddleware");

const paymentRouter = express.Router();

paymentRouter.post("/initialize", requireAuth, initializePayment);
paymentRouter.get("/verify/:reference", requireAuth, verifyPayment);
paymentRouter.post("/webhook", webhook);

module.exports = paymentRouter;
