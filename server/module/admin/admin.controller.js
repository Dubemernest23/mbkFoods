const adminService = require("./admin.service");
const asyncHandler = require("../../shared/asyncHandler");
const AppError = require("../../utils/AppError");
const httpStatus = require("../../constants/httpStatus");

const getAllAdmins = asyncHandler(async (req, res) => {
    const admins = await adminService.findAll();
    return res.status(httpStatus.OK).json({
        success: true,
        data: admins,
        count: admins.length
    });
});

const getAdmin = asyncHandler(async (req, res) => {
    const admin = await adminService.findById(req.params.id);

    if (!admin) {
        throw new AppError("Admin not found", httpStatus.NOT_FOUND);
    }

    return res.status(httpStatus.OK).json({ 
        success: true, 
        data: admin 
    });
});

const createAdmin = asyncHandler(async (req, res) => {
    const { full_name, email, phone, password, role } = req.body;
    
    if (!full_name || !email || !password) {
        throw new AppError("Missing required fields: full_name, email, password", httpStatus.BAD_REQUEST);
    }
    
    // Check if email already registered
    const existing = await adminService.findByEmail(email);
    if (existing) {
        throw new AppError("Email is already registered", httpStatus.BAD_REQUEST);
    }
    
    const newAdmin = await adminService.create({
        full_name,
        email,
        phone,
        password,
        role
    });
    
    return res.status(httpStatus.CREATED).json({
        success: true,
        message: "Admin created successfully",
        data: newAdmin
    });
});

const updateAdmin = asyncHandler(async (req, res) => {
    const admin = await adminService.findById(req.params.id);
    if (!admin) {
        throw new AppError("Admin not found", httpStatus.NOT_FOUND);
    }
    
    const updated = await adminService.update(req.params.id, req.body);
    return res.status(httpStatus.OK).json({
        success: true,
        message: "Admin updated successfully",
        data: updated
    });
});

const deleteAdmin = asyncHandler(async (req, res) => {
    const admin = await adminService.findById(req.params.id);
    if (!admin) {
        throw new AppError("Admin not found", httpStatus.NOT_FOUND);
    }
    
    await adminService.deleteById(req.params.id);
    return res.status(httpStatus.OK).json({
        success: true,
        message: "Admin deleted successfully"
    });
});

module.exports = {
    createAdmin,
    deleteAdmin,
    getAdmin,
    getAllAdmins,
    updateAdmin
};
