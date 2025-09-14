// Admin panel JavaScript functionality with modern animations

// Sample admin users (in a real app, this would be handled server-side)
const adminUsers = [
    { username: 'admin', password: 'admin123' }
];

// Check if user is logged in
function isLoggedIn() {
    return localStorage.getItem('adminLoggedIn') === 'true';
}

// Login function
function login(username, password) {
    const user = adminUsers.find(u => u.username === username && u.password === password);
    if (user) {
        localStorage.setItem('adminLoggedIn', 'true');
        return true;
    }
    return false;
}

// Logout function
function logout() {
    localStorage.removeItem('adminLoggedIn');
    window.location.href = 'login.html';
}

// Redirect to login if not logged in (for protected pages)
function checkAuth() {
    if (!isLoggedIn() && !window.location.pathname.includes('login.html')) {
        window.location.href = 'login.html';
    }

    if (isLoggedIn() && window.location.pathname.includes('login.html')) {
        window.location.href = 'dashboard.html';
    }
}

// Add animation classes to elements when they come into view
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

// Initialize admin panel with animations
document.addEventListener('DOMContentLoaded', function () {
    checkAuth();

    // Add scroll animations
    window.addEventListener('scroll', animateOnScroll);
    animateOnScroll(); // Initial check

    const loginForm = document.getElementById('adminLoginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', function (e) {
            e.preventDefault();

            // Add animation to login button
            const loginBtn = loginForm.querySelector('button[type="submit"]');
            loginBtn.classList.add('pulse');

            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;

            // Simulate login process with animation
            setTimeout(() => {
                loginBtn.classList.remove('pulse');

                if (login(username, password)) {
                    // Add success animation
                    loginForm.style.transform = 'translateY(-10px)';
                    loginForm.style.opacity = '0.9';

                    // Navigate after animation
                    setTimeout(() => {
                        window.location.href = 'dashboard.html';
                    }, 500);
                } else {
                    // Add error animation
                    loginForm.classList.add('shake');
                    setTimeout(() => {
                        loginForm.classList.remove('shake');
                    }, 1000);

                    alert('اسم المستخدم أو كلمة المرور غير صحيحة');
                }
            }, 1000);
        });
    }

    // Handle logout button
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function (e) {
            e.preventDefault();

            // Add animation to logout button
            this.classList.add('pulse');
            setTimeout(() => {
                this.classList.remove('pulse');
            }, 1000);

            logout();
        });
    }

    // Close modal when clicking on close button or outside modal
    const modalCloseButtons = document.querySelectorAll('.admin-modal-close');
    modalCloseButtons.forEach(button => {
        button.addEventListener('click', function () {
            const modal = this.closest('.admin-modal');
            if (modal) {
                // Add closing animation
                modal.querySelector('.admin-modal-content').style.animation = 'fadeOut 0.3s ease-out forwards';
                setTimeout(() => {
                    modal.classList.remove('show');
                    modal.querySelector('.admin-modal-content').style.animation = '';
                }, 300);
            }
        });
    });

    window.addEventListener('click', function (e) {
        const modals = document.querySelectorAll('.admin-modal');
        modals.forEach(modal => {
            if (e.target === modal) {
                // Add closing animation
                modal.querySelector('.admin-modal-content').style.animation = 'fadeOut 0.3s ease-out forwards';
                setTimeout(() => {
                    modal.classList.remove('show');
                    modal.querySelector('.admin-modal-content').style.animation = '';
                }, 300);
            }
        });
    });

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
});

// Add CSS for animations
const style = document.createElement('style');
style.textContent = `
    @keyframes pulse {
        0% { transform: scale(1); }
        50% { transform: scale(1.05); }
        100% { transform: scale(1); }
    }
    
    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        20%, 60% { transform: translateX(-10px); }
        40%, 80% { transform: translateX(10px); }
    }
    
    @keyframes fadeOut {
        from { opacity: 1; transform: scale(1); }
        to { opacity: 0; transform: scale(0.9); }
    }
    
    .pulse {
        animation: pulse 0.5s ease;
    }
    
    .shake {
        animation: shake 0.5s ease;
    }
    
    .animated {
        opacity: 1 !important;
    }
    
    .hover {
        transform: translateY(-3px);
    }
`;
document.head.appendChild(style);

// Inject mobile-style bottom navigation for admin pages
document.addEventListener('DOMContentLoaded', function () {
    if (!window.location.pathname.includes('/admin/') || window.location.pathname.endsWith('login.html')) return;

    // Ensure fade-out animation exists
    if (!document.getElementById('admin-animations')) {
        const s = document.createElement('style');
        s.id = 'admin-animations';
        s.textContent = `
            .fade-out { animation: fadeOut 0.3s ease forwards; }
            @keyframes fadeOut { from { opacity: 1; } to { opacity: 0; } }
        `;
        document.head.appendChild(s);
    }

    const adminBottom = document.createElement('nav');
    adminBottom.className = 'admin-bottom-nav';
    const current = window.location.pathname.split('/').pop() || 'dashboard.html';
    adminBottom.innerHTML = `
        <a href="dashboard.html" class="${current === 'dashboard.html' ? 'active' : ''}">
            <i class="fas fa-home icon"></i>
            <span>الرئيسية</span>
        </a>
        <a href="products.html" class="${current === 'products.html' ? 'active' : ''}">
            <i class="fas fa-boxes icon"></i>
            <span>المنتجات</span>
        </a>
        <a href="branches.html" class="${current === 'branches.html' ? 'active' : ''}">
            <i class="fas fa-building icon"></i>
            <span>الفروع</span>
        </a>
        <a href="settings.html" class="${current === 'settings.html' ? 'active' : ''}">
            <i class="fas fa-cog icon"></i>
            <span>الإعدادات</span>
        </a>`;
    document.body.appendChild(adminBottom);

    // Animate navigation transitions for both top and bottom admin navs
    const adminNavLinks = document.querySelectorAll('.admin-nav a, .admin-bottom-nav a');
    adminNavLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (!href) return;
            e.preventDefault();
            document.body.classList.add('fade-out');
            setTimeout(() => { window.location.href = href; }, 250);
        });
    });
});