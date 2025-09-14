// Admin products management JavaScript functionality

// Render products as responsive cards (instead of table)
async function renderProductsTable() {
    const grid = document.getElementById('productsGrid');
    if (!grid) return;

    const products = await DataManager.getProducts();
    grid.innerHTML = '';

    products.forEach((product, index) => {
        const card = document.createElement('div');
        card.className = 'product-card fade-in';
        card.style.animationDelay = `${index * 0.08}s`;

        card.innerHTML = `
            <div class="product-image">
                <img src="${product.image}" alt="${product.name}">
                <div class="product-badge">منتج</div>
            </div>
            <div class="product-info">
                <h3>${product.name}</h3>
                <div class="product-models">${product.models}</div>
                <div class="product-actions">
                    <button class="btn btn-outline" onclick="editProduct(${product.id})">
                        <i class="fas fa-edit"></i> تعديل
                    </button>
                    <button class="btn btn-danger" onclick="deleteProduct(${product.id})">
                        <i class="fas fa-trash"></i> حذف
                    </button>
                </div>
            </div>
        `;

        grid.appendChild(card);
    });

    console.log('Products rendered (cards):', products.length);
}

// Open product modal for adding/editing with animation
async function openProductModal(productId = null) {
    const modal = document.getElementById('productModal');
    const form = document.getElementById('productForm');
    const modalTitle = document.getElementById('modalTitle');
    const productIdInput = document.getElementById('productId');

    if (!modal || !form) {
        console.error('Modal elements not found');
        return;
    }

    // Reset form
    form.reset();
    if (productIdInput) productIdInput.value = '';

    if (productId) {
        // Edit existing product
        const products = await DataManager.getProducts();
        const product = (products || []).find(p => p.id == productId);
        if (product) {
            modalTitle.textContent = 'تعديل المنتج';
            if (productIdInput) productIdInput.value = product.id;
            document.getElementById('productName').value = product.name;
            document.getElementById('productModels').value = product.models;
            // Keep current image so if no new file uploaded, we reuse it
            const currentImage = document.getElementById('currentProductImage');
            if (currentImage) currentImage.value = product.image || '';
        }
    } else {
        // Add new product
        modalTitle.textContent = 'إضافة منتج جديد';
        const currentImage = document.getElementById('currentProductImage');
        if (currentImage) currentImage.value = '';
    }

    // Show modal with animation
    modal.classList.add('show');
}

// Edit product
function editProduct(productId) {
    // Add animation to edit button
    const buttons = document.querySelectorAll(`button[onclick="editProduct(${productId})"]`);
    buttons.forEach(button => {
        button.classList.add('pulse');
        setTimeout(() => {
            button.classList.remove('pulse');
        }, 1000);
    });

    openProductModal(productId);
}

// Delete product
function deleteProduct(productId) {
    // Add animation to delete button
    const buttons = document.querySelectorAll(`button[onclick="deleteProduct(${productId})"]`);
    buttons.forEach(button => {
        button.classList.add('pulse');
        setTimeout(() => {
            button.classList.remove('pulse');
        }, 1000);
    });

    if (confirm('هل أنت متأكد من حذف هذا المنتج؟')) {
        DataManager.deleteProduct(productId);
        renderProductsTable();

        // Show success message
        showSuccessMessage('تم حذف المنتج بنجاح!');
    }
}

// Handle product form submission with animation
function handleProductFormSubmit(e) {
    e.preventDefault();

    // Add animation to submit button
    const submitBtn = document.querySelector('#productForm button[type="submit"]');
    if (submitBtn) {
        submitBtn.classList.add('pulse');
    }

    const productId = document.getElementById('productId').value;
    const productName = document.getElementById('productName').value;
    const productModels = document.getElementById('productModels').value;

    // Handle image input: prefer file upload, fallback to current image, then placeholder
    const imageInput = document.getElementById('productImage');
    const currentImageInput = document.getElementById('currentProductImage');

    const readFileAsDataURL = (file) => new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });

    // Validate form
    if (!productName || !productModels) {
        alert('الرجاء ملء جميع الحقول المطلوبة');
        if (submitBtn) submitBtn.classList.remove('pulse');
        return;
    }

    // Resolve image first (file -> current -> placeholder), then proceed
    (async () => {
        let resolvedImage = 'https://placehold.co/300x300?text=صورة+المنتج';
        try {
            if (imageInput && imageInput.files && imageInput.files[0]) {
                // Convert file to DataURL for localStorage persistence
                resolvedImage = await readFileAsDataURL(imageInput.files[0]);
            } else if (currentImageInput && currentImageInput.value) {
                resolvedImage = currentImageInput.value;
            }
        } catch (err) {
            console.error('Image read error:', err);
        }

        // Simulate form submission with animation
        setTimeout(() => {
            if (submitBtn) {
                submitBtn.classList.remove('pulse');
            }

            (async () => {
                // If image is a data URL, try to upload to server to get file URL
                let finalImage = resolvedImage;
                if (typeof resolvedImage === 'string' && resolvedImage.startsWith('data:image')) {
                    try { finalImage = await DataManager.uploadImageDataURL(resolvedImage); } catch { }
                }

                if (productId) {
                    // Update existing product
                    const product = {
                        id: parseInt(productId),
                        name: productName,
                        models: productModels,
                        image: finalImage
                    };

                    const result = await DataManager.updateProduct(product);
                    console.log('Product updated:', result);
                } else {
                    // Add new product
                    const product = {
                        name: productName,
                        models: productModels,
                        image: finalImage
                    };

                    const result = await DataManager.addProduct(product);
                    console.log('Product added:', result);
                }
            })();

            // Close modal and refresh table
            const modal = document.getElementById('productModal');
            if (modal) {
                modal.querySelector('.admin-modal-content').style.animation = 'fadeOut 0.3s ease-out forwards';
                setTimeout(() => {
                    modal.classList.remove('show');
                    modal.querySelector('.admin-modal-content').style.animation = '';
                    renderProductsTable();

                    // Show success message
                    showSuccessMessage(productId ? 'تم تحديث المنتج بنجاح!' : 'تم إضافة المنتج بنجاح!');
                }, 300);
            }
        }, 600);
    })();
}

