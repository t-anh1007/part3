// Main JavaScript file for Product Management System

document.addEventListener('DOMContentLoaded', function() {
    // Initialize tooltips
    var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });

    // Auto-hide alerts after 5 seconds
    const alerts = document.querySelectorAll('.alert:not(.alert-permanent)');
    alerts.forEach(function(alert) {
        setTimeout(function() {
            if (alert) {
                const bsAlert = new bootstrap.Alert(alert);
                bsAlert.close();
            }
        }, 5000);
    });

    // Add loading state to forms
    const forms = document.querySelectorAll('form');
    forms.forEach(function(form) {
        form.addEventListener('submit', function() {
            const submitBtn = form.querySelector('button[type="submit"]');
            if (submitBtn) {
                submitBtn.disabled = true;
                submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-2" role="status"></span>Đang xử lý...';
            }
        });
    });

    // Confirm delete actions
    const deleteButtons = document.querySelectorAll('.btn-delete, [onclick*="delete"]');
    deleteButtons.forEach(function(btn) {
        if (!btn.onclick) {
            btn.addEventListener('click', function(e) {
                e.preventDefault();
                if (confirm('Bạn có chắc muốn xóa item này?')) {
                    // Proceed with delete
                    if (btn.href) {
                        window.location.href = btn.href;
                    }
                }
            });
        }
    });

    // Format number inputs
    const numberInputs = document.querySelectorAll('input[type="number"]');
    numberInputs.forEach(function(input) {
        input.addEventListener('input', function() {
            if (this.getAttribute('name') === 'price') {
                // Format price with thousand separators (display only)
                let value = this.value.replace(/[^\d]/g, '');
                if (value) {
                    this.dataset.rawValue = value;
                }
            }
        });
    });

    // Search functionality enhancement
    const searchInputs = document.querySelectorAll('input[name="search"]');
    searchInputs.forEach(function(input) {
        let searchTimeout;
        input.addEventListener('input', function() {
            clearTimeout(searchTimeout);
            searchTimeout = setTimeout(function() {
                // Auto-submit search after 1 second of no typing
                if (input.value.length >= 3 || input.value.length === 0) {
                    const form = input.closest('form');
                    if (form && form.querySelector('button[type="submit"]')) {
                        // Only auto-submit if there's a submit button (not for API forms)
                        form.submit();
                    }
                }
            }, 1000);
        });
    });

    // Table row click navigation
    const tableRows = document.querySelectorAll('table tbody tr[data-href]');
    tableRows.forEach(function(row) {
        row.style.cursor = 'pointer';
        row.addEventListener('click', function(e) {
            if (!e.target.closest('button, a')) {
                window.location.href = this.dataset.href;
            }
        });
    });

    // Responsive table helpers
    const tables = document.querySelectorAll('.table-responsive table');
    tables.forEach(function(table) {
        if (window.innerWidth < 768) {
            table.classList.add('table-sm');
        }
    });

    // Phone number formatting
    const phoneInputs = document.querySelectorAll('input[type="tel"], input[name*="phone"]');
    phoneInputs.forEach(function(input) {
        input.addEventListener('input', function() {
            let value = this.value.replace(/[^\d]/g, '');
            if (value.length > 11) {
                value = value.substring(0, 11);
            }
            this.value = value;
        });
    });

    // Price formatting helper
    function formatPrice(price) {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(price);
    }

    // Export to window for global access
    window.formatPrice = formatPrice;
});

// Global helper functions
function showLoading(element) {
    if (element) {
        element.classList.add('loading');
    }
}

function hideLoading(element) {
    if (element) {
        element.classList.remove('loading');
    }
}

function showAlert(message, type = 'info') {
    const alertContainer = document.createElement('div');
    alertContainer.className = `alert alert-${type} alert-dismissible fade show`;
    alertContainer.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : 
                           type === 'danger' ? 'exclamation-circle' : 
                           type === 'warning' ? 'exclamation-triangle' : 'info-circle'} me-2"></i>
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    
    const container = document.querySelector('.container');
    if (container) {
        container.insertBefore(alertContainer, container.firstChild);
        
        // Auto-hide after 5 seconds
        setTimeout(function() {
            const bsAlert = new bootstrap.Alert(alertContainer);
            bsAlert.close();
        }, 5000);
    }
}

// AJAX helper for API calls
function apiCall(url, options = {}) {
    const defaultOptions = {
        headers: {
            'Content-Type': 'application/json',
            'X-Requested-With': 'XMLHttpRequest'
        }
    };
    
    return fetch(url, { ...defaultOptions, ...options })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .catch(error => {
            console.error('API call failed:', error);
            showAlert('Có lỗi xảy ra khi gọi API', 'danger');
            throw error;
        });
}

// Export for global access
window.showLoading = showLoading;
window.hideLoading = hideLoading;
window.showAlert = showAlert;
window.apiCall = apiCall;