const express = require("express");
const {
    createOrder,
    getOrderById,
    getUserOrders
} = require("./order.controller");
const { requireAuth } = require("../../middleware/authMiddleware");

const orderRouter = express.Router();

orderRouter.post("/", requireAuth, createOrder);
orderRouter.get("/", requireAuth, getUserOrders);
orderRouter.get("/:id", requireAuth, getOrderById);

module.exports = orderRouter;
