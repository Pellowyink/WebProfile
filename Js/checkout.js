// Checkout Page JavaScript
console.log("Checkout script loaded successfully");

// Initialize checkout page
document.addEventListener('DOMContentLoaded', () => {
    initializeCheckout();
    setupEventListeners();
    populateOrderSummary();
});

// Initialize checkout functionality
function initializeCheckout() {
    // Check if cart is empty
    if (!window.cart || window.cart.length === 0) {
        // Try to load from localStorage if window.cart is not available
        const savedCart = localStorage.getItem('nekoFanCart');
        if (!savedCart || JSON.parse(savedCart).length === 0) {
            // Redirect to shop if cart is empty
            setTimeout(() => {
                alert('Your cart is empty. Redirecting to shop...');
                window.location.href = 'shop.html';
            }, 1000);
            return;
        }
        window.cart = JSON.parse(savedCart);
    }
    
    // Populate form with saved data if available
    loadSavedFormData();
}

// Setup event listeners
function setupEventListeners() {
    // Form submission
    document.getElementById('checkoutForm').addEventListener('submit', handleFormSubmit);
    
    // Payment method toggle
    document.querySelectorAll('input[name="paymentMethod"]').forEach(radio => {
        radio.addEventListener('change', togglePaymentFields);
    });
    
    // Card number formatting
    document.getElementById('cardNumber').addEventListener('input', formatCardNumber);
    
    // Expiry date formatting
    document.getElementById('expiryDate').addEventListener('input', formatExpiryDate);
    
    // CVV validation
    document.getElementById('cvv').addEventListener('input', validateCVV);
    
    // Postal code formatting
    document.getElementById('postalCode').addEventListener('input', formatPostalCode);
    
    // Phone number formatting
    document.getElementById('phone').addEventListener('input', formatPhoneNumber);
    
    // Auto-save form data
    document.getElementById('checkoutForm').addEventListener('input', saveFormData);
    
    // Form validation
    document.getElementById('checkoutForm').addEventListener('input', validateForm);
}

// Populate order summary from cart
function populateOrderSummary() {
    const orderItemsContainer = document.getElementById('orderItems');
    
    if (!window.cart || window.cart.length === 0) {
        return;
    }
    
    // Clear existing items
    orderItemsContainer.innerHTML = '';
    
    // Add each cart item
    window.cart.forEach((item, index) => {
        const orderItem = document.createElement('div');
        orderItem.className = 'order-item';
        orderItem.style.animationDelay = `${index * 0.1}s`;
        
        orderItem.innerHTML = `
            <div class="order-item-image">
                <img src="${item.image}" alt="${item.name}" 
                     onerror="this.src='images/nekopan.png'; this.onerror=null;"
                     loading="lazy">
            </div>
            <div class="order-item-details">
                <div class="order-item-name">${item.name}</div>
                <div class="order-item-quantity">Quantity: ${item.quantity}</div>
            </div>
            <div class="order-item-price">¥${item.price * item.quantity}</div>
        `;
        
        orderItemsContainer.appendChild(orderItem);
    });
    
    // Update totals
    updateOrderTotals();
}

// Update order totals
function updateOrderTotals() {
    if (!window.cart || window.cart.length === 0) {
        return;
    }
    
    const subtotal = window.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const tax = Math.round(subtotal * 0.08);
    const total = subtotal + tax;
    
    document.getElementById('orderSubtotal').textContent = `¥${subtotal}`;
    document.getElementById('orderTax').textContent = `¥${tax}`;
    document.getElementById('orderTotal').textContent = `¥${total}`;
}

