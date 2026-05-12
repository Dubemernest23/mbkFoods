let cart = JSON.parse(localStorage.getItem('mbk_cart')) || [];

const cartDrawer = document.getElementById('cart-drawer');
const cartOverlay = document.getElementById('cart-overlay');
const cartToggle = document.getElementById('cart-toggle');
const closeCart = document.getElementById('close-cart');
const cartItemsContainer = document.getElementById('cart-items');
const cartTotalPrice = document.getElementById('cart-total-price');
const checkoutBtn = document.getElementById('checkout-btn');

function openCart() {
    if (!cartDrawer || !cartOverlay) return;
    cartDrawer.classList.add('open');
    cartOverlay.classList.add('open');
    cartDrawer.setAttribute('aria-hidden', 'false');
}

function closeCartDrawer() {
    if (!cartDrawer || !cartOverlay) return;
    cartDrawer.classList.remove('open');
    cartOverlay.classList.remove('open');
    cartDrawer.setAttribute('aria-hidden', 'true');
}

if (cartToggle) {
    cartToggle.addEventListener('click', () => {
        renderCart();
        openCart();
    });
}

if (closeCart) {
    closeCart.addEventListener('click', closeCartDrawer);
}

if (cartOverlay) {
    cartOverlay.addEventListener('click', closeCartDrawer);
}

function addToCart(item) {
    if (!item) return;

    const existingItem = cart.find(i => i.id === item.id);
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ ...item, quantity: 1 });
    }
    
    saveCart();
    updateCartCount();
    renderCart();
    openCart();
}

function saveCart() {
    localStorage.setItem('mbk_cart', JSON.stringify(cart));
}

const formatNaira = (amount) => {
    return new Intl.NumberFormat('en-NG', {
        style: 'currency',
        currency: 'NGN',
        minimumFractionDigits: 0
    }).format(amount).replace('NGN', '₦').trim();
};

function renderCart() {
    if (!cartItemsContainer) return;

    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<div class="empty-cart-msg">Your cart is empty.</div>';
        if (cartTotalPrice) cartTotalPrice.textContent = '₦0';
        return;
    }

    cartItemsContainer.innerHTML = cart.map(item => `
        <div class="cart-item">
            <img src="${item.image}" alt="${item.name}" class="cart-item-img">
            <div class="cart-item-info">
                <h4>${item.name}</h4>
                <span>${formatNaira(item.price)}</span>
            </div>
            <div class="quantity-controls">
                <button type="button" aria-label="Reduce ${item.name}" data-quantity-id="${item.id}" data-change="-1">-</button>
                <span>${item.quantity}</span>
                <button type="button" aria-label="Increase ${item.name}" data-quantity-id="${item.id}" data-change="1">+</button>
            </div>
        </div>
    `).join('');

    const total = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    if (cartTotalPrice) cartTotalPrice.textContent = formatNaira(total);
}

function updateQuantity(id, change) {
    const item = cart.find(i => i.id === id);
    if (item) {
        item.quantity += change;
        if (item.quantity <= 0) {
            cart = cart.filter(i => i.id !== id);
        }
        saveCart();
        updateCartCount();
        renderCart();
    }
}

if (cartItemsContainer) {
    cartItemsContainer.addEventListener('click', (event) => {
        const button = event.target.closest('[data-quantity-id]');
        if (!button) return;
        updateQuantity(Number(button.dataset.quantityId), Number(button.dataset.change));
    });
}

if (checkoutBtn) {
    checkoutBtn.addEventListener('click', () => {
        if (cart.length > 0) {
            const checkoutPath = window.location.pathname.includes('/pages/')
                ? 'checkout.html'
                : 'pages/checkout.html';
            window.location.href = checkoutPath;
        } else {
            alert('Your cart is empty!');
        }
    });
}

document.addEventListener('DOMContentLoaded', () => {
    renderCart();
});
