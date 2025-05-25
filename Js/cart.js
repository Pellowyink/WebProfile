console.log("Cart.js loaded successfully");
// Cart data structure
let cart = [];

// Product data for reference
const productData = {
    'Shokupan': {
        price: 85,
        description: 'Soft, fluffy Japanese milk bread with a pillowy texture that melts in your mouth. Perfect for breakfast or as a sweet treat!',
        image: 'image/shokupan.webp'
    },
    'Kookie': {
        price: 120,
        description: 'Crispy, golden cookies with a delightful crunch and rich buttery flavor. Made with premium ingredients for the perfect bite every time.',
        image: 'image/kookie.webp'  
    },
    'Ragamuffin': {
        price: 95,
        description: 'Hearty, rustic muffin bursting with fresh berries and nuts. A wholesome treat that\'s perfect with your morning coffee.',
        image: 'image/ragamuffin.webp'  
    },
    'Scottish Fold': {
        price: 110,
        description: 'Delicate, flaky pastry folded to perfection with layers of buttery goodness. A traditional recipe with a modern twist.',
        image: 'image/scottishfold.jpg'  
    },
    'Calico Pan': {
        price: 75,
        description: 'Colorful, artisanal bread with a beautiful marbled pattern. Each slice reveals a stunning mix of flavors and textures.',
        image: 'image/calicopan.jpg'  
    },
    'Fawn Pan': {
        price: 105,
        description: 'Elegant, caramel-colored bread with a subtle sweetness and tender crumb. A sophisticated choice for discerning palates.',
        image: 'image/fawnpan.jpg'  
    },
    
    'Mittens': {
        price: 75,
        description: 'Elegant, caramel-colored bread with a subtle sweetness and tender crumb. A sophisticated choice for discerning palates.',
        image: 'image/calicopan2.webp'
    },

    'Tabby Cakes': {
        price: 80,
        description: 'Light, creamy mousse with hints of strawberry in a charming cat shape. A refreshing delight for any occasion.',
        image: 'image/tabbycakes.webp'
    },

    'Munchkins': {
        price: 140,
        description: 'Golden, buttery cakes with a soft center and crisp edges. Simple, comforting, and irresistibly cute.',
        image: 'image/munchkins.webp'
    },
};

// Initialize cart on page load
document.addEventListener('DOMContentLoaded', () => {
    loadCartFromStorage();
    renderCart();
    updateCartDisplay();
});

// Load cart from localStorage
function loadCartFromStorage() {
    const savedCart = localStorage.getItem('nekoFanCart');
    if (savedCart) {
        cart = JSON.parse(savedCart);
    }
}

// Save cart to localStorage
function saveCartToStorage() {
    localStorage.setItem('nekoFanCart', JSON.stringify(cart));
}

// Add item to cart (called from shop page)
function addToCart(productName, price) {
    const existingItem = cart.find(item => item.name === productName);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            name: productName,
            price: price,
            quantity: 1,
            description: productData[productName]?.description || '',
            image: productData[productName]?.image || ''
        });
    }
    
    saveCartToStorage();
    
    // Show success animation if on cart page
    if (document.getElementById('cartItems')) {
        renderCart();
        updateCartDisplay();
        showAddedAnimation(productName);
    }
    
    console.log(`${productName} added to cart`);
}

// Remove item from cart
function removeFromCart(productName) {
    const itemElement = document.querySelector(`[data-product="${productName}"]`);
    
    if (itemElement) {
        itemElement.classList.add('removing');
        
        setTimeout(() => {
            cart = cart.filter(item => item.name !== productName);
            saveCartToStorage();
            renderCart();
            updateCartDisplay();
        }, 400);
    }
}

// Update item quantity
function updateQuantity(productName, change) {
    const item = cart.find(item => item.name === productName);
    
    if (item) {
        item.quantity += change;
        
        if (item.quantity <= 0) {
            removeFromCart(productName);
            return;
        }
        
        saveCartToStorage();
        renderCart();
        updateCartDisplay();
        
        // Add pulse animation to updated item
        const itemElement = document.querySelector(`[data-product="${productName}"]`);
        if (itemElement) {
            itemElement.style.animation = 'none';
            setTimeout(() => {
                itemElement.style.animation = 'pulse 0.3s ease-in-out';
            }, 10);
        }
    }
}

