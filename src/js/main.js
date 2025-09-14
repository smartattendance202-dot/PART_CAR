// Main JavaScript file for Abounia Auto Parts website
// Enhanced with modern animations and interactions

// Function to add animation classes to elements when they come into view
function animateOnScroll() {
    const elements = document.querySelectorAll('.fade-in, .fade-in-up, .scale-in');

    elements.forEach(element => {
        const elementPosition = element.getBoundingClientRect().top;
        const screenPosition = window.innerHeight / 1.3;

        if (elementPosition < screenPosition) {
            element.style.opacity = 1;
            element.classList.add('animated');
        }
    });
}

// Function to render products with animations
async function renderProducts(productsToShow, containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    // If productsToShow not provided (e.g. initial load), fetch them
    if (!productsToShow) {
        productsToShow = await DataManager.getProducts();
    }

    container.innerHTML = '';

    (productsToShow || []).forEach((product, index) => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card fade-in';
        productCard.style.animationDelay = `${index * 0.1}s`;

        productCard.innerHTML = `
            <div class="product-image">
                <img src="${product.image}" alt="${product.name}">
                <div class="product-badge">جديد</div>
            </div>
            <div class="product-info">
                <h3>${product.name}</h3>
                <div class="product-models">${product.models}</div>
                <div class="product-actions">
                    <button class="btn btn-primary" onclick="openWhatsApp(${product.id})">
                        <i class="fab fa-whatsapp"></i> واتساب
                    </button>
                    <button class="btn btn-secondary" onclick="makeCall()">
                        <i class="fas fa-phone"></i> اتصال
                    </button>
                </div>
            </div>
        `;
        container.appendChild(productCard);
    });

    console.log('Rendered', productsToShow.length, 'products to', containerId);
}

// Function to open WhatsApp with pre-filled message
function openWhatsApp(productId) {
    const products = DataManager.getProducts();
    const product = products.find(p => p.id == productId);
    if (!product) return;

    const message = `مرحبًا، أستفسر عن القطعة: ${product.name} — رابط: [URL].`;
    const whatsappUrl = `https://wa.me/967772224899?text=${encodeURIComponent(message)}`;

    // Add animation effect to button
    const buttons = document.querySelectorAll(`button[onclick="openWhatsApp(${productId})"]`);
    buttons.forEach(button => {
        button.classList.add('pulse');
        setTimeout(() => {
            button.classList.remove('pulse');
        }, 1000);
    });

    // Open WhatsApp after a short delay for animation
    setTimeout(() => {
        window.open(whatsappUrl, '_blank');
    }, 500);
}

// Function to make a direct call
function makeCall() {
    // Add animation effect to button
    const buttons = document.querySelectorAll('button[onclick="makeCall()"]');
    buttons.forEach(button => {
        button.classList.add('pulse');
        setTimeout(() => {
            button.classList.remove('pulse');
        }, 1000);
    });

    // Make call after a short delay for animation
    setTimeout(() => {
        window.location.href = 'tel:772224899';
    }, 500);
}

// Function to render branches with animations
async function renderBranches() {
    const container = document.getElementById('branches-container');
    if (!container) return;

    const branches = await DataManager.getBranches();

    container.innerHTML = '';

    (branches || []).forEach((branch, index) => {
        const branchCard = document.createElement('div');
        branchCard.className = 'branch-card fade-in';
        branchCard.style.animationDelay = `${index * 0.2}s`;

        branchCard.innerHTML = `
            <div class="branch-header">
                <h3 class="branch-name">${branch.name}</h3>
                <div class="branch-phone"><i class="fas fa-phone"></i> ${branch.phone}</div>
            </div>
            <div class="branch-details">
                <div class="branch-address">
                    <i class="fas fa-map-marker-alt"></i>
                    <div>${branch.address}</div>
                </div>
                <div class="map-placeholder">
                    خريطة الموقع
                </div>
            </div>
        `;
        container.appendChild(branchCard);
    });
}

