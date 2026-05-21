const foodService = require("./food.service");

function getAllFoods(req, res) {
    const foods = foodService.findAll(req.query);

    return res.status(200).json({
        success: true,
        data: foods,
        count: foods.length
    });
}

function getFoodById(req, res) {
    const food = foodService.findById(req.params.id);

    if (!food) {
        return res.status(404).json({ success: false, message: "Food item not found" });
    }

    return res.status(200).json({ success: true, data: food });
}

function createFood(req, res) {
    return res.status(501).json({
        success: false,
        message: "Food creation will be connected to the database in the next backend pass."
    });
}

function updateFood(req, res) {
    return res.status(501).json({
        success: false,
        message: "Food updates will be connected to the database in the next backend pass."
    });
}

module.exports = {
    createFood,
    getAllFoods,
    getFoodById,
    updateFood
};
