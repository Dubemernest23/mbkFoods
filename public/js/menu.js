document.addEventListener('DOMContentLoaded', () => {
    // MENU_DATA is loaded from js/data.js
    const menuData = typeof MENU_DATA !== 'undefined' ? MENU_DATA : { categories: [], items: [] };
    let activeCategory = 'All';
    let searchQuery = '';

    const foodContainer = document.getElementById('food-container');
    const categoryContainer = document.getElementById('category-filters');
    const searchInput = document.getElementById('menu-search');

    const formatNaira = (amount) => {
        return new Intl.NumberFormat('en-NG', {
            style: 'currency',
            currency: 'NGN',
            minimumFractionDigits: 0
        }).format(amount).replace('NGN', '₦').trim();
    };

    function init() {
        if (!menuData.items.length) {
            if (foodContainer) {
                foodContainer.innerHTML = '<div class="error-msg" style="text-align:center; padding: 40px;"><h3>Unable to load menu data.</h3></div>';
            }
            return;
        }
        renderCategories();
        renderMenu();
    }

    function renderCategories() {
        if (!categoryContainer) return;
        categoryContainer.innerHTML = menuData.categories.map(cat => `
            <button class="filter-btn ${activeCategory === cat ? 'active' : ''}" data-category="${cat}">
                ${cat}
            </button>
        `).join('');

        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                activeCategory = btn.dataset.category;
                document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                renderMenu();
            });
        });
    }

    function renderMenu() {
        if (!foodContainer) return;

        const filteredItems = menuData.items.filter(item => {
            const matchesCategory = activeCategory === 'All' || item.category === activeCategory;
            const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                                item.description.toLowerCase().includes(searchQuery.toLowerCase());
            return matchesCategory && matchesSearch;
        });

        if (filteredItems.length === 0) {
            foodContainer.innerHTML = '<div class="no-results" style="text-align:center; width:100%; grid-column: 1/-1; padding: 40px;">No dishes found matching your search.</div>';
            return;
        }

        foodContainer.innerHTML = filteredItems.map(item => `
            <div class="food-card reveal">
                <img src="${item.image}" class="food-card-img" alt="${item.name}">
                <div class="food-card-content">
                    <span class="food-category">${item.category}</span>
                    <h3 class="food-title">${item.name}</h3>
                    <p class="food-desc">${item.description}</p>
                    <div class="food-footer">
                        <span class="food-price">${formatNaira(item.price)}</span>
                        <button class="btn btn-primary btn-sm add-to-cart" data-id="${item.id}">
                            <i class="fa-solid fa-plus"></i> Add
                        </button>
                    </div>
                </div>
            </div>
        `).join('');

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('fade-in-up');
                }
            });
        });
        document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

        document.querySelectorAll('.add-to-cart').forEach(btn => {
            btn.addEventListener('click', () => {
                const id = parseInt(btn.dataset.id);
                const item = menuData.items.find(i => i.id === id);
                if (typeof addToCart === 'function') {
                    addToCart(item);
                }
            });
        });
    }

    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            searchQuery = e.target.value;
            renderMenu();
        });
    }

    init();
});