// Enhanced search functionality with integrated search for name and models
function performSearch() {
    const searchInput = document.getElementById('search-input');
    const searchTerm = searchInput.value.toLowerCase().trim();

    // Add animation to search box
    const searchBox = document.querySelector('.search-box');
    if (searchBox) {
        searchBox.classList.add('pulse');
        setTimeout(() => {
            searchBox.classList.remove('pulse');
        }, 1000);
    }

    if (!searchTerm) {
        if (document.getElementById('products-container')) {
            const products = DataManager.getProducts();
            renderProducts(products, 'products-container');
        }
        return;
    }

    // Split search term into words to search for both name and models
    const searchTerms = searchTerm.split(/\s+/);

    const products = DataManager.getProducts();
    const filteredProducts = products.filter(product => {
        // Check if all search terms match either name or models
        return searchTerms.every(term =>
            product.name.toLowerCase().includes(term) ||
            product.models.toLowerCase().includes(term)
        );
    });

    if (document.getElementById('products-container')) {
        renderProducts(filteredProducts, 'products-container');
    }
}

// Initialize the website with animations
document.addEventListener('DOMContentLoaded', async function () {
    console.log('User website loaded');

    // Add scroll animations
    window.addEventListener('scroll', animateOnScroll);

    // Trigger initial animation check
    animateOnScroll();

    // Render featured products on homepage
    if (document.getElementById('featured-products')) {
        const products = await DataManager.getProducts();
        renderProducts((products || []).slice(0, 4), 'featured-products');

        // Inject hero particles for a professional motion feel
        const hero = document.querySelector('.hero');
        if (hero && !hero.querySelector('.particles-canvas')) {
            const canvas = document.createElement('canvas');
            canvas.className = 'particles-canvas';
            hero.appendChild(canvas);
            initParticles(canvas);
        }
    }

    // Render all products on catalog page
    if (document.getElementById('products-container')) {
        const products = await DataManager.getProducts();
        renderProducts(products, 'products-container');
    }

    // Render branches
    if (document.getElementById('branches-container')) {
        renderBranches();
    }

    // Load settings (async)
    const settings = await DataManager.getSettings();
    if (settings && settings.whatsappNumber) {
        // Update WhatsApp links with the admin-configured number
        const whatsappFloat = document.querySelector('.whatsapp-float');
        if (whatsappFloat) {
            whatsappFloat.href = `https://wa.me/967${settings.whatsappNumber}`;
        }
    }

    // Inject mobile bottom navigation for app-like UI on all pages
    const bottomNav = document.createElement('nav');
    bottomNav.className = 'bottom-nav';
    const current = window.location.pathname.split('/').pop() || 'index.html';
    bottomNav.innerHTML = `
        <a href="index.html" class="${current === 'index.html' ? 'active' : ''}">
            <i class="fas fa-home icon"></i>
            <span>الرئيسية</span>
        </a>
        <a href="catalog.html" class="${current === 'catalog.html' ? 'active' : ''}">
            <i class="fas fa-th-large icon"></i>
            <span>المنتجات</span>
        </a>
        <a href="branches.html" class="${current === 'branches.html' ? 'active' : ''}">
            <i class="fas fa-store icon"></i>
            <span>الفروع</span>
        </a>
        <a href="about.html" class="${current === 'about.html' ? 'active' : ''}">
            <i class="fas fa-info-circle icon"></i>
            <span>عن المحل</span>
        </a>
        <a href="contact.html" class="${current === 'contact.html' ? 'active' : ''}">
            <i class="fas fa-phone icon"></i>
            <span>اتصل بنا</span>
        </a>`;
    document.body.appendChild(bottomNav);

    // Inject CSS for bottom-nav if missing
    if (!document.getElementById('bottom-nav-styles')) {
        const style = document.createElement('style');
        style.id = 'bottom-nav-styles';
        style.textContent = `
            .bottom-nav {
                position: fixed;
                bottom: 0; right: 0; left: 0;
                display: grid;
                grid-template-columns: repeat(5, 1fr);
                gap: 6px;
                padding: 10px 8px env(safe-area-inset-bottom);
                background: rgba(255,255,255,0.95);
                backdrop-filter: blur(10px);
                border-top: 1px solid rgba(0,0,0,0.08);
                box-shadow: 0 -8px 24px rgba(0,0,0,0.06);
                z-index: 999;
            }
            .bottom-nav a {
                display: flex; flex-direction: column; align-items: center; justify-content: center;
                gap: 4px; padding: 8px 6px; border-radius: 10px;
                color: #1e293b; font-size: 11px; font-weight: 700;
                transition: transform .2s ease, background-color .2s ease, color .2s ease;
            }
            .bottom-nav a .icon { font-size: 18px; }
            .bottom-nav a.active, .bottom-nav a:hover {
                background-color: rgba(37,99,235,.10);
                color: #2563eb;
                transform: translateY(-2px);
            }
            @media (min-width: 768px) { .bottom-nav { display:none; } }
            body { padding-bottom: 70px; }
        `;
        document.head.appendChild(style);
    }

    // Search functionality
    const searchInput = document.getElementById('search-input');
    const searchButton = document.getElementById('search-button');

    if (searchInput && searchButton) {
        searchButton.addEventListener('click', performSearch);
        searchInput.addEventListener('keyup', function (event) {
            if (event.key === 'Enter') {
                performSearch();
            }
        });
    }

    // Add hover effects to buttons
    const buttons = document.querySelectorAll('.btn');
    buttons.forEach(button => {
        button.addEventListener('mouseenter', function () {
            this.classList.add('hover');
        });

        button.addEventListener('mouseleave', function () {
            this.classList.remove('hover');
        });
    });

    // Add animation to navigation links (top and bottom nav)
    const navLinks = document.querySelectorAll('.nav a, .bottom-nav a');
    navLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            e.preventDefault();
            const href = this.getAttribute('href');

            // Add animation to current page
            document.body.classList.add('fade-out');

            // Navigate after animation
            setTimeout(() => {
                window.location.href = href;
            }, 300);
        });
    });
});