// Handle form submission
async function handleFormSubmit(e) {
    e.preventDefault();
    
    if (!validateFormData()) {
        return;
    }
    
    const formData = new FormData(e.target);
    const orderData = Object.fromEntries(formData.entries());
    
    // Add cart data to order
    orderData.items = window.cart;
    orderData.subtotal = window.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    orderData.tax = Math.round(orderData.subtotal * 0.08);
    orderData.total = orderData.subtotal + orderData.tax;
    
    // Show loading state
    showLoadingState();
    
    try {
        // Simulate API call
        await processOrder(orderData);
        
        // Show success
        showOrderSuccess();
        
        // Clear cart
        clearCartAfterOrder();
        
    } catch (error) {
        hideLoadingState();
        showOrderError(error.message);
    }
}

// Process order (simulated)
function processOrder(orderData) {
    return new Promise((resolve, reject) => {
        // Simulate processing time
        setTimeout(() => {
            // Simulate success/failure (90% success rate)
            if (Math.random() > 0.1) {
                resolve({
                    orderId: generateOrderId(),
                    status: 'confirmed'
                });
            } else {
                reject(new Error('Payment processing failed. Please try again.'));
            }
        }, 2000);
    });
}

// Show loading state
function showLoadingState() {
    const loadingOverlay = document.getElementById('loadingOverlay');
    const submitBtn = document.getElementById('placeOrderBtn');
    
    loadingOverlay.style.display = 'flex';
    submitBtn.disabled = true;
    
    // Show button loading state
    const btnText = submitBtn.querySelector('.btn-text');
    const btnLoading = submitBtn.querySelector('.btn-loading');
    
    btnText.style.display = 'none';
    btnLoading.style.display = 'flex';
}

// Hide loading state
function hideLoadingState() {
    const loadingOverlay = document.getElementById('loadingOverlay');
    const submitBtn = document.getElementById('placeOrderBtn');
    
    loadingOverlay.style.display = 'none';
    submitBtn.disabled = false;
    
    // Reset button state
    const btnText = submitBtn.querySelector('.btn-text');
    const btnLoading = submitBtn.querySelector('.btn-loading');
    
    btnText.style.display = 'inline';
    btnLoading.style.display = 'none';
}

// Show order success
function showOrderSuccess() {
    hideLoadingState();
    
    const modal = document.getElementById('successModal');
    const orderId = document.getElementById('orderId');
    
    orderId.textContent = generateOrderId();
    modal.style.display = 'flex';
    
    // Clear saved form data
    localStorage.removeItem('checkoutFormData');
}

// Show order error
function showOrderError(message) {
    alert(`Order failed: ${message}`);
}

// Clear cart after successful order
function clearCartAfterOrder() {
    if (window.cart) {
        window.cart = [];
    }
    localStorage.removeItem('nekoFanCart');
}

// Generate order ID
function generateOrderId() {
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substr(2, 5);
    return `NP${timestamp}${random}`.toUpperCase();
}

// Toggle payment fields based on selection
function togglePaymentFields() {
    const creditCardFields = document.getElementById('creditCardFields');
    const paymentMethod = document.querySelector('input[name="paymentMethod"]:checked').value;
    
    if (paymentMethod === 'creditCard') {
        creditCardFields.classList.remove('hidden');
        // Make credit card fields required
        document.getElementById('cardNumber').required = true;
        document.getElementById('expiryDate').required = true;
        document.getElementById('cvv').required = true;
        document.getElementById('cardName').required = true;
    } else {
        creditCardFields.classList.add('hidden');
        // Remove required from credit card fields
        document.getElementById('cardNumber').required = false;
        document.getElementById('expiryDate').required = false;
        document.getElementById('cvv').required = false;
        document.getElementById('cardName').required = false;
    }
}

// Format card number
function formatCardNumber(e) {
    let value = e.target.value.replace(/\s/g, '').replace(/\D/g, '');
    value = value.replace(/(\d{4})(\d{4})(\d{4})(\d{4})/, '$1 $2 $3 $4');
    e.target.value = value;
}

// Format expiry date
function formatExpiryDate(e) {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length >= 2) {
        value = value.substring(0, 2) + '/' + value.substring(2, 4);
    }
    e.target.value = value;
}

