// Admin Dashboard JavaScript

// DOM Ready
document.addEventListener('DOMContentLoaded', function() {
    // Initialize tooltips
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.map(function(tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });

    // Initialize mobile menu
    initMobileMenu();
    
    // Initialize charts
    initCharts();
    
    // Initialize data tables if any
    initDataTables();
    
    // Initialize form validations
    initFormValidations();
    
    // Initialize button handlers
    initButtonHandlers();
    
    // Fix for iOS elastic scrolling
    document.body.addEventListener('touchmove', function(e) {
        // Prevent scrolling when at the top or bottom of the page
        if (window.scrollY <= 0 || (window.innerHeight + window.scrollY) >= document.body.offsetHeight) {
            e.preventDefault();
        }
    }, { passive: false });
});

// Initialize button handlers
function initButtonHandlers() {
    // Handle view buttons
    document.querySelectorAll('[data-action="view"]').forEach(button => {
        button.addEventListener('click', function() {
            const userId = this.getAttribute('data-user-id');
            viewUser(userId);
        });
    });

    // Handle edit buttons
    document.querySelectorAll('[data-action="edit"]').forEach(button => {
        button.addEventListener('click', function() {
            const userId = this.getAttribute('data-user-id');
            editUser(userId);
        });
    });

    // Handle delete buttons
    document.querySelectorAll('[data-action="delete"]').forEach(button => {
        button.addEventListener('click', function() {
            const userId = this.getAttribute('data-user-id');
            const userName = this.getAttribute('data-user-name');
            deleteUser(userId, userName);
        });
    });

    // Handle status toggles
    document.querySelectorAll('.status-toggle').forEach(toggle => {
        toggle.addEventListener('change', function() {
            const userId = this.getAttribute('data-user-id');
            const status = this.checked ? 'active' : 'inactive';
            updateUserStatus(userId, status);
        });
    });

    // Handle add user button
    const addUserBtn = document.getElementById('addUserBtn');
    if (addUserBtn) {
        addUserBtn.addEventListener('click', showAddUserModal);
    }

    // Handle export button
    const exportBtn = document.getElementById('exportBtn');
    if (exportBtn) {
        exportBtn.addEventListener('click', exportUsers);
    }
}

// View user details
function viewUser(userId) {
    // In a real app, you would fetch user details from an API
    console.log('Viewing user:', userId);
    // Show a notification with better positioning
    showNotification(
        `Viewing details for user ID: ${userId}`, 
        'info',
        { position: 'top-right', autoClose: 3000 }
    );
}

// Edit user
function editUser(userId) {
    console.log('Editing user:', userId);
    // In a real app, you would show an edit form with user data
    showNotification(
        `Edit form for user ID: ${userId} will be displayed here`,
        'info',
        { position: 'top-right', autoClose: 3000 }
    );
}

// Delete user with confirmation
function deleteUser(userId, userName) {
    // Create a custom confirmation dialog
    const dialog = document.createElement('div');
    dialog.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4';
    
    dialog.innerHTML = `
        <div class="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <div class="flex items-center justify-between mb-4">
                <h3 class="text-lg font-medium text-gray-900">Confirm Deletion</h3>
                <button type="button" class="text-gray-400 hover:text-gray-500">
                    <span class="sr-only">Close</span>
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div class="mb-6">
                <p class="text-gray-700">Are you sure you want to delete <span class="font-semibold">${userName || 'this user'}</span>? This action cannot be undone.</p>
            </div>
            <div class="flex justify-end space-x-3">
                <button type="button" class="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                    Cancel
                </button>
                <button type="button" class="inline-flex justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500">
                    Delete
                </button>
            </div>
        </div>
    `;
    
    // Add to body
    document.body.appendChild(dialog);
    
    // Add event listeners
    const closeBtn = dialog.querySelector('button:first-child');
    const cancelBtn = dialog.querySelector('button:nth-child(2)');
    const confirmBtn = dialog.querySelector('button:last-child');
    
    const closeDialog = () => {
        document.body.removeChild(dialog);
    };
    
    closeBtn.addEventListener('click', closeDialog);
    cancelBtn.addEventListener('click', closeDialog);
    
    confirmBtn.addEventListener('click', () => {
        console.log('Deleting user:', userId);
        // In a real app, you would make an API call to delete the user
        
        // Show success notification
        showNotification(
            `User ${userName} has been deleted.`,
            'success',
            { position: 'top-right', autoClose: 3000 }
        );
        
        // Remove the user row from the table
        const row = document.querySelector(`[data-user-row="${userId}"]`);
        if (row) {
            // Add removal animation
            row.style.transition = 'all 0.3s ease-out';
            row.style.opacity = '0';
            row.style.transform = 'translateX(100%)';
            
            // Remove from DOM after animation
            setTimeout(() => {
                row.remove();
            }, 300);
        }
        
        // Close dialog
        closeDialog();
    });
    
    // Close on outside click
    dialog.addEventListener('click', (e) => {
        if (e.target === dialog) {
            closeDialog();
        }
    });
}