// Add CSS for animations if not already added
if (!document.getElementById('main-animations')) {
    const style = document.createElement('style');
    style.id = 'main-animations';
    style.textContent = `
        @keyframes pulse {
            0% { transform: scale(1); }
            50% { transform: scale(1.05); }
            100% { transform: scale(1); }
        }
        
        .pulse {
            animation: pulse 0.5s ease;
        }
        
        .fade-out {
            animation: fadeOut 0.5s ease forwards;
        }
        
        @keyframes fadeOut {
            from { opacity: 1; }
            to { opacity: 0; }
        }
        
        .animated {
            opacity: 1 !important;
        }
    `;
    document.head.appendChild(style);
}

// Simple particles animation for hero
function initParticles(canvas) {
    const ctx = canvas.getContext('2d');
    const particles = [];
    const max = 60; // particle count

    function resize() {
        canvas.width = canvas.clientWidth || canvas.parentElement.offsetWidth;
        canvas.height = canvas.clientHeight || canvas.parentElement.offsetHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    for (let i = 0; i < max; i++) {
        particles.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            r: Math.random() * 2 + 0.6,
            vx: (Math.random() - 0.5) * 0.6,
            vy: (Math.random() - 0.5) * 0.6,
            a: Math.random() * 0.6 + 0.2
        });
    }

    function step() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        // gradient color aligned with theme
        const grad = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
        grad.addColorStop(0, 'rgba(200,162,75,0.9)');
        grad.addColorStop(1, 'rgba(239,68,68,0.9)');
        ctx.fillStyle = grad;

        particles.forEach(p => {
            p.x += p.vx;
            p.y += p.vy;
            if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
            if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
            ctx.globalAlpha = p.a;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
            ctx.fill();
        });

        requestAnimationFrame(step);
    }
    step();
}