// Validate CVV
function validateCVV(e) {
    e.target.value = e.target.value.replace(/\D/g, '');
}

// Format postal code
function formatPostalCode(e) {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 3) {
        value = value.substring(0, 3) + '-' + value.substring(3, 7);
    }
    e.target.value = value;
}

// Format phone number
function formatPhoneNumber(e) {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 3 && value.length <= 7) {
        value = value.substring(0, 3) + '-' + value.substring(3);
    } else if (value.length > 7) {
        value = value.substring(0, 3) + '-' + value.substring(3, 7) + '-' + value.substring(7, 11);
    }
    e.target.value = value;
}

// Save form data to localStorage
function saveFormData() {
    const formData = new FormData(document.getElementById('checkoutForm'));
    const data = Object.fromEntries(formData.entries());
    localStorage.setItem('checkoutFormData', JSON.stringify(data));
}

// Load saved form data
function loadSavedFormData() {
    const saved = localStorage.getItem('checkoutFormData');
    if (saved) {
        const data = JSON.parse(saved);
        Object.keys(data).forEach(key => {
            const element = document.getElementById(key) || document.querySelector(`[name="${key}"]`);
            if (element) {
                if (element.type === 'radio') {
                    if (element.value === data[key]) {
                        element.checked = true;
                    }
                } else {
                    element.value = data[key];
                }
            }
        });
        
        // Trigger payment method toggle after loading
        togglePaymentFields();
    }
}

// Validate entire form
function validateForm() {
    const form = document.getElementById('checkoutForm');
    const inputs = form.querySelectorAll('input[required], select[required]');
    let isValid = true;
    
    inputs.forEach(input => {
        if (!input.value.trim()) {
            isValid = false;
        }
        
        // Additional validation for specific fields
        if (input.type === 'email' && input.value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(input.value)) {
                isValid = false;
            }
        }
        
        if (input.name === 'postalCode' && input.value) {
            const postalRegex = /^\d{3}-\d{4}$/;
            if (!postalRegex.test(input.value)) {
                isValid = false;
            }
        }
        
        if (input.name === 'cardNumber' && input.required && input.value) {
            const cardRegex = /^\d{4}\s\d{4}\s\d{4}\s\d{4}$/;
            if (!cardRegex.test(input.value)) {
                isValid = false;
            }
        }
        
        if (input.name === 'expiryDate' && input.required && input.value) {
            const expiryRegex = /^\d{2}\/\d{2}$/;
            if (!expiryRegex.test(input.value)) {
                isValid = false;
            }
        }
    });
    
    // Update submit button state
    const submitBtn = document.getElementById('placeOrderBtn');
    submitBtn.disabled = !isValid || window.cart.length === 0;
    
    return isValid;
}

