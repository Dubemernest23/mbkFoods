require("dotenv").config();
const fs = require("fs");
const path = require("path");
const pool = require("./server/config/database.config");

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

async function seed() {
    console.log("Starting menu seeding...");
    
    try {
        const menuPath = path.join(__dirname, "public/data/menu.json");
        if (!fs.existsSync(menuPath)) {
            console.error("Error: menu.json not found at " + menuPath);
            process.exit(1);
        }
        
        const menuData = JSON.parse(fs.readFileSync(menuPath, "utf8"));
        
        const categories = menuData.categories.filter(c => c !== "All");
        console.log(`Found categories to seed: ${categories.join(", ")}`);
        
        const categoryMap = {};
        for (let i = 0; i < categories.length; i++) {
            const catName = categories[i];
            const catSlug = slugify(catName);
            
            const [existing] = await pool.query("SELECT id FROM food_categories WHERE slug = ?", [catSlug]);
            let categoryId;
            if (existing.length > 0) {
                categoryId = existing[0].id;
                console.log(`Category "${catName}" already exists with ID: ${categoryId}`);
            } else {
                const [result] = await pool.query(
                    "INSERT INTO food_categories (name, slug, sort_order) VALUES (?, ?, ?)",
                    [catName, catSlug, i * 10]
                );
                categoryId = result.insertId;
                console.log(`Seeded category "${catName}" with ID: ${categoryId}`);
            }
            categoryMap[catName] = categoryId;
        }
        
        console.log(`Found ${menuData.items.length} items to seed...`);
        for (const item of menuData.items) {
            const itemSlug = slugify(item.name);
            const categoryId = categoryMap[item.category];
            
            if (!categoryId) {
                console.warn(`Warning: Category "${item.category}" for item "${item.name}" not found. Skipping.`);
                continue;
            }
            
            const priceKobo = Number(item.price) * 100;
            
            const [existing] = await pool.query("SELECT id FROM foods WHERE slug = ?", [itemSlug]);
            if (existing.length > 0) {
                console.log(`Food item "${item.name}" already exists. Skipping.`);
            } else {
                await pool.query(
                    "INSERT INTO foods (category_id, name, slug, description, price_kobo, image_url, is_featured, is_available) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
                    [
                        categoryId,
                        item.name,
                        itemSlug,
                        item.description,
                        priceKobo,
                        item.image || null,
                        item.featured ? 1 : 0,
                        1
                    ]
                );
                console.log(`Seeded food item: "${item.name}"`);
            }
        }
        
        console.log("Seeding completed successfully!");
        
    } catch (err) {
        console.error("Seeding failed with error:", err.message, err.stack);
    } finally {
        await pool.end();
        process.exit(0);
    }
}

seed();
