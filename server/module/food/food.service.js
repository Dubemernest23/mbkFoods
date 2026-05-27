const pool = require("../../config/database.config");

function slugify(text) {
    return text
        .toString()
        .toLowerCase()
        .replace(/\s+/g, "-")           // Replace spaces with -
        .replace(/[^\w\-]+/g, "")       // Remove all non-word chars
        .replace(/\-\-+/g, "-")         // Replace multiple - with single -
        .replace(/^-+/, "")             // Trim - from start
        .replace(/-+$/, "");            // Trim - from end
}

async function findAll(query = {}) {
    const { category, featured, search } = query;
    let sql = `
        SELECT f.id, f.name, f.slug, f.description, f.price_kobo, f.image_url, f.is_featured, f.is_available, f.stock_quantity, c.name AS category
        FROM foods f
        JOIN food_categories c ON f.category_id = c.id
        WHERE f.is_available = TRUE
    `;
    const params = [];

    if (category && category !== "All") {
        sql += " AND (c.name = ? OR c.slug = ?)";
        params.push(category, category);
    }

    if (featured !== undefined) {
        sql += " AND f.is_featured = ?";
        params.push(featured === "true" || featured === true || featured === "1" || featured === 1 ? 1 : 0);
    }

    if (search) {
        sql += " AND (f.name LIKE ? OR f.description LIKE ?)";
        params.push(`%${search}%`, `%${search}%`);
    }

    sql += " ORDER BY c.sort_order ASC, f.name ASC";

    const [rows] = await pool.query(sql, params);
    return rows;
}

async function findById(id) {
    const [rows] = await pool.query(`
        SELECT f.id, f.name, f.slug, f.description, f.price_kobo, f.image_url, f.is_featured, f.is_available, f.stock_quantity, c.name AS category, f.category_id
        FROM foods f
        JOIN food_categories c ON f.category_id = c.id
        WHERE f.id = ?
    `, [Number(id)]);
    return rows[0] || null;
}

async function findBySlug(slug) {
    const [rows] = await pool.query(`
        SELECT id, name, slug FROM foods WHERE slug = ?
    `, [slug]);
    return rows[0] || null;
}

async function create(foodData) {
    const { category_id, name, description, price_kobo, image_url, is_featured = false, is_available = true, stock_quantity = null } = foodData;
    const slug = slugify(name);
    
    const [result] = await pool.query(
        "INSERT INTO foods (category_id, name, slug, description, price_kobo, image_url, is_featured, is_available, stock_quantity) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
        [category_id, name, slug, description || null, price_kobo, image_url || null, is_featured ? 1 : 0, is_available ? 1 : 0, stock_quantity]
    );
    
    return findById(result.insertId);
}

async function update(id, foodData) {
    const { category_id, name, description, price_kobo, image_url, is_featured, is_available, stock_quantity } = foodData;
    const fields = [];
    const values = [];
    
    if (category_id !== undefined) {
        fields.push("category_id = ?");
        values.push(category_id);
    }
    if (name !== undefined) {
        fields.push("name = ?");
        fields.push("slug = ?");
        values.push(name, slugify(name));
    }
    if (description !== undefined) {
        fields.push("description = ?");
        values.push(description);
    }
    if (price_kobo !== undefined) {
        fields.push("price_kobo = ?");
        values.push(price_kobo);
    }
    if (image_url !== undefined) {
        fields.push("image_url = ?");
        values.push(image_url);
    }
    if (is_featured !== undefined) {
        fields.push("is_featured = ?");
        values.push(is_featured ? 1 : 0);
    }
    if (is_available !== undefined) {
        fields.push("is_available = ?");
        values.push(is_available ? 1 : 0);
    }
    if (stock_quantity !== undefined) {
        fields.push("stock_quantity = ?");
        values.push(stock_quantity);
    }
    
    if (fields.length === 0) {
        return findById(id);
    }
    
    values.push(Number(id));
    await pool.query(
        `UPDATE foods SET ${fields.join(", ")} WHERE id = ?`,
        values
    );
    
    return findById(id);
}

async function deleteById(id) {
    const [result] = await pool.query("UPDATE foods SET is_available = FALSE WHERE id = ?", [Number(id)]);
    return result.affectedRows > 0;
}

module.exports = {
    findAll,
    findById,
    findBySlug,
    create,
    update,
    deleteById
};
