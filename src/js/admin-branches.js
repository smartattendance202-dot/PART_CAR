// Admin branches management JavaScript functionality with modern animations

// Render branches as cards grid with animations
async function renderBranchesTable() {
    const grid = document.getElementById('branchesGrid');
    if (!grid) return;

    const branches = await DataManager.getBranches();
    grid.innerHTML = '';

    branches.forEach((branch, index) => {
        const card = document.createElement('div');
        card.className = 'branch-card fade-in';
        card.style.animationDelay = `${index * 0.1}s`;

        card.innerHTML = `
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
            <div class="product-actions" style="margin-top:12px; display:flex; gap:8px;">
                <button class="btn btn-outline" onclick="editBranch(${branch.id})">
                    <i class="fas fa-edit"></i> تعديل
                </button>
                <button class="btn btn-danger" onclick="deleteBranch(${branch.id})">
                    <i class="fas fa-trash"></i> حذف
                </button>
            </div>
        `;
        grid.appendChild(card);
    });
}

// Open branch modal for adding/editing with animation
function openBranchModal(branchId = null) {
    const modal = document.getElementById('branchModal');
    const form = document.getElementById('branchForm');
    const modalTitle = document.getElementById('modalTitle');
    const branchIdInput = document.getElementById('branchId');

    if (!modal || !form) {
        console.error('Modal elements not found');
        return;
    }

    // Reset form
    form.reset();
    if (branchIdInput) branchIdInput.value = '';

    if (branchId) {
        // Edit existing branch
        const branches = DataManager.getBranches();
        const branch = branches.find(b => b.id == branchId);
        if (branch) {
            modalTitle.textContent = 'تعديل الفرع';
            if (branchIdInput) branchIdInput.value = branch.id;
            document.getElementById('branchName').value = branch.name;
            document.getElementById('branchAddress').value = branch.address;
            document.getElementById('branchPhone').value = branch.phone;
            document.getElementById('branchCoordinates').value = branch.coordinates;
        }
    } else {
        // Add new branch
        modalTitle.textContent = 'إضافة فرع جديد';
    }

    // Show modal with animation
    modal.classList.add('show');
}

// Edit branch
function editBranch(branchId) {
    // Add animation to edit button
    const buttons = document.querySelectorAll(`button[onclick="editBranch(${branchId})"]`);
    buttons.forEach(button => {
        button.classList.add('pulse');
        setTimeout(() => {
            button.classList.remove('pulse');
        }, 1000);
    });

    openBranchModal(branchId);
}

// Delete branch
function deleteBranch(branchId) {
    // Add animation to delete button
    const buttons = document.querySelectorAll(`button[onclick="deleteBranch(${branchId})"]`);
    buttons.forEach(button => {
        button.classList.add('pulse');
        setTimeout(() => {
            button.classList.remove('pulse');
        }, 1000);
    });

    if (confirm('هل أنت متأكد من حذف هذا الفرع؟')) {
        DataManager.deleteBranch(branchId);
        renderBranchesTable();

        // Show success message
        showSuccessMessage('تم حذف الفرع بنجاح!');
    }
}

// Handle branch form submission with animation
function handleBranchFormSubmit(e) {
    e.preventDefault();

    // Add animation to submit button
    const submitBtn = document.querySelector('#branchForm button[type="submit"]');
    if (submitBtn) {
        submitBtn.classList.add('pulse');
    }

    const branchId = document.getElementById('branchId').value;
    const branchName = document.getElementById('branchName').value.trim();
    const branchAddress = document.getElementById('branchAddress').value.trim();
    const branchPhone = document.getElementById('branchPhone').value.trim();
    const branchCoordinates = document.getElementById('branchCoordinates').value.trim();

    if (!branchName || !branchAddress || !branchPhone) {
        alert('الرجاء ملء الاسم والعنوان ورقم الهاتف');
        if (submitBtn) submitBtn.classList.remove('pulse');
        return;
    }

    // Simulate form submission with animation
    setTimeout(() => {
        if (submitBtn) {
            submitBtn.classList.remove('pulse');
        }

        (async () => {
            if (branchId) {
                // Update existing branch
                const branch = {
                    id: parseInt(branchId),
                    name: branchName,
                    address: branchAddress,
                    phone: branchPhone,
                    coordinates: branchCoordinates
                };
                await DataManager.updateBranch(branch);
            } else {
                // Add new branch
                const branch = {
                    name: branchName,
                    address: branchAddress,
                    phone: branchPhone,
                    coordinates: branchCoordinates
                };
                await DataManager.addBranch(branch);
            }
        })();

        // Close modal and refresh grid
        const modal = document.getElementById('branchModal');
        if (modal) {
            modal.querySelector('.admin-modal-content').style.animation = 'fadeOut 0.3s ease-out forwards';
            setTimeout(() => {
                modal.classList.remove('show');
                modal.querySelector('.admin-modal-content').style.animation = '';
                renderBranchesTable();

                // Show success message
                showSuccessMessage(branchId ? 'تم تحديث الفرع بنجاح!' : 'تم إضافة الفرع بنجاح!');
            }, 300);
        }
    }, 600);
}

