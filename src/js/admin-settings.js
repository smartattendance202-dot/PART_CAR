// Admin settings JavaScript functionality with modern animations

// Load settings into form with animation
function loadSettings() {
    const settings = DataManager.getSettings();
    
    const formElements = [
        { id: 'aboutText', value: settings.aboutText || '' },
        { id: 'contactNumbers', value: settings.contactNumbers || '' },
        { id: 'whatsappNumber', value: settings.whatsappNumber || '' }
    ];
    
    formElements.forEach((element, index) => {
        const field = document.getElementById(element.id);
        if (field) {
            setTimeout(() => {
                field.classList.add('fade-in');
                field.style.animationDelay = `${index * 0.2}s`;
                field.value = element.value;
            }, 300);
        }
    });
}

// Handle settings form submission with animation
function handleSettingsFormSubmit(e) {
    e.preventDefault();
    
    // Add animation to submit button
    const submitBtn = document.querySelector('#settingsForm button[type="submit"]');
    if (submitBtn) {
        submitBtn.classList.add('pulse');
    }
    
    // Update settings
    const settings = {
        aboutText: document.getElementById('aboutText').value,
        contactNumbers: document.getElementById('contactNumbers').value,
        whatsappNumber: document.getElementById('whatsappNumber').value
    };
    
    DataManager.saveSettings(settings);
    
    // Simulate save process with animation
    setTimeout(() => {
        if (submitBtn) {
            submitBtn.classList.remove('pulse');
        }
        
        // Show success message with animation
        showSuccessMessage('تم حفظ الإعدادات بنجاح!', 'تم تحديث إعدادات الموقع بنجاح');
    }, 1000);
}

// Show success message
function showSuccessMessage(title, message) {
    const successMessage = document.createElement('div');
    successMessage.className = 'alert fade-in';
    successMessage.innerHTML = `
        <div style="
            background: linear-gradient(135deg, #10b981, #059669);
            color: white;
            padding: 20px;
            border-radius: 12px;
            text-align: center;
            margin: 20px 0;
            box-shadow: 0 4px 20px rgba(16, 185, 129, 0.3);
            animation: fadeIn 0.5s ease-out;
        ">
            <i class="fas fa-check-circle" style="font-size: 3rem; margin-bottom: 15px;"></i>
            <h3 style="margin-bottom: 10px;">${title}</h3>
            <p>${message}</p>
        </div>
    `;
    
    const form = document.getElementById('settingsForm');
    if (form && form.parentNode) {
        form.parentNode.insertBefore(successMessage, form.nextSibling);
        
        // Remove success message after 5 seconds
        setTimeout(() => {
            if (successMessage.parentNode) {
                successMessage.style.opacity = '0';
                successMessage.style.transform = 'translateY(-20px)';
                setTimeout(() => {
                    if (successMessage.parentNode) {
                        successMessage.parentNode.removeChild(successMessage);
                    }
                }, 500);
            }
        }, 5000);
    }
}

// Add animation classes to elements when they come into view
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

// Initialize settings page with animations
document.addEventListener('DOMContentLoaded', function() {
    console.log('Admin settings loaded');
    
    // Add scroll animations
    window.addEventListener('scroll', animateOnScroll);
    animateOnScroll(); // Initial check
    
    loadSettings();
    
    // Handle settings form submission
    const settingsForm = document.getElementById('settingsForm');
    if (settingsForm) {
        settingsForm.addEventListener('submit', handleSettingsFormSubmit);
    }
    
    // Add focus effects to form inputs
    const formInputs = document.querySelectorAll('.form-group input, .form-group textarea');
    formInputs.forEach(input => {
        input.addEventListener('focus', function() {
            this.parentElement.classList.add('focused');
        });
        
        input.addEventListener('blur', function() {
            this.parentElement.classList.remove('focused');
        });
    });
    
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
if (!document.getElementById('admin-settings-animations')) {
    const style = document.createElement('style');
    style.id = 'admin-settings-animations';
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
        
        @keyframes pulse {
            0% { transform: scale(1); }
            50% { transform: scale(1.05); }
            100% { transform: scale(1); }
        }
        
        .fade-in {
            animation: fadeIn 0.6s ease-out forwards;
            opacity: 0;
        }
        
        .fade-in-up {
            animation: fadeIn 0.6s ease-out forwards;
            opacity: 0;
        }
        
        .pulse {
            animation: pulse 0.5s ease;
        }
        
        .form-group.focused label {
            color: #2563eb;
            transform: translateY(-25px);
            font-size: 0.9rem;
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