// Clear entire cart
function clearCart() {
    if (cart.length === 0) return;
    
    if (confirm('Are you sure you want to clear your cart?')) {
        // Animate all items out
        const cartItems = document.querySelectorAll('.cart-item');
        cartItems.forEach((item, index) => {
            setTimeout(() => {
                item.classList.add('removing');
            }, index * 100);
        });
        
        setTimeout(() => {
            cart = [];
            saveCartToStorage();
            renderCart();
            updateCartDisplay();
        }, cartItems.length * 100 + 400);
    }
}

// Render cart items
function renderCart() {
    const cartItemsContainer = document.getElementById('cartItems');
    const emptyCartContainer = document.getElementById('emptyCart');
    const cartSummary = document.getElementById('cartSummary');
    
    
    if (cart.length === 0) {
        if (cartItemsContainer) cartItemsContainer.style.display = 'none';
        if (cartSummary) cartSummary.style.display = 'none';
        if (emptyCartContainer) emptyCartContainer.style.display = 'block';
        return;
    }
    
    if (cartItemsContainer) cartItemsContainer.style.display = 'block';
    if (cartSummary) cartSummary.style.display = 'block';
    if (emptyCartContainer) emptyCartContainer.style.display = 'none';
    
    if (cartItemsContainer) {
        cartItemsContainer.innerHTML = cart.map((item, index) => `
            <div class="cart-item" data-product="${item.name}" style="animation-delay: ${index * 0.1}s">
                <div class="cart-item-image">
                    <img src="${item.image}" alt="${item.name}" 
                         onerror="this.src='images/nekopan.png'; this.onerror=null;"
                         loading="lazy"
                         style="width: 100%; height: 100%; object-fit: cover; border-radius: 8px;">
                </div>
                <div class="cart-item-info">
                    <div class="cart-item-name">${item.name}</div>
                    <div class="cart-item-description">${item.description}</div>
                    <div class="cart-item-price">¥${item.price} each</div>
                </div>
                <div class="cart-item-controls">
                    <div class="quantity-controls">
                        <button class="qty-btn" onclick="updateQuantity('${item.name}', -1)" ${item.quantity <= 1 ? 'disabled' : ''}>-</button>
                        <span class="quantity-display">${item.quantity}</span>
                        <button class="qty-btn" onclick="updateQuantity('${item.name}', 1)">+</button>
                    </div>
                    <button class="remove-btn" onclick="removeFromCart('${item.name}')">Remove</button>
                </div>
            </div>
        `).join('');
    }
}

// Update cart display (counts, totals, etc.)
function updateCartDisplay() {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const tax = Math.round(subtotal * 0.08);
    const total = subtotal + tax;
    
    // Update cart count
    const cartCountElement = document.getElementById('cartCount');
    if (cartCountElement) {
        cartCountElement.textContent = `(${totalItems} items)`;
    }
    
    // Update summary
    const subtotalElement = document.getElementById('subtotal');
    const taxElement = document.getElementById('tax');
    const totalElement = document.getElementById('total');
    
    if (subtotalElement) subtotalElement.textContent = `¥${subtotal}`;
    if (taxElement) taxElement.textContent = `¥${tax}`;
    if (totalElement) totalElement.textContent = `¥${total}`;
    
    // Update button states
    const clearBtn = document.getElementById('clearCartBtn');
    const checkoutBtn = document.querySelector('.checkout-btn');
    
    if (clearBtn) {
        clearBtn.disabled = cart.length === 0;
    }
    
    if (checkoutBtn) {
        checkoutBtn.disabled = cart.length === 0;
    }
}

