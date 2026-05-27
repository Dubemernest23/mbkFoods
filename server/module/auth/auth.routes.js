const express = require("express");
const {
    login,
    register,
    PasswordReset
} = require("./auth.controller");

const authRouter = express.Router();

/**
 * @openapi
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         public_id:
 *           type: string
 *           format: uuid
 *           example: "d3b07384-d113-40a2-a5e2-632057d3a016"
 *         full_name:
 *           type: string
 *           example: John Doe
 *         email:
 *           type: string
 *           format: email
 *           example: john.doe@example.com
 *         phone:
 *           type: string
 *           example: "+2348012345678"
 *         role:
 *           type: string
 *           enum: [customer, admin, super_admin]
 *           example: customer
 *         status:
 *           type: string
 *           enum: [active, blocked, deleted]
 *           example: active
 */

/**
 * @openapi
 * /api/v1/auth/register:
 *   post:
 *     summary: Register a new customer or admin account
 *     tags:
 *       - Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - full_name
 *               - email
 *               - password
 *             properties:
 *               full_name:
 *                 type: string
 *                 example: John Doe
 *               email:
 *                 type: string
 *                 format: email
 *                 example: john.doe@example.com
 *               phone:
 *                 type: string
 *                 example: "+2348012345678"
 *               password:
 *                 type: string
 *                 format: password
 *                 example: "SuperSecurePassword123"
 *               role:
 *                 type: string
 *                 enum: [customer, admin]
 *                 example: customer
 *     responses:
 *       201:
 *         description: User registered successfully. Returns a JWT access token.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: User registered successfully
 *                 token:
 *                   type: string
 *                   example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *                 data:
 *                   $ref: '#/components/schemas/User'
 *       400:
 *         description: Missing fields or email already exists.
 * 
 * /api/v1/auth/login:
 *   post:
 *     summary: Authenticate a user and return a JWT token
 *     tags:
 *       - Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: john.doe@example.com
 *               password:
 *                 type: string
 *                 format: password
 *                 example: "SuperSecurePassword123"
 *     responses:
 *       200:
 *         description: Login successful. Returns a JWT access token.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Login successful
 *                 token:
 *                   type: string
 *                   example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *                 data:
 *                   $ref: '#/components/schemas/User'
 *       400:
 *         description: Missing email or password.
 *       401:
 *         description: Invalid credentials.
 */
authRouter.post("/register", register);
authRouter.post("/login", login);

/**
 * @openapi
 * /api/v1/auth/passwordreset:
 *   get:
 *     summary: Trigger a mock password reset flow
 *     tags:
 *       - Authentication
 *     responses:
 *       200:
 *         description: Temporary password reset message.
 */
authRouter.get("/passwordreset", PasswordReset().forgotpaswword);

module.exports = authRouter;