// Update user status
function updateUserStatus(userId, status) {
    console.log(`Updating user ${userId} status to:`, status);
    // In a real app, you would make an API call to update the status
    showNotification(`User status updated to ${status}`, 'success');
}

// Show add user modal
function showAddUserModal() {
    // Create modal overlay
    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4';
    
    modal.innerHTML = `
        <div class="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div class="flex items-center justify-between p-4 border-b">
                <h3 class="text-lg font-medium text-gray-900">Add New User</h3>
                <button type="button" class="text-gray-400 hover:text-gray-500">
                    <span class="sr-only">Close</span>
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div class="p-6">
                <form id="addUserForm" class="space-y-6">
                    <div class="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                        <div class="sm:col-span-3">
                            <label for="firstName" class="block text-sm font-medium text-gray-700">First name</label>
                            <input type="text" name="firstName" id="firstName" autocomplete="given-name" class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
                        </div>
                        <div class="sm:col-span-3">
                            <label for="lastName" class="block text-sm font-medium text-gray-700">Last name</label>
                            <input type="text" name="lastName" id="lastName" autocomplete="family-name" class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
                        </div>
                        <div class="sm:col-span-4">
                            <label for="email" class="block text-sm font-medium text-gray-700">Email address</label>
                            <input type="email" name="email" id="email" autocomplete="email" class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
                        </div>
                        <div class="sm:col-span-4">
                            <label for="phone" class="block text-sm font-medium text-gray-700">Phone number</label>
                            <input type="tel" name="phone" id="phone" autocomplete="tel" class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" placeholder="+91 12345 67890">
                        </div>
                        <div class="sm:col-span-3">
                            <label for="role" class="block text-sm font-medium text-gray-700">Role</label>
                            <select id="role" name="role" class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
                                <option value="user">User</option>
                                <option value="admin">Admin</option>
                                <option value="manager">Manager</option>
                                <option value="guest">Guest</option>
                            </select>
                        </div>
                        <div class="sm:col-span-3">
                            <label for="status" class="block text-sm font-medium text-gray-700">Status</label>
                            <select id="status" name="status" class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
                                <option value="active">Active</option>
                                <option value="inactive">Inactive</option>
                                <option value="pending">Pending</option>
                            </select>
                        </div>
                    </div>
                </form>
            </div>
            <div class="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end space-x-3">
                <button type="button" class="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                    Cancel
                </button>
                <button type="button" class="inline-flex justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                    Add User
                </button>
            </div>
        </div>
    `;
    
    // Add to body
    document.body.appendChild(modal);
    
    // Add event listeners
    const closeBtn = modal.querySelector('button:first-child');
    const cancelBtn = modal.querySelector('button:nth-last-child(2)');
    const submitBtn = modal.querySelector('button:last-child');
    const form = document.getElementById('addUserForm');
    
    const closeModal = () => {
        document.body.removeChild(modal);
    };
    
    closeBtn.addEventListener('click', closeModal);
    cancelBtn.addEventListener('click', closeModal);
    
    // Close on outside click
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });
    
    // Handle form submission
    submitBtn.addEventListener('click', (e) => {
        e.preventDefault();
        
        // In a real app, you would validate the form and submit to an API
        const formData = new FormData(form);
        const formValues = Object.fromEntries(formData.entries());
        
        console.log('Form submitted:', formValues);
        
        // Show success message
        showNotification(
            'New user added successfully!',
            'success',
            { position: 'top-right', autoClose: 3000 }
        );
        
        // Close modal
        closeModal();
    });
}

