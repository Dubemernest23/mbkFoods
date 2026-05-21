const menu = require("../../../public/data/menu.json");

function findAll(query = {}) {
    const { category, featured, search } = query;

    return menu.items.filter((item) => {
        const matchesCategory = !category || category === "All" || item.category === category;
        const matchesFeatured = featured === undefined || String(item.featured) === String(featured);
        const matchesSearch = !search || item.name.toLowerCase().includes(String(search).toLowerCase());

        return matchesCategory && matchesFeatured && matchesSearch;
    });
}

function findById(id) {
    return menu.items.find((item) => item.id === Number(id));
}

module.exports = {
    findAll,
    findById
};
