const authService = require("./auth.service");
const asyncHandler = require("../../shared/asyncHandler");
const AppError = require("../../utils/AppError");
const httpStatus = require("../../constants/httpStatus");
const { signToken } = require("../../utils/jwt.config");
const bcrypt = require("bcryptjs");

const register = asyncHandler(async (req, res) => {
    const { full_name, email, phone, password, role } = req.body;

    if (!full_name || !email || !password) {
        throw new AppError("Missing required fields: full_name, email, password", httpStatus.BAD_REQUEST);
    }

    const existing = await authService.findByEmail(email);
    if (existing) {
        throw new AppError("Email is already registered", httpStatus.BAD_REQUEST);
    }

    const user = await authService.register({
        full_name,
        email,
        phone,
        password,
        role: role || "customer"
    });

    const token = signToken({
        id: user.id,
        email: user.email,
        role: user.role
    });

    return res.status(httpStatus.CREATED).json({
        success: true,
        message: "User registered successfully",
        token,
        data: {
            id: user.id,
            public_id: user.public_id,
            full_name: user.full_name,
            email: user.email,
            phone: user.phone,
            role: user.role
        }
    });
});

const login = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        throw new AppError("Email and password are required", httpStatus.BAD_REQUEST);
    }

    const user = await authService.findByEmail(email);
    if (!user) {
        throw new AppError("Invalid email or password", httpStatus.UNAUTHORIZED);
    }

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
        throw new AppError("Invalid email or password", httpStatus.UNAUTHORIZED);
    }

    const token = signToken({
        id: user.id,
        email: user.email,
        role: user.role
    });

    return res.status(httpStatus.OK).json({
        success: true,
        message: "Login successful",
        token,
        data: {
            id: user.id,
            public_id: user.public_id,
            full_name: user.full_name,
            email: user.email,
            phone: user.phone,
            role: user.role
        }
    });
});

function PasswordReset() {
    return {
        forgotpaswword: asyncHandler(async (req, res) => {
            return res.status(httpStatus.OK).json({
                success: true,
                message: "Password reset instructions sent (mock)"
            });
        }),
        resetPasswordToken: () => {}
    };
}

module.exports = {
    login,
    register,
    PasswordReset
};
