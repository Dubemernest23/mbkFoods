const navbar = document.getElementById('navbar');

if (navbar) {
    const handleNavbarState = () => {
        if (window.scrollY > 50 || navbar.dataset.fixed === 'true') {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    };

    window.addEventListener('scroll', handleNavbarState);
    handleNavbarState();
}

// Update Cart Count
function updateCartCount() {
    const cartCountElement = document.getElementById('cart-count');
    if (!cartCountElement) return;
    
    const cart = JSON.parse(localStorage.getItem('mbk_cart')) || [];
    const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);
    cartCountElement.textContent = totalItems;
    
    // Add a little pop animation
    cartCountElement.classList.add('pop');
    setTimeout(() => cartCountElement.classList.remove('pop'), 300);
}

// Initial Call
document.addEventListener('DOMContentLoaded', () => {
    updateCartCount();

    const menuToggle = document.querySelector('.mobile-menu-toggle');
    const navLinks = document.querySelector('.nav-links');

    if (menuToggle && navLinks) {
        const closeMobileMenu = () => {
            navLinks.classList.remove('open');
            menuToggle.setAttribute('aria-expanded', 'false');
            menuToggle.setAttribute('aria-label', 'Open navigation menu');
            menuToggle.innerHTML = '<i class="fa-solid fa-bars"></i>';
        };

        menuToggle.addEventListener('click', () => {
            const isOpen = navLinks.classList.toggle('open');
            menuToggle.setAttribute('aria-expanded', String(isOpen));
            menuToggle.setAttribute('aria-label', isOpen ? 'Close navigation menu' : 'Open navigation menu');
            menuToggle.innerHTML = isOpen
                ? '<i class="fa-solid fa-xmark"></i>'
                : '<i class="fa-solid fa-bars"></i>';
        });

        navLinks.querySelectorAll('a').forEach((link) => {
            link.addEventListener('click', closeMobileMenu);
        });

        window.addEventListener('resize', () => {
            if (window.innerWidth > 700) closeMobileMenu();
        });
    }
    
    // Reveal animations on scroll
    const observerOptions = {
        threshold: 0.1
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in-up');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', (event) => {
            event.preventDefault();
            contactForm.reset();
            alert('Thanks for reaching out. We will get back to you shortly.');
        });
    }
});

// Cart CSS Animation (Inject dynamically)
const style = document.createElement('style');
style.textContent = `
    .pop {
        transform: scale(1.4);
    }
    #cart-count {
        transition: transform 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    }
`;
document.head.appendChild(style);
