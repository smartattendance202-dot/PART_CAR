// Product details page JavaScript functionality with modern animations

// Get product ID from URL parameter
function getProductIdFromURL() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('id');
}

// Display product details with animations
function displayProductDetails(productId) {
    // In a real application, this would fetch from a database
    // For now, we'll use the sample data from main.js
    const product = products.find(p => p.id == productId);
    
    if (!product) {
        document.querySelector('.product-details-container').innerHTML = `
            <div class="text-center fade-in" style="grid-column: 1 / -1;">
                <h2>المنتج غير موجود</h2>
                <a href="catalog.html" class="btn btn-primary">العودة إلى الكتالوج</a>
            </div>
        `;
        return;
    }
    
    // Add fade-in animation to container
    const container = document.querySelector('.product-details-container');
    container.classList.add('fade-in');
    
    // Update product image with animation
    const productImage = document.getElementById('product-image');
    productImage.src = product.image;
    productImage.alt = product.name;
    productImage.classList.add('scale-in');
    
    // Update product name with animation
    const productName = document.getElementById('product-name');
    productName.textContent = product.name;
    productName.classList.add('fade-in-up');
    
    // Update models list with animation
    const modelsList = document.getElementById('product-models-list');
    modelsList.innerHTML = '';
    
    product.models.split(',').forEach((model, index) => {
        const listItem = document.createElement('li');
        listItem.textContent = model.trim();
        listItem.classList.add('fade-in');
        listItem.style.animationDelay = `${index * 0.1}s`;
        modelsList.appendChild(listItem);
    });
    
    // Set up WhatsApp inquiry button with animation
    const whatsappBtn = document.getElementById('whatsapp-inquiry');
    whatsappBtn.addEventListener('click', function() {
        // Add pulse animation
        this.classList.add('pulse');
        setTimeout(() => {
            this.classList.remove('pulse');
        }, 1000);
        
        // Open WhatsApp after animation
        setTimeout(() => {
            const message = `مرحبًا، أستفسر عن القطعة: ${product.name} — رابط: [URL].`;
            const whatsappUrl = `https://wa.me/967772224899?text=${encodeURIComponent(message)}`;
            window.open(whatsappUrl, '_blank');
        }, 500);
    });
    
    // Set up direct call button with animation
    const callBtn = document.getElementById('direct-call');
    callBtn.addEventListener('click', function() {
        // Add pulse animation
        this.classList.add('pulse');
        setTimeout(() => {
            this.classList.remove('pulse');
        }, 1000);
        
        // Make call after animation
        setTimeout(() => {
            window.location.href = 'tel:772224899';
        }, 500);
    });
    
    // Add animation to back button
    const backBtn = document.querySelector('.back-to-catalog a');
    backBtn.addEventListener('click', function(e) {
        e.preventDefault();
        document.body.classList.add('fade-out');
        setTimeout(() => {
            window.location.href = 'catalog.html';
        }, 500);
    });
}

// Initialize product details page
document.addEventListener('DOMContentLoaded', function() {
    // Add scroll animations
    window.addEventListener('scroll', function() {
        const elements = document.querySelectorAll('.fade-in, .fade-in-up, .scale-in');
        elements.forEach(element => {
            const elementPosition = element.getBoundingClientRect().top;
            const screenPosition = window.innerHeight / 1.3;
            
            if (elementPosition < screenPosition) {
                element.style.opacity = 1;
                element.classList.add('animated');
            }
        });
    });
    
    const productId = getProductIdFromURL();
    if (productId) {
        displayProductDetails(productId);
    } else {
        // If no product ID, show error
        document.querySelector('.product-details-container').innerHTML = `
            <div class="text-center fade-in" style="grid-column: 1 / -1;">
                <h2>لم يتم تحديد منتج</h2>
                <a href="catalog.html" class="btn btn-primary">العودة إلى الكتالوج</a>
            </div>
        `;
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