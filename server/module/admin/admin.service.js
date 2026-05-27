const pool = require("../../config/database.config");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");

async function findAll() {
    const [rows] = await pool.query(
        "SELECT id, public_id, full_name, email, phone, role, status, created_at, updated_at FROM users WHERE role IN ('admin', 'super_admin') AND status != 'deleted' ORDER BY id ASC"
    );
    return rows;
}

async function findById(id) {
    let query = "SELECT id, public_id, full_name, email, phone, role, status, created_at, updated_at FROM users WHERE role IN ('admin', 'super_admin') AND status != 'deleted' AND ";
    let param;
    if (isNaN(id) || String(id).length > 10) {
        query += "public_id = ?";
        param = String(id);
    } else {
        query += "id = ?";
        param = Number(id);
    }
    
    const [rows] = await pool.query(query, [param]);
    return rows[0] || null;
}

async function findByEmail(email) {
    const [rows] = await pool.query(
        "SELECT id, public_id, full_name, email, phone, role, status, password_hash FROM users WHERE email = ? AND status != 'deleted'",
        [email]
    );
    return rows[0] || null;
}

async function create(adminData) {
    const { full_name, email, phone, password, role = "admin" } = adminData;
    const public_id = crypto.randomUUID();
    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(password, salt);
    
    const [result] = await pool.query(
        "INSERT INTO users (public_id, full_name, email, phone, password_hash, role, status) VALUES (?, ?, ?, ?, ?, ?, 'active')",
        [public_id, full_name, email, phone || null, password_hash, role]
    );
    
    return findById(result.insertId);
}

async function update(id, adminData) {
    const { full_name, phone, role, status, password } = adminData;
    const fields = [];
    const values = [];
    
    if (full_name !== undefined) {
        fields.push("full_name = ?");
        values.push(full_name);
    }
    if (phone !== undefined) {
        fields.push("phone = ?");
        values.push(phone);
    }
    if (role !== undefined) {
        fields.push("role = ?");
        values.push(role);
    }
    if (status !== undefined) {
        fields.push("status = ?");
        values.push(status);
    }
    if (password !== undefined && password !== "") {
        const salt = await bcrypt.genSalt(10);
        const password_hash = await bcrypt.hash(password, salt);
        fields.push("password_hash = ?");
        values.push(password_hash);
    }
    
    if (fields.length === 0) {
        return findById(id);
    }
    
    let query = `UPDATE users SET ${fields.join(", ")} WHERE role IN ('admin', 'super_admin') AND status != 'deleted' AND `;
    let param;
    if (isNaN(id) || String(id).length > 10) {
        query += "public_id = ?";
        param = String(id);
    } else {
        query += "id = ?";
        param = Number(id);
    }
    
    values.push(param);
    await pool.query(query, values);
    return findById(id);
}

async function deleteById(id) {
    let query = "UPDATE users SET status = 'deleted' WHERE role IN ('admin', 'super_admin') AND ";
    let param;
    if (isNaN(id) || String(id).length > 10) {
        query += "public_id = ?";
        param = String(id);
    } else {
        query += "id = ?";
        param = Number(id);
    }
    
    const [result] = await pool.query(query, [param]);
    return result.affectedRows > 0;
}

module.exports = {
    findAll,
    findById,
    findByEmail,
    create,
    update,
    deleteById
};