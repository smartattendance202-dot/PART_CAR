// Catalog page JavaScript functionality with modern animations

document.addEventListener('DOMContentLoaded', function() {
    console.log('Catalog page loaded');
    
    // Add scroll animations
    function animateOnScroll() {
        const elements = document.querySelectorAll('.fade-in, .fade-in-up');
        elements.forEach(element => {
            const elementPosition = element.getBoundingClientRect().top;
            const screenPosition = window.innerHeight / 1.3;
            
            if (elementPosition < screenPosition) {
                element.style.opacity = 1;
                element.classList.add('animated');
            }
        });
    }
    
    window.addEventListener('scroll', animateOnScroll);
    animateOnScroll(); // Initial check
    
    // Add hover effects to product cards
    const productCards = document.querySelectorAll('.product-card');
    productCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px)';
            this.style.boxShadow = '0 15px 30px rgba(0, 0, 0, 0.15)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
            this.style.boxShadow = 'var(--box-shadow)';
        });
    });
    
    // Add animation to search box
    const searchBox = document.querySelector('.search-box');
    if (searchBox) {
        searchBox.classList.add('fade-in-up');
    }
    
    // Add focus effect to search input
    const searchInput = document.getElementById('search-input');
    if (searchInput) {
        searchInput.addEventListener('focus', function() {
            searchBox.style.transform = 'translateY(-3px)';
            searchBox.style.boxShadow = '0 8px 30px rgba(0, 0, 0, 0.15)';
        });
        
        searchInput.addEventListener('blur', function() {
            searchBox.style.transform = 'translateY(0)';
            searchBox.style.boxShadow = 'var(--box-shadow)';
        });
    }
    
    // Add hover effects to buttons
    const buttons = document.querySelectorAll('.btn');
    buttons.forEach(button => {
        button.addEventListener('mouseenter', function() {
            this.classList.add('hover');
        });
        
        button.addEventListener('mouseleave', function() {
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
    
    .fade-in {
        animation: fadeIn 0.6s ease-out forwards;
        opacity: 0;
    }
    
    .fade-in-up {
        animation: fadeIn 0.6s ease-out forwards;
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