// Show success message
function showSuccessMessage(message) {
    // Show success message
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
            <h3 style="margin-bottom: 10px;">${message}</h3>
        </div>
    `;

    const mainSection = document.querySelector('.admin-main .container');
    if (mainSection) {
        mainSection.insertBefore(successMessage, mainSection.firstChild);

        // Remove success message after 3 seconds
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
        }, 3000);
    }
}

// Search products by name or models with integrated search
async function searchProducts() {
    const productSearchInput = document.getElementById('productSearch');
    if (!productSearchInput) return;

    const searchTerm = productSearchInput.value.trim().toLowerCase();

    if (!searchTerm) {
        // If search box is empty, show all products
        renderProductsTable();
        return;
    }

    // Split search term into words to search for both name and models
    const searchTerms = searchTerm.split(/\s+/);

    // Get all products (async)
    const products = await DataManager.getProducts();

    // Filter products by name or models
    const filteredProducts = (products || []).filter(product => {
        const name = (product.name || '').toLowerCase();
        const models = (product.models || '').toLowerCase();
        // Check if all search terms match either name or models
        return searchTerms.every(term => name.includes(term) || models.includes(term));
    });

    // Render filtered products in the grid
    const grid = document.getElementById('productsGrid');
    if (!grid) return;

    grid.innerHTML = '';

    filteredProducts.forEach((product, index) => {
        const card = document.createElement('div');
        card.className = 'product-card fade-in';
        card.style.animationDelay = `${index * 0.08}s`;

        card.innerHTML = `
            <div class="product-image">
                <img src="${product.image}" alt="${product.name}">
                <div class="product-badge">منتج</div>
            </div>
            <div class="product-info">
                <h3>${product.name}</h3>
                <div class="product-models">${product.models}</div>
                <div class="product-actions">
                    <button class="btn btn-outline" onclick="editProduct(${product.id})">
                        <i class="fas fa-edit"></i> تعديل
                    </button>
                    <button class="btn btn-danger" onclick="deleteProduct(${product.id})">
                        <i class="fas fa-trash"></i> حذف
                    </button>
                </div>
            </div>
        `;
        grid.appendChild(card);
    });
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

// Initialize products management with animations
document.addEventListener('DOMContentLoaded', function () {
    console.log('Admin products management loaded');

    // Add scroll animations
    window.addEventListener('scroll', animateOnScroll);
    animateOnScroll(); // Initial check

    renderProductsTable();

    // Handle add product button
    const addProductBtn = document.getElementById('addProductBtn');
    if (addProductBtn) {
        addProductBtn.addEventListener('click', function () {
            // Add animation to button
            this.classList.add('pulse');
            setTimeout(() => {
                this.classList.remove('pulse');
            }, 1000);

            openProductModal();
        });
    }

    // Handle product form submission
    const productForm = document.getElementById('productForm');
    if (productForm) {
        productForm.addEventListener('submit', handleProductFormSubmit);
    }

    // Handle product search
    const productSearchInput = document.getElementById('productSearch');
    const searchProductButton = document.getElementById('searchProductButton');

    if (productSearchInput) {
        productSearchInput.addEventListener('keyup', function (e) {
            if (e.key === 'Enter') {
                searchProducts();
            }
        });
    }

    if (searchProductButton) {
        searchProductButton.addEventListener('click', searchProducts);
    }

    // Close modal when clicking on close button or outside modal
    const modalCloseButtons = document.querySelectorAll('.admin-modal-close');
    modalCloseButtons.forEach(button => {
        button.addEventListener('click', function () {
            const modal = this.closest('.admin-modal');
            if (modal) {
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
                modal.querySelector('.admin-modal-content').style.animation = 'fadeOut 0.3s ease-out forwards';
                setTimeout(() => {
                    modal.classList.remove('show');
                    modal.querySelector('.admin-modal-content').style.animation = '';
                }, 300);
            }
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

// Add CSS for animations if not already added
if (!document.getElementById('admin-products-animations')) {
    const style = document.createElement('style');
    style.id = 'admin-products-animations';
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
        
        @keyframes fadeOut {
            from { opacity: 1; transform: scale(1); }
            to { opacity: 0; transform: scale(0.9); }
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
        
        .animated {
            opacity: 1 !important;
        }
        
        .hover {
            transform: translateY(-3px);
        }
    `;
    document.head.appendChild(style);
}