// Search branches by name, address, or phone
function searchBranches() {
    const branchSearchInput = document.getElementById('branchSearch');
    if (!branchSearchInput) return;

    const term = branchSearchInput.value.trim().toLowerCase();
    if (!term) {
        renderBranchesTable();
        return;
    }

    const terms = term.split(/\s+/);
    const branches = DataManager.getBranches();
    const filtered = branches.filter(b =>
        terms.every(t =>
            (b.name || '').toLowerCase().includes(t) ||
            (b.address || '').toLowerCase().includes(t) ||
            (b.phone || '').toLowerCase().includes(t)
        )
    );

    const grid = document.getElementById('branchesGrid');
    if (!grid) return;
    grid.innerHTML = '';

    filtered.forEach((branch, index) => {
        const card = document.createElement('div');
        card.className = 'branch-card fade-in';
        card.style.animationDelay = `${index * 0.08}s`;
        card.innerHTML = `
            <div class="branch-header">
                <h3 class="branch-name">${branch.name}</h3>
                <div class="branch-phone"><i class="fas fa-phone"></i> ${branch.phone}</div>
            </div>
            <div class="branch-details">
                <div class="branch-address">
                    <i class="fas fa-map-marker-alt"></i>
                    <div>${branch.address}</div>
                </div>
                <div class="map-placeholder">خريطة الموقع</div>
            </div>
            <div class="product-actions" style="margin-top:12px; display:flex; gap:8px;">
                <button class="btn btn-outline" onclick="editBranch(${branch.id})"><i class="fas fa-edit"></i> تعديل</button>
                <button class="btn btn-danger" onclick="deleteBranch(${branch.id})"><i class="fas fa-trash"></i> حذف</button>
            </div>`;
        grid.appendChild(card);
    });
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

// Initialize branches management with animations
document.addEventListener('DOMContentLoaded', function () {
    console.log('Admin branches management loaded');

    // Add scroll animations
    window.addEventListener('scroll', animateOnScroll);
    animateOnScroll(); // Initial check

    renderBranchesTable();

    // Handle add branch button
    const addBranchBtn = document.getElementById('addBranchBtn');
    if (addBranchBtn) {
        addBranchBtn.addEventListener('click', function () {
            // Add animation to button
            this.classList.add('pulse');
            setTimeout(() => {
                this.classList.remove('pulse');
            }, 1000);

            openBranchModal();
        });
    }

    // Handle search
    const branchSearchInput = document.getElementById('branchSearch');
    const searchBranchButton = document.getElementById('searchBranchButton');
    if (branchSearchInput) {
        branchSearchInput.addEventListener('keyup', function (e) {
            if (e.key === 'Enter') {
                searchBranches();
            }
        });
    }
    if (searchBranchButton) {
        searchBranchButton.addEventListener('click', searchBranches);
    }

    // Handle branch form submission
    const branchForm = document.getElementById('branchForm');
    if (branchForm) {
        branchForm.addEventListener('submit', handleBranchFormSubmit);
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
if (!document.getElementById('admin-branches-animations')) {
    const style = document.createElement('style');
    style.id = 'admin-branches-animations';
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