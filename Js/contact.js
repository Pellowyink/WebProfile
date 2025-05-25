document.addEventListener('DOMContentLoaded', function() {
    // Get DOM elements
    const contactForm = document.getElementById('contactForm');
    const formInputs = document.querySelectorAll('.form-input, .form-textarea');
    const submitBtn = document.querySelector('.submit-btn');
    const infoItems = document.querySelectorAll('.info-item');
    const iconLinks = document.querySelectorAll('.icon-link');

    // Form submission handler
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Submit button animation
        submitBtn.style.transform = 'scale(0.95)';
        submitBtn.textContent = 'Sending...';
        submitBtn.style.background = '#722d2d';
        
        // Simulate form submission
        setTimeout(() => {
            submitBtn.textContent = 'Message Sent! ✓';
            submitBtn.style.background = '#4CAF50';
            submitBtn.style.transform = 'scale(1)';
            
            // Reset form
            setTimeout(() => {
                contactForm.reset();
                submitBtn.textContent = 'Send Message';
                submitBtn.style.background = '#8b3a3a';
                showSuccessAnimation();
            }, 2000);
        }, 1500);
    });

    // Input focus animations
    formInputs.forEach(input => {
        input.addEventListener('focus', function() {
            this.parentElement.style.transform = 'translateY(-2px)';
            this.style.boxShadow = '0 5px 20px rgba(255, 255, 255, 0.3)';
        });

        input.addEventListener('blur', function() {
            this.parentElement.style.transform = 'translateY(0)';
            this.style.boxShadow = 'none';
        });

        input.addEventListener('input', function() {
            this.style.animation = 'none';
            setTimeout(() => {
                this.style.animation = 'pulse 0.3s ease';
            }, 10);
        });
    });

    // Info items animations
    infoItems.forEach((item, index) => {
        item.addEventListener('mouseenter', function() {
            this.style.transform = 'translateX(10px)';
            this.style.transition = 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
        });

        item.addEventListener('mouseleave', function() {
            this.style.transform = 'translateX(0)';
        });

        // Staggered load animation
        setTimeout(() => {
            item.style.opacity = '0';
            item.style.transform = 'translateY(20px)';
            item.style.transition = 'all 0.6s ease';
            
            setTimeout(() => {
                item.style.opacity = '1';
                item.style.transform = 'translateY(0)';
            }, 100);
        }, index * 150 + 1000);
    });

    // Icon link interactions
    iconLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Ripple effect
            const ripple = document.createElement('span');
            ripple.style.position = 'absolute';
            ripple.style.width = '20px';
            ripple.style.height = '20px';
            ripple.style.background = 'rgba(166, 77, 77, 0.3)';
            ripple.style.borderRadius = '50%';
            ripple.style.transform = 'scale(0)';
            ripple.style.animation = 'ripple 0.6s ease-out';
            
            this.style.position = 'relative';
            this.appendChild(ripple);
            
            setTimeout(() => {
                if (ripple.parentNode) {
                    ripple.parentNode.removeChild(ripple);
                }
            }, 600);
        });

        link.addEventListener('mouseenter', function() {
            this.style.animation = 'bounce 0.5s ease';
        });
    });

    // Parallax shimmer effect
    let ticking = false;
    
    function updateShimmer() {
        const scrolled = window.pageYOffset;
        const parallax = document.querySelector('.contact-content::before');
        const speed = scrolled * 0.5;
        
        if (parallax) {
            parallax.style.transform = `translateY(${speed}px)`;
        }
        
        ticking = false;
    }

    function requestTick() {
        if (!ticking) {
            requestAnimationFrame(updateShimmer);
            ticking = true;
        }
    }

    window.addEventListener('scroll', requestTick);

    // Success notification
    function showSuccessAnimation() {
        const successDiv = document.createElement('div');
        successDiv.innerHTML = '✨ Message sent successfully! ✨';
        successDiv.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%) scale(0);
            background: #4CAF50;
            color: white;
            padding: 20px 40px;
            border-radius: 15px;
            font-size: 18px;
            font-weight: 600;
            z-index: 1000;
            box-shadow: 0 10px 30px rgba(76, 175, 80, 0.3);
            animation: successPop 2s ease-out forwards;
        `;
        
        document.body.appendChild(successDiv);
        
        setTimeout(() => {
            if (successDiv.parentNode) {
                successDiv.parentNode.removeChild(successDiv);
            }
        }, 2000);
    }

    // Floating contact card animation
    const contactCard = document.querySelector('.contact-info-card');
    if (contactCard) {
        setInterval(() => {
            contactCard.style.transform = `translateY(${Math.sin(Date.now() / 1000) * 3}px)`;
        }, 50);
    }

    // Map breathing effect
    const mapContainer = document.querySelector('.map-container');
    if (mapContainer) {
        setInterval(() => {
            mapContainer.style.transform = `scale(${1 + Math.sin(Date.now() / 2000) * 0.02})`;
        }, 100);
    }
});