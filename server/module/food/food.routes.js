const express = require("express");
const {
    createFood,
    getAllFoods,
    getFoodById,
    updateFood
} = require("./food.controller");
const { requireAdmin } = require("../../middleware/authMiddleware");

const foodRouter = express.Router();

foodRouter.get("/", getAllFoods);
foodRouter.get("/:id", getFoodById);
foodRouter.post("/", requireAdmin, createFood);
foodRouter.put("/:id", requireAdmin, updateFood);

module.exports = foodRouter;