// Validate form data before submission
function validateFormData() {
    const form = document.getElementById('checkoutForm');
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());
    
    // Check required fields
    const requiredFields = ['firstName', 'lastName', 'email', 'phone', 'address', 'city', 'prefecture', 'postalCode'];
    
    for (let field of requiredFields) {
        if (!data[field] || !data[field].trim()) {
            alert(`Please fill in the ${field.replace(/([A-Z])/g, ' $1').toLowerCase()} field.`);
            document.getElementById(field).focus();
            return false;
        }
    }
    
    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
        alert('Please enter a valid email address.');
        document.getElementById('email').focus();
        return false;
    }
    
    // Validate postal code
    const postalRegex = /^\d{3}-\d{4}$/;
    if (!postalRegex.test(data.postalCode)) {
        alert('Please enter a valid postal code (format: 123-4567).');
        document.getElementById('postalCode').focus();
        return false;
    }
    
    // Validate credit card if selected
    if (data.paymentMethod === 'creditCard') {
        const cardRequiredFields = ['cardNumber', 'expiryDate', 'cvv', 'cardName'];
        
        for (let field of cardRequiredFields) {
            if (!data[field] || !data[field].trim()) {
                alert(`Please fill in the ${field.replace(/([A-Z])/g, ' $1').toLowerCase()} field.`);
                document.getElementById(field).focus();
                return false;
            }
        }
        
        // Validate card number format
        const cardRegex = /^\d{4}\s\d{4}\s\d{4}\s\d{4}$/;
        if (!cardRegex.test(data.cardNumber)) {
            alert('Please enter a valid card number.');
            document.getElementById('cardNumber').focus();
            return false;
        }
        
        // Validate expiry date format
        const expiryRegex = /^\d{2}\/\d{2}$/;
        if (!expiryRegex.test(data.expiryDate)) {
            alert('Please enter a valid expiry date (MM/YY).');
            document.getElementById('expiryDate').focus();
            return false;
        }
        
        // Validate expiry date is not in the past
        const [month, year] = data.expiryDate.split('/');
        const expiryDate = new Date(2000 + parseInt(year), parseInt(month) - 1);
        const currentDate = new Date();
        currentDate.setDate(1); // Set to first day of current month
        
        if (expiryDate < currentDate) {
            alert('Card expiry date cannot be in the past.');
            document.getElementById('expiryDate').focus();
            return false;
        }
        
        // Validate CVV
        if (data.cvv.length < 3 || data.cvv.length > 4) {
            alert('Please enter a valid CVV (3-4 digits).');
            document.getElementById('cvv').focus();
            return false;
        }
    }
    
    return true;
}

// Go back to cart
function goBackToCart() {
    // Add transition animation
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.3s ease';
    
    setTimeout(() => {
        window.location.href = 'cart.html';
    }, 300);
}

// Redirect to home after successful order
function redirectToHome() {
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.3s ease';
    
    setTimeout(() => {
        window.location.href = 'shop.html'; // or your home page URL
    }, 300);
}

// Handle browser back button
window.addEventListener('beforeunload', (e) => {
    // Save form data before leaving
    saveFormData();
});

// Handle page visibility changes
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        // Save form data when page becomes hidden
        saveFormData();
    } else {
        // Refresh cart data when page becomes visible
        const savedCart = localStorage.getItem('nekoFanCart');
        if (savedCart) {
            window.cart = JSON.parse(savedCart);
            populateOrderSummary();
        }
    }
});

// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
    // ESC key to go back to cart
    if (e.key === 'Escape') {
        goBackToCart();
    }
    
    // Ctrl/Cmd + Enter to submit form (if valid)
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault();
        const submitBtn = document.getElementById('placeOrderBtn');
        if (!submitBtn.disabled) {
            document.getElementById('checkoutForm').dispatchEvent(new Event('submit'));
        }
    }
});

// Auto-focus first empty required field
function focusFirstEmptyField() {
    const requiredInputs = document.querySelectorAll('input[required], select[required]');
    for (let input of requiredInputs) {
        if (!input.value.trim()) {
            input.focus();
            break;
        }
    }
}

// Initialize auto-focus after page load
setTimeout(focusFirstEmptyField, 500);

// Smooth scroll behavior
document.documentElement.style.scrollBehavior = 'smooth';

// Add form submission animation
function addFormSubmissionAnimation() {
    const form = document.getElementById('checkoutForm');
    form.addEventListener('submit', (e) => {
        const formElements = form.querySelectorAll('input, select, textarea, button');
        formElements.forEach((element, index) => {
            setTimeout(() => {
                element.style.transform = 'scale(0.95)';
                element.style.opacity = '0.7';
            }, index * 10);
        });
    });
}

// Initialize form animations
addFormSubmissionAnimation();

// Export functions for cart integration
window.checkoutFunctions = {
    populateOrderSummary,
    updateOrderTotals,
    goBackToCart
};

console.log("Checkout functionality initialized successfully");