// Show animation when item is added
function showAddedAnimation(productName) {
    // Create floating notification
    const notification = document.createElement('div');
    notification.textContent = `${productName} added to cart!`;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #32CD32;
        color: white;
        padding: 15px 20px;
        border-radius: 10px;
        box-shadow: 0 4px 15px rgba(50, 205, 50, 0.3);
        z-index: 1000;
        transition: all 0.3s ease;
        transform: translateX(100%);
        font-weight: bold;
    `;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Animate out and remove
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 2000);
}

// Pulse animation for quantity updates
function addPulseAnimation() {
    const style = document.createElement('style');
    style.textContent = `
        @keyframes pulse {
            0% { transform: scale(1); }
            50% { transform: scale(1.05); }
            100% { transform: scale(1); }
        }
        
        .cart-item {
            animation: slideIn 0.5s ease-out forwards;
        }
        
        @keyframes slideIn {
            from {
                opacity: 0;
                transform: translateY(20px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        
        .cart-item.removing {
            animation: slideOut 0.4s ease-in forwards;
        }
        
        @keyframes slideOut {
            from {
                opacity: 1;
                transform: translateX(0);
            }
            to {
                opacity: 0;
                transform: translateX(-100%);
            }
        }
        
        .cart-item-image {
            width: 80px;
            height: 80px;
            border-radius: 8px;
            overflow: hidden;
            flex-shrink: 0;
        }
        
        .cart-item-image img {
            transition: transform 0.3s ease;
        }
        
        .cart-item-image:hover img {
            transform: scale(1.05);
        }
    `;
    document.head.appendChild(style);
}

// Go back to shop
function goBackToShop() {
    // Add transition animation
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.3s ease';
    
    setTimeout(() => {
        window.location.href = 'shop.html'; // or your shop page URL
    }, 300);
}

// Proceed to checkout function
function proceedToCheckout() {
    if (cart.length === 0) {
        alert('Your cart is empty!');
        return;
    }
    
    // Save cart to localStorage to ensure it's available on checkout page
    saveCartToStorage();
    
    // Add transition animation
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.3s ease';
    
    // Show loading state on checkout button
    const checkoutBtn = document.querySelector('.checkout-btn');
    if (checkoutBtn) {
        const originalText = checkoutBtn.innerHTML;
        checkoutBtn.innerHTML = '⏳ Redirecting...';
        checkoutBtn.disabled = true;
        
        // Reset button after redirect (in case user goes back)
        setTimeout(() => {
            checkoutBtn.innerHTML = originalText;
            checkoutBtn.disabled = false;
        }, 3000);
    }
    
    // Redirect to checkout page after animation
    setTimeout(() => {
        window.location.href = 'checkout.html'; // Make sure this matches your checkout file name
    }, 300);
}

// Get cart total count (for external use)
function getCartCount() {
    return cart.reduce((sum, item) => sum + item.quantity, 0);
}

// Get cart total value (for external use)
function getCartTotal() {
    return cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
}

// Check if item is in cart
function isInCart(productName) {
    return cart.some(item => item.name === productName);
}

// Get item quantity in cart
function getItemQuantity(productName) {
    const item = cart.find(item => item.name === productName);
    return item ? item.quantity : 0;
}

// Handle browser back/forward buttons
window.addEventListener('popstate', () => {
    loadCartFromStorage();
    renderCart();
    updateCartDisplay();
});

// Handle page visibility changes
document.addEventListener('visibilitychange', () => {
    if (!document.hidden) {
        // Refresh cart when page becomes visible (in case it was updated in another tab)
        loadCartFromStorage();
        renderCart();
        updateCartDisplay();
    }
});

// Add pulse animation styles
addPulseAnimation();

// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
    // ESC key to go back to shop
    if (e.key === 'Escape') {
        goBackToShop();
    }
    
    // Ctrl/Cmd + Enter to checkout
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        proceedToCheckout();
    }
});

// Smooth scroll behavior
document.documentElement.style.scrollBehavior = 'smooth';

// Auto-save cart every 30 seconds (in case of browser crashes)
setInterval(() => {
    if (cart.length > 0) {
        saveCartToStorage();
    }
}, 30000);

// Make functions available globally for shop page integration
window.cartFunctions = {
    addToCart,
    getCartCount,
    getCartTotal,
    isInCart,
    getItemQuantity
};