// Export users data
function exportUsers() {
    console.log('Exporting users data');
    // In a real app, you would generate and download a CSV/Excel file
    showNotification('Exporting users data...', 'info');
    
    // Simulate file download
    const data = 'Name,Email,Role,Status\n' +
                 'Rajesh Kumar,rajesh.kumar@example.com,Admin,Active\n' +
                 'Priya Sharma,priya.sharma@example.com,Manager,Active';
    
    const blob = new Blob([data], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('hidden', '');
    a.setAttribute('href', url);
    a.setAttribute('download', `users_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
}

// Initialize Mobile Menu
function initMobileMenu() {
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const closeMobileMenu = document.getElementById('close-mobile-menu');
    const mobileSidebar = document.getElementById('mobile-sidebar');
    const mobileSidebarOverlay = document.getElementById('mobile-sidebar-overlay');
    const body = document.body;

    function toggleMobileMenu() {
        mobileSidebar.classList.toggle('-translate-x-full');
        mobileSidebarOverlay.classList.toggle('hidden');
        body.classList.toggle('overflow-hidden');
        
        // Toggle aria-expanded for accessibility
        const isExpanded = mobileMenuButton.getAttribute('aria-expanded') === 'true' || false;
        mobileMenuButton.setAttribute('aria-expanded', !isExpanded);
    }

    if (mobileMenuButton) {
        mobileMenuButton.addEventListener('click', toggleMobileMenu);
        mobileMenuButton.setAttribute('aria-expanded', 'false');
        mobileMenuButton.setAttribute('aria-controls', 'mobile-sidebar');
    }

    if (closeMobileMenu) {
        closeMobileMenu.addEventListener('click', toggleMobileMenu);
    }

    if (mobileSidebarOverlay) {
        mobileSidebarOverlay.addEventListener('click', toggleMobileMenu);
    }

    // Close menu when clicking on a link
    const mobileLinks = document.querySelectorAll('#mobile-sidebar a');
    mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (window.innerWidth < 768) { // Only for mobile
                toggleMobileMenu();
            }
        });
    });
    
    // Close menu when window is resized to desktop
    function handleResize() {
        if (window.innerWidth >= 768) {
            mobileSidebar.classList.add('-translate-x-full');
            mobileSidebarOverlay.classList.add('hidden');
            body.classList.remove('overflow-hidden');
            mobileMenuButton.setAttribute('aria-expanded', 'false');
        }
    }
    
    // Add resize event listener
    window.addEventListener('resize', handleResize);
}

// Initialize Charts
function initCharts() {
    // Applications by Status Chart
    const ctx1 = document.getElementById('applicationsByStatusChart');
    if (ctx1) {
        new Chart(ctx1, {
            type: 'doughnut',
            data: {
                labels: ['Approved', 'Pending', 'Rejected', 'In Review'],
                datasets: [{
                    data: [45, 30, 15, 10],
                    backgroundColor: [
                        '#10B981', // green-500
                        '#F59E0B', // yellow-500
                        '#EF4444', // red-500
                        '#3B82F6'  // blue-500
                    ],
                    borderWidth: 0
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'right',
                    }
                },
                cutout: '70%'
            }
        });
    }

    // Monthly Applications Chart
    const ctx2 = document.getElementById('monthlyApplicationsChart');
    if (ctx2) {
        new Chart(ctx2, {
            type: 'line',
            data: {
                labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
                datasets: [{
                    label: 'Applications',
                    data: [120, 190, 150, 200, 180, 220, 250, 230, 280, 300, 290, 320],
                    fill: false,
                    borderColor: '#4F46E5',
                    tension: 0.4,
                    borderWidth: 2,
                    pointBackgroundColor: '#4F46E5',
                    pointBorderColor: '#fff',
                    pointHoverRadius: 5,
                    pointHoverBackgroundColor: '#4F46E5',
                    pointHoverBorderColor: '#fff',
                    pointHitRadius: 10,
                    pointBorderWidth: 2
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        grid: {
                            drawBorder: false
                        },
                        ticks: {
                            callback: function(value) {
                                return value % 100 === 0 ? value : '';
                            }
                        }
                    },
                    x: {
                        grid: {
                            display: false
                        }
                    }
                }
            }
        });
    }
}

// Initialize DataTables
function initDataTables() {
    const dataTables = document.querySelectorAll('.data-table');
    if (dataTables.length > 0 && typeof $.fn.DataTable === 'function') {
        dataTables.forEach(table => {
            $(table).DataTable({
                responsive: true,
                pageLength: 10,
                lengthMenu: [[10, 25, 50, -1], [10, 25, 50, 'All']],
                language: {
                    search: "",
                    searchPlaceholder: "Search...",
                    lengthMenu: "Show _MENU_ entries",
                    info: "Showing _START_ to _END_ of _TOTAL_ entries",
                    infoEmpty: "No entries found",
                    infoFiltered: "(filtered from _MAX_ total entries)",
                    paginate: {
                        previous: '<i class="fas fa-chevron-left"></i>',
                        next: '<i class="fas fa-chevron-right"></i>'
                    }
                },
                dom: '<"flex justify-between items-center mb-4"f<"flex items-center">>rt<"flex justify-between items-center mt-4"ip>',
                initComplete: function() {
                    $('.dataTables_filter input').addClass('form-input w-64');
                    $('.dataTables_length select').addClass('form-select');
                }
            });
        });
    }
}

// Initialize Form Validations
function initFormValidations() {
    // Example validation for a form with class 'needs-validation'
    const forms = document.querySelectorAll('.needs-validation');
    Array.from(forms).forEach(form => {
        form.addEventListener('submit', event => {
            if (!form.checkValidity()) {
                event.preventDefault();
                event.stopPropagation();
            }
            form.classList.add('was-validated');
        }, false);
    });
}

// Show notification
function showNotification(message, type = 'info', options = {}) {
    const {
        position = 'top-right',
        autoClose = 3000,
        closeButton = true
    } = options;

    // Position classes
    const positionClasses = {
        'top-right': 'top-4 right-4',
        'top-left': 'top-4 left-4',
        'bottom-right': 'bottom-4 right-4',
        'bottom-left': 'bottom-4 left-4',
        'top-center': 'top-4 left-1/2 transform -translate-x-1/2',
        'bottom-center': 'bottom-4 left-1/2 transform -translate-x-1/2'
    };

    // Type classes
    const typeClasses = {
        'info': 'bg-blue-500',
        'success': 'bg-green-500',
        'warning': 'bg-yellow-500',
        'error': 'bg-red-500'
    };

    // Create notification container if it doesn't exist
    let container = document.getElementById('notification-container');
    if (!container) {
        container = document.createElement('div');
        container.id = 'notification-container';
        container.className = 'fixed z-50 w-full max-w-xs space-y-2 pointer-events-none';
        document.body.appendChild(container);
    }

    // Create notification element
    const notification = document.createElement('div');
    notification.className = `relative w-full max-w-xs p-4 rounded-md shadow-lg text-white ${typeClasses[type] || 'bg-gray-800'} transform transition-all duration-300 ease-in-out opacity-0 translate-y-2`;
    
    // Add close button if enabled
    if (closeButton) {
        const closeBtn = document.createElement('button');
        closeBtn.className = 'absolute top-2 right-2 text-white hover:text-gray-200 focus:outline-none';
        closeBtn.innerHTML = '&times;';
        closeBtn.addEventListener('click', () => {
            removeNotification(notification);
        });
        notification.appendChild(closeBtn);
    }
    
    // Add message
    const messageEl = document.createElement('div');
    messageEl.className = 'pr-4';
    messageEl.textContent = message;
    notification.appendChild(messageEl);
    
    // Add to container with proper positioning
    const notificationWrapper = document.createElement('div');
    notificationWrapper.className = `pointer-events-auto ${positionClasses[position] || positionClasses['top-right']}`;
    notificationWrapper.style.transition = 'all 0.3s ease-in-out';
    notificationWrapper.appendChild(notification);
    
    // Add to container
    if (position.includes('center')) {
        container.style.width = '100%';
        container.className = `fixed z-50 w-full flex flex-col items-center space-y-2 pointer-events-none ${position.split('-')[0]}-4`;
        container.appendChild(notificationWrapper);
    } else {
        container.className = `fixed z-50 w-full max-w-xs space-y-2 ${positionClasses[position] || positionClasses['top-right']} pointer-events-none`;
        container.appendChild(notificationWrapper);
    }
    
    // Trigger reflow
    void notification.offsetWidth;
    
    // Show notification with animation
    notification.classList.remove('opacity-0', 'translate-y-2');
    notification.classList.add('opacity-100', 'translate-y-0');
    
    // Auto remove if autoClose is set
    if (autoClose) {
        const timeoutId = setTimeout(() => {
            removeNotification(notification);
        }, autoClose);
        
        // Store timeout ID for potential clearing
        notification.dataset.timeoutId = timeoutId;
    }
    
    // Return notification element for manual control
    return notification;
}

// Remove notification with animation
function removeNotification(notification) {
    if (!notification) return;
    
    // Clear any existing timeout
    if (notification.dataset.timeoutId) {
        clearTimeout(notification.dataset.timeoutId);
    }
    
    // Add exit animation
    notification.classList.remove('opacity-100', 'translate-y-0');
    notification.classList.add('opacity-0', 'translate-y-2');
    
    // Remove from DOM after animation
    setTimeout(() => {
        const wrapper = notification.parentElement;
        if (wrapper && wrapper.parentElement) {
            wrapper.parentElement.removeChild(wrapper);
        }
    }, 300);
}

// Toggle Password Visibility
togglePasswordVisibility = (inputId, toggleId) => {
    const passwordInput = document.getElementById(inputId);
    const toggleButton = document.getElementById(toggleId);
    
    if (passwordInput && toggleButton) {
        toggleButton.addEventListener('click', () => {
            const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
            passwordInput.setAttribute('type', type);
            toggleButton.querySelector('i').classList.toggle('fa-eye');
            toggleButton.querySelector('i').classList.toggle('fa-eye-slash');
        });
    }
};

// Logout Function
function logout() {
    // Clear all storage
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminData');
    sessionStorage.clear();
    // Redirect to login page
    window.location.href = '../admin-login.html';
}

// Export functions for use in other files if needed
window.adminUtils = {
    showNotification,
    togglePasswordVisibility,
    logout
};
