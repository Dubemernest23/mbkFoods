const pool = require("../../config/database.config");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");

async function register(userData) {
    const { full_name, email, phone, password, role = "customer" } = userData;
    const public_id = crypto.randomUUID();
    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(password, salt);

    const [result] = await pool.query(
        "INSERT INTO users (public_id, full_name, email, phone, password_hash, role, status) VALUES (?, ?, ?, ?, ?, ?, 'active')",
        [public_id, full_name, email, phone || null, password_hash, role]
    );

    const [rows] = await pool.query(
        "SELECT id, public_id, full_name, email, phone, role, status FROM users WHERE id = ?",
        [result.insertId]
    );
    return rows[0];
}

async function findByEmail(email) {
    const [rows] = await pool.query(
        "SELECT id, public_id, full_name, email, phone, password_hash, role, status FROM users WHERE email = ? AND status != 'deleted'",
        [email]
    );
    return rows[0] || null;
}

module.exports = {
    register,
    findByEmail
};
