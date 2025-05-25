// View Toggle Functionality
const gridViewBtn = document.getElementById('gridView');
const listViewBtn = document.getElementById('listView');
const productsGrid = document.getElementById('productsGrid');

gridViewBtn.addEventListener('click', () => {
    gridViewBtn.classList.add('active');
    listViewBtn.classList.remove('active');
    productsGrid.classList.remove('list-view');
    animateViewChange();
});

listViewBtn.addEventListener('click', () => {
    listViewBtn.classList.add('active');
    gridViewBtn.classList.remove('active');
    productsGrid.classList.add('list-view');
    animateViewChange();
});

function animateViewChange() {
    productsGrid.style.opacity = '0';
    productsGrid.style.transform = 'translateY(20px)';
    
    setTimeout(() => {
        productsGrid.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
        productsGrid.style.opacity = '1';
        productsGrid.style.transform = 'translateY(0)';
    }, 200);
}

// Sorting Functionality
const sortSelect = document.getElementById('sortSelect');
const productCards = Array.from(document.querySelectorAll('.product-card'));

sortSelect.addEventListener('change', (e) => {
    const sortType = e.target.value;
    sortProducts(sortType);
});

function sortProducts(sortType) {
    let sortedCards = [...productCards];

    switch(sortType) {
        case 'priceAsc':
            sortedCards.sort((a, b) => {
                return parseInt(a.dataset.price) - parseInt(b.dataset.price);
            });
            break;
        case 'priceDesc':
            sortedCards.sort((a, b) => {
                return parseInt(b.dataset.price) - parseInt(a.dataset.price);
            });
            break;
        case 'nameAsc':
            sortedCards.sort((a, b) => {
                return a.dataset.name.localeCompare(b.dataset.name);
            });
            break;
        case 'nameDesc':
            sortedCards.sort((a, b) => {
                return b.dataset.name.localeCompare(a.dataset.name);
            });
            break;
        default:
            // Default order - reset to original order
            sortedCards = [...productCards];
            break;
    }

    // Animate sorting with stagger effect
    productsGrid.style.opacity = '0.3';
    
    setTimeout(() => {
        // Clear and re-append sorted cards
        productsGrid.innerHTML = '';
        sortedCards.forEach((card, index) => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';
            card.style.transition = 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
            card.style.animationDelay = `${index * 0.1}s`;
            productsGrid.appendChild(card);
            
            // Trigger animation
            setTimeout(() => {
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, index * 100);
        });
        
        productsGrid.style.opacity = '1';
    }, 300);
}

// Add to Cart Animation and Functionality
function addToCart(productName, price) {
    const productCard = event.target.closest('.product-card');
    const button = event.target;
    
    // Add loading state
    const originalText = button.innerHTML;
    button.innerHTML = '<span class="loading"></span> Adding...';
    button.disabled = true;
    
    // Add pulse animation to card
    productCard.classList.add('adding-to-cart');
    
    // Create floating price animation
    createFloatingPrice(button, price);
    
    // Actually add to cart using localStorage
    addItemToCart(productName, price);
    
    setTimeout(() => {
        button.innerHTML = '✓ Added to Cart!';
        button.style.background = 'linear-gradient(45deg, #90EE90, #32CD32)';
        
        setTimeout(() => {
            button.innerHTML = originalText;
            button.disabled = false;
            button.style.background = '';
            productCard.classList.remove('adding-to-cart');
        }, 2000);
    }, 1000);

    // Log for debugging
    console.log(`Added ${productName} (¥${price}) to cart`);
    
    // Update cart count if you have a cart counter
    updateCartCount();
}

// Actually add item to cart storage
function addItemToCart(productName, price) {
    // Product data for cart
    const productData = {
        'Shokupan': {
            description: 'Soft, fluffy Japanese milk bread with a pillowy texture that melts in your mouth. Perfect for breakfast or as a sweet treat!',
            image: 'image/shokupan.webp'
        },
        'Kookie': {
            description: 'Crispy, golden cookies with a delightful crunch and rich buttery flavor. Made with premium ingredients for the perfect bite every time.',
            image: 'image/kookie.webp'
        },
        'Ragamuffin': {
            description: 'Hearty, rustic muffin bursting with fresh berries and nuts. A wholesome treat that\'s perfect with your morning coffee.',
            image: 'image/ragamuffin.webp'
        },
        'Scottish Fold': {
            description: 'Delicate, flaky pastry folded to perfection with layers of buttery goodness. A traditional recipe with a modern twist.',
            image: 'image/scottishfold.jpg'
        },
        'Calico Pan': {
            description: 'Colorful, artisanal bread with a beautiful marbled pattern. Each slice reveals a stunning mix of flavors and textures.',
            image: 'image/calicopan.jpg'
        },
        'Fawn Pan': {
            description: 'Elegant, caramel-colored bread with a subtle sweetness and tender crumb. A sophisticated choice for discerning palates.',
            image: 'image/fawnpan.jpg'
        },

        'Mittens': {
            description: 'Elegant, caramel-colored bread with a subtle sweetness and tender crumb. A sophisticated choice for discerning palates.',
            image: 'image/calicopan2.webp'
        },

        'Tabby Cakes': {
            description: 'Light, creamy mousse with hints of strawberry in a charming cat shape. A refreshing delight for any occasion.',
            image: 'image/tabbycakes.webp'
        },

        'Munchkins': {
            description: 'Golden, buttery cakes with a soft center and crisp edges. Simple, comforting, and irresistibly cute.',
            image: 'image/munchkins.webp'
        },
    };

    // Get existing cart or create new one
    let cart = JSON.parse(localStorage.getItem('nekoFanCart') || '[]');
    
    // Check if item already exists
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
    
    // Save back to localStorage
    localStorage.setItem('nekoFanCart', JSON.stringify(cart));
}

