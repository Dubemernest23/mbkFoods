const express = require("express");
const {
    getCurrentUser,
    getUserById,
    updateCurrentUser
} = require("./user.controller");
const { requireAuth } = require("../../middleware/authMiddleware");

const userRouter = express.Router();

userRouter.get("/me", requireAuth, getCurrentUser);
userRouter.put("/me", requireAuth, updateCurrentUser);
userRouter.get("/:id", requireAuth, getUserById);

module.exports = userRouter;
