const express = require("express");
const adminRouter = express.Router();

const {
    createAdmin,
    deleteAdmin,
    getAdmin,
    getAllAdmins,
    updateAdmin
} = require("./admin.controller");
const { requireAdmin } = require("../../middleware/authMiddleware");

/**
 * @openapi
 * components:
 *   schemas:
 *     Admin:
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
 *           example: Jane Doe
 *         email:
 *           type: string
 *           format: email
 *           example: jane.doe@mbkfood.com
 *         phone:
 *           type: string
 *           example: "+2348012345678"
 *         role:
 *           type: string
 *           enum: [admin, super_admin]
 *           example: admin
 *         status:
 *           type: string
 *           enum: [active, blocked, deleted]
 *           example: active
 *         created_at:
 *           type: string
 *           format: date-time
 *           example: "2026-05-27T22:00:00.000Z"
 *         updated_at:
 *           type: string
 *           format: date-time
 *           example: "2026-05-27T22:00:00.000Z"
 */

/**
 * @openapi
 * /api/v1/admins:
 *   get:
 *     summary: Retrieve a list of all active admins
 *     tags:
 *       - Admin
 *     responses:
 *       200:
 *         description: A JSON array of admin objects.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 count:
 *                   type: integer
 *                   example: 2
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Admin'
 *   post:
 *     summary: Create a new admin user
 *     tags:
 *       - Admin
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
 *                 example: Jane Doe
 *               email:
 *                 type: string
 *                 format: email
 *                 example: jane.doe@mbkfood.com
 *               phone:
 *                 type: string
 *                 example: "+2348012345678"
 *               password:
 *                 type: string
 *                 format: password
 *                 example: "SuperSecurePassword123"
 *               role:
 *                 type: string
 *                 enum: [admin, super_admin]
 *                 example: admin
 *     responses:
 *       201:
 *         description: Admin user created successfully.
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
 *                   example: Admin created successfully
 *                 data:
 *                   $ref: '#/components/schemas/Admin'
 *       400:
 *         description: Missing fields or email already exists.
 */
adminRouter.get("/", getAllAdmins);
adminRouter.post("/", createAdmin);

/**
 * @openapi
 * /api/v1/admins/{id}:
 *   get:
 *     summary: Retrieve details of a single admin by ID or public ID
 *     tags:
 *       - Admin
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The numeric ID or UUID public_id of the admin
 *     responses:
 *       200:
 *         description: Details of the requested admin.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Admin'
 *       404:
 *         description: Admin not found.
 *   put:
 *     summary: Update an admin's details
 *     tags:
 *       - Admin
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The numeric ID or UUID public_id of the admin to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               full_name:
 *                 type: string
 *                 example: Jane Smith
 *               phone:
 *                 type: string
 *                 example: "+2348098765432"
 *               role:
 *                 type: string
 *                 enum: [admin, super_admin]
 *               status:
 *                 type: string
 *                 enum: [active, blocked]
 *               password:
 *                 type: string
 *                 example: "NewSecurePassword123"
 *     responses:
 *       200:
 *         description: Admin updated successfully.
 *       404:
 *         description: Admin not found.
 *   delete:
 *     summary: Soft-delete an admin user (Requires Admin/Super Admin JWT)
 *     tags:
 *       - Admin
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The numeric ID or UUID public_id of the admin to delete
 *     responses:
 *       200:
 *         description: Admin successfully deleted.
 *       401:
 *         description: Unauthorized. JWT missing or invalid.
 *       403:
 *         description: Forbidden. Requires admin permissions.
 *       404:
 *         description: Admin not found.
 */
adminRouter.get("/:id", getAdmin);
adminRouter.put("/:id", updateAdmin);
adminRouter.delete("/:id", requireAdmin, deleteAdmin);

module.exports = adminRouter;