// Create floating price animation
function createFloatingPrice(button, price) {
    const floatingPrice = document.createElement('div');
    floatingPrice.textContent = `+¥${price}`;
    floatingPrice.style.cssText = `
        position: fixed;
        color: #FFD700;
        font-weight: bold;
        font-size: 18px;
        pointer-events: none;
        z-index: 1000;
        transition: all 1s ease-out;
        text-shadow: 2px 2px 4px rgba(0,0,0,0.5);
    `;
    
    const rect = button.getBoundingClientRect();
    floatingPrice.style.left = `${rect.left + rect.width/2}px`;
    floatingPrice.style.top = `${rect.top}px`;
    
    document.body.appendChild(floatingPrice);
    
    // Animate upward
    setTimeout(() => {
        floatingPrice.style.transform = 'translateY(-50px)';
        floatingPrice.style.opacity = '0';
    }, 100);
    
    // Remove element
    setTimeout(() => {
        document.body.removeChild(floatingPrice);
    }, 1100);
}

// Update cart count (now actually functional)
function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem('nekoFanCart') || '[]');
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    
    // Update any cart counter displays on the page
    const cartCounters = document.querySelectorAll('.cart-counter');
    cartCounters.forEach(counter => {
        counter.textContent = totalItems;
        if (totalItems > 0) {
            counter.style.display = 'inline-block';
        } else {
            counter.style.display = 'none';
        }
    });
    
    console.log(`Cart updated: ${totalItems} items`);
}

// Add cart navigation function
function goToCart() {
    // Add transition animation
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.3s ease';
    
    setTimeout(() => {
        window.location.href = 'cart.html';
    }, 300);
}

// Stagger animation for initial load
document.addEventListener('DOMContentLoaded', () => {
    const cards = document.querySelectorAll('.product-card');
    cards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        
        setTimeout(() => {
            card.style.transition = 'all 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, index * 150);
    });
    
    // Initialize view state
    initializeViewState();
});

// Initialize view state based on screen size
function initializeViewState() {
    const isMobile = window.innerWidth <= 768;
    if (isMobile) {
        // Default to list view on mobile for better readability
        listViewBtn.click();
    }
}

// Enhanced hover effects
document.querySelectorAll('.product-card').forEach(card => {
    card.addEventListener('mouseenter', () => {
        card.style.filter = 'brightness(1.05)';
        
        // Add subtle rotation effect
        const randomRotation = (Math.random() - 0.5) * 2; // -1 to 1 degree
        card.style.transform += ` rotate(${randomRotation}deg)`;
    });
    
    card.addEventListener('mouseleave', () => {
        card.style.filter = 'brightness(1)';
        card.style.transform = card.style.transform.replace(/rotate\([^)]*\)/g, '');
    });
    
    // Add click ripple effect
    card.addEventListener('click', (e) => {
        if (e.target.classList.contains('buy-btn')) return;
        
        const ripple = document.createElement('div');
        const rect = card.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;
        
        ripple.style.cssText = `
            position: absolute;
            width: ${size}px;
            height: ${size}px;
            left: ${x}px;
            top: ${y}px;
            background: rgba(255, 255, 255, 0.1);
            border-radius: 50%;
            transform: scale(0);
            transition: transform 0.6s ease-out;
            pointer-events: none;
        `;
        
        card.appendChild(ripple);
        
        setTimeout(() => {
            ripple.style.transform = 'scale(2)';
            ripple.style.opacity = '0';
        }, 10);
        
        setTimeout(() => {
            if (ripple.parentNode) {
                ripple.parentNode.removeChild(ripple);
            }
        }, 600);
    });
});

// Smooth scroll behavior
document.documentElement.style.scrollBehavior = 'smooth';

// Intersection Observer for scroll animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe all product cards for scroll animations
document.querySelectorAll('.product-card').forEach(card => {
    observer.observe(card);
});

// Handle window resize for responsive behavior
window.addEventListener('resize', () => {
    // Debounce resize events
    clearTimeout(window.resizeTimeout);
    window.resizeTimeout = setTimeout(() => {
        // Reinitialize view state if needed
        const isMobile = window.innerWidth <= 768;
        if (isMobile && !productsGrid.classList.contains('list-view')) {
            // Auto-switch to list view on mobile for better UX
            // listViewBtn.click();
        }
    }, 250);
});

// Keyboard navigation support
document.addEventListener('keydown', (e) => {
    if (e.key === 'Tab') {
        // Enhance focus visibility
        document.body.classList.add('keyboard-nav');
    }
});

document.addEventListener('mousedown', () => {
    document.body.classList.remove('keyboard-nav');
});

// Search functionality (if you want to add it later)
function filterProducts(searchTerm) {
    const cards = document.querySelectorAll('.product-card');
    let visibleCount = 0;
    
    cards.forEach(card => {
        const name = card.dataset.name.toLowerCase();
        const description = card.querySelector('.product-description').textContent.toLowerCase();
        
        if (name.includes(searchTerm.toLowerCase()) || description.includes(searchTerm.toLowerCase())) {
            card.style.display = 'block';
            visibleCount++;
        } else {
            card.style.display = 'none';
        }
    });
    
    document.getElementById('resultCount').textContent = visibleCount;
}

// Performance optimization: Lazy load images when they come into view
const imageObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const img = entry.target;
            if (img.dataset.src) {
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                imageObserver.unobserve(img);
            }
        }
    });
});

// Apply lazy loading to all product images
document.querySelectorAll('.product-image img').forEach(img => {
    imageObserver.observe(img);
});