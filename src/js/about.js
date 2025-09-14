// About page JavaScript functionality with modern animations

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

// Initialize about page with animations
document.addEventListener('DOMContentLoaded', function() {
    console.log('About page loaded');
    
    // Add scroll animations
    window.addEventListener('scroll', animateOnScroll);
    animateOnScroll(); // Initial check
    
    // Load about text from settings
    const settings = DataManager.getSettings();
    if (settings.aboutText) {
        const aboutTextElement = document.getElementById('about-text-content');
        if (aboutTextElement) {
            aboutTextElement.textContent = settings.aboutText;
        }
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

// Add CSS for animations if not already added
if (!document.getElementById('about-animations')) {
    const style = document.createElement('style');
    style.id = 'about-animations';
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
}