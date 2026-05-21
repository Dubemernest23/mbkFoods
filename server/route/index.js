const express = require("express");
const adminRouter = require("../module/admin/admin.routes");
const authRouter = require("../module/auth/auth.routes");
const foodRouter = require("../module/food/food.routes");
const orderRouter = require("../module/order/order.routes");
const paymentRouter = require("../module/payment/payment.routes");
const userRouter = require("../module/user/user.routes");

const router = express.Router();

router.use("/api/v1/admins", adminRouter);
router.use("/api/v1/auth", authRouter);
router.use("/api/v1/foods", foodRouter);
router.use("/api/v1/orders", orderRouter);
router.use("/api/v1/payments", paymentRouter);
router.use("/api/v1/users", userRouter);

module.exports = router;
