// Admin dashboard JavaScript functionality with modern animations

// Update dashboard statistics with animations
async function updateDashboardStats() {
    const products = await DataManager.getProducts();
    const branches = await DataManager.getBranches();

    const dashboardStats = {
        totalProducts: (products || []).length,
        totalBranches: (branches || []).length,
        totalVisits: 2450,
        popularProducts: 12
    };

    const statElements = [
        { id: 'totalProducts', value: dashboardStats.totalProducts },
        { id: 'totalBranches', value: dashboardStats.totalBranches },
        { id: 'totalVisits', value: dashboardStats.totalVisits },
        { id: 'popularProducts', value: dashboardStats.popularProducts }
    ];

    statElements.forEach((stat, index) => {
        const element = document.getElementById(stat.id);
        if (element) {
            setTimeout(() => {
                element.classList.add('fade-in-up');
                element.style.animationDelay = `${index * 0.2}s`;
                element.textContent = stat.value;
            }, 300);
        }
    });
}

// Render recent activity with animations
function renderRecentActivity() {
    const activityContainer = document.getElementById('recentActivity');
    if (!activityContainer) return;

    // In a real app, this would come from actual activity logs
    const recentActivity = [
        { product: 'فلتر هواء ممتاز', date: '2025-09-10', activity: 'تم إضافة المنتج' },
        { product: 'زيت محرك عالي الجودة', date: '2025-09-09', activity: 'تم تحديث المخزون' },
        { product: 'فرع صنعاء الرئيسي', date: '2025-09-08', activity: 'تم تحديث المعلومات' },
        { product: 'بطارية سيارة قوية', date: '2025-09-07', activity: 'تم إضافة المنتج' }
    ];

    activityContainer.innerHTML = '';

    recentActivity.forEach((activity, index) => {
        const row = document.createElement('tr');
        row.className = 'fade-in';
        row.style.animationDelay = `${index * 0.1}s`;

        row.innerHTML = `
            <td>${activity.product}</td>
            <td>${activity.date}</td>
            <td>${activity.activity}</td>
        `;
        activityContainer.appendChild(row);
    });
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

// Initialize dashboard with animations
document.addEventListener('DOMContentLoaded', function () {
    console.log('Admin dashboard loaded');

    // Add scroll animations
    window.addEventListener('scroll', animateOnScroll);
    animateOnScroll(); // Initial check

    updateDashboardStats();
    renderRecentActivity();

    // Add hover effects to stat cards
    const statCards = document.querySelectorAll('.stat-card');
    statCards.forEach(card => {
        card.addEventListener('mouseenter', function () {
            this.style.transform = 'translateY(-5px)';
            this.style.boxShadow = '0 15px 30px rgba(0, 0, 0, 0.15)';
        });

        card.addEventListener('mouseleave', function () {
            this.style.transform = 'translateY(0)';
            this.style.boxShadow = 'var(--box-shadow)';
        });
    });

    // Add hover effects to table rows
    const tableRows = document.querySelectorAll('.admin-table tbody tr');
    tableRows.forEach(row => {
        row.addEventListener('mouseenter', function () {
            this.style.transform = 'scale(1.01)';
        });

        row.addEventListener('mouseleave', function () {
            this.style.transform = 'scale(1)';
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
    @keyframes fadeIn {
        from {
            opacity: 0;
            transform: translateY(20px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    @keyframes fadeInUp {
        from {
            opacity: 0;
            transform: translateY(30px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    .fade-in {
        animation: fadeIn 0.6s ease-out forwards;
        opacity: 0;
    }
    
    .fade-in-up {
        animation: fadeInUp 0.6s ease-out forwards;
        opacity: 0;
    }
    
    .animated {
        opacity: 1 !important;
    }
    
    .hover {
        transform: translateY(-3px);
    }
`;
document.head.appendChild(style);