const foodService = require("./food.service");
const asyncHandler = require("../../shared/asyncHandler");
const AppError = require("../../utils/AppError");
const httpStatus = require("../../constants/httpStatus");

const getAllFoods = asyncHandler(async (req, res) => {
    const foods = await foodService.findAll(req.query);

    return res.status(httpStatus.OK).json({
        success: true,
        data: foods,
        count: foods.length
    });
});

const getFoodById = asyncHandler(async (req, res) => {
    const food = await foodService.findById(req.params.id);

    if (!food) {
        throw new AppError("Food item not found", httpStatus.NOT_FOUND);
    }

    return res.status(httpStatus.OK).json({ 
        success: true, 
        data: food 
    });
});

const createFood = asyncHandler(async (req, res) => {
    const { category_id, name, price_kobo } = req.body;

    if (!category_id || !name || price_kobo === undefined) {
        throw new AppError("Missing required fields: category_id, name, price_kobo", httpStatus.BAD_REQUEST);
    }

    const newFood = await foodService.create(req.body);
    return res.status(httpStatus.CREATED).json({
        success: true,
        message: "Food item created successfully",
        data: newFood
    });
});

const updateFood = asyncHandler(async (req, res) => {
    const food = await foodService.findById(req.params.id);

    if (!food) {
        throw new AppError("Food item not found", httpStatus.NOT_FOUND);
    }

    const updatedFood = await foodService.update(req.params.id, req.body);
    return res.status(httpStatus.OK).json({
        success: true,
        message: "Food item updated successfully",
        data: updatedFood
    });
});

module.exports = {
    createFood,
    getAllFoods,
    getFoodById,
    updateFood
};
