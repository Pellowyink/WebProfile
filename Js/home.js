// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    
    // Intersection Observer for scroll animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animationPlayState = 'running';
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);

    // Observe elements for scroll animations
    const animateElements = document.querySelectorAll('.about-section, .profile-section');
    animateElements.forEach(el => observer.observe(el));

    // Enhanced CTA button interactions
    const ctaButton = document.querySelector('.cta-button');
    if (ctaButton) {
        ctaButton.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-3px) scale(1.05)';
            
            // Create ripple effect
            const ripple = document.createElement('div');
            ripple.style.cssText = `
                position: absolute;
                border-radius: 50%;
                background: rgba(212, 130, 107, 0.3);
                width: 20px;
                height: 20px;
                animation: ripple 0.6s linear;
                pointer-events: none;
            `;
            
            const rect = this.getBoundingClientRect();
            ripple.style.left = '50%';
            ripple.style.top = '50%';
            ripple.style.transform = 'translate(-50%, -50%)';
            
            this.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
        
        ctaButton.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    }

    // Image card hover effects with 3D tilt
    const imageCards = document.querySelectorAll('.image-card');
    imageCards.forEach(card => {
        card.addEventListener('mouseenter', function(e) {
            const rect = this.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;
            
            this.style.transform = 'translateY(-10px) scale(1.02) rotateX(5deg) rotateY(2deg)';
            this.style.transition = 'all 0.4s ease';
        });
        
        card.addEventListener('mousemove', function(e) {
            const rect = this.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const rotateX = (y - rect.height / 2) / 10;
            const rotateY = (rect.width / 2 - x) / 10;
            
            this.style.transform = `translateY(-10px) scale(1.02) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1) rotateX(0) rotateY(0)';
        });
    });

    // Floating elements dynamic movement
    const floatingElements = document.querySelectorAll('.float-element');
    floatingElements.forEach((element, index) => {
        // Add random movement
        setInterval(() => {
            const randomX = (Math.random() - 0.5) * 20;
            const randomY = (Math.random() - 0.5) * 20;
            
            element.style.transform = `translate(${randomX}px, ${randomY}px) rotate(${Math.random() * 360}deg)`;
            element.style.transition = 'transform 2s ease-in-out';
        }, 3000 + index * 1000);
    });

    // Profile card interactive elements
    const profileCard = document.querySelector('.profile-card');
    if (profileCard) {
        profileCard.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px)';
            this.style.boxShadow = '0 25px 80px rgba(0,0,0,0.15)';
        });
        
        profileCard.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
            this.style.boxShadow = '0 20px 60px rgba(0,0,0,0.1)';
        });
    }

    // Enhanced social link interactions
    const socialLinks = document.querySelectorAll('.social-link');
    socialLinks.forEach(link => {
        link.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px) scale(1.1) rotate(5deg)';
            
            // Create glow effect
            this.style.boxShadow = '0 15px 35px rgba(212, 130, 107, 0.6)';
            
            // Add sparkle effect
            const sparkle = document.createElement('div');
            sparkle.style.cssText = `
                position: absolute;
                width: 4px;
                height: 4px;
                background: white;
                border-radius: 50%;
                animation: sparkle 1s ease-out;
                pointer-events: none;
            `;
            
            sparkle.style.left = Math.random() * 50 + 'px';
            sparkle.style.top = Math.random() * 50 + 'px';
            
            this.appendChild(sparkle);
            
            setTimeout(() => {
                sparkle.remove();
            }, 1000);
        });
        
        link.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1) rotate(0deg)';
            this.style.boxShadow = '0 5px 15px rgba(212, 130, 107, 0.3)';
        });
    });

    // Parallax effect for background elements
    window.addEventListener('scroll', function() {
        const scrolled = window.pageYOffset;
        const rate = scrolled * -0.5;
        
        const floatingElements = document.querySelectorAll('.float-element');
        floatingElements.forEach((element, index) => {
            element.style.transform = `translateY(${rate * (index + 1) * 0.2}px)`;
        });
        
        const catSilhouettes = document.querySelectorAll('.cat-silhouette');
        catSilhouettes.forEach((cat, index) => {
            cat.style.transform = `translateY(${rate * (index + 1) * 0.3}px)`;
        });
    });

    // Text animation on scroll
    const animateText = (element) => {
        const text = element.textContent;
        element.innerHTML = '';
        
        [...text].forEach((char, index) => {
            const span = document.createElement('span');
            span.textContent = char === ' ' ? '\xa0' : char;
            span.style.opacity = '0';
            span.style.transform = 'translateY(20px)';
            span.style.transition = `all 0.3s ease ${index * 0.05}s`;
            element.appendChild(span);
            
            setTimeout(() => {
                span.style.opacity = '1';
                span.style.transform = 'translateY(0)';
            }, 100);
        });
    };

    // Trigger text animation for titles when they come into view
    const titleObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !entry.target.classList.contains('animated')) {
                entry.target.classList.add('animated');
                animateText(entry.target);
            }
        });
    }, { threshold: 0.5 });

    const titles = document.querySelectorAll('.section-title, .profile-name');
    titles.forEach(title => titleObserver.observe(title));

    // Add CSS for additional animations
    const style = document.createElement('style');
    style.textContent = `
        @keyframes ripple {
            to {
                width: 100px;
                height: 100px;
                opacity: 0;
            }
        }
        
        @keyframes sparkle {
            0% {
                opacity: 0;
                transform: scale(0) rotate(0deg);
            }
            50% {
                opacity: 1;
                transform: scale(1) rotate(180deg);
            }
            100% {
                opacity: 0;
                transform: scale(0) rotate(360deg);
            }
        }
        
        .animate-in {
            animation-delay: 0s !important;
        }
        
        .profile-image {
            transition: all 0.3s ease;
        }
        
        .profile-image:hover {
            transform: scale(1.02) rotateY(5deg);
        }
        
        .gradient-bg {
            transition: all 0.3s ease;
        }
        
        .profile-card:hover .gradient-bg {
            transform: rotate(-8deg) scale(1.02);
        }
        
        .hero-section::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grain" width="100" height="100" patternUnits="userSpaceOnUse"><circle cx="25" cy="25" r="1" fill="%23ffffff" opacity="0.1"/><circle cx="75" cy="75" r="1" fill="%23ffffff" opacity="0.1"/><circle cx="50" cy="10" r="0.5" fill="%23ffffff" opacity="0.15"/><circle cx="20" cy="60" r="0.5" fill="%23ffffff" opacity="0.15"/><circle cx="80" cy="40" r="0.5" fill="%23ffffff" opacity="0.15"/></pattern></defs><rect width="100" height="100" fill="url(%23grain)"/></svg>');
            pointer-events: none;
            opacity: 0.3;
        }
        
        .quote-container {
            transition: all 0.3s ease;
        }
        
        .quote-container:hover {
            transform: translateX(10px);
            box-shadow: -5px 5px 20px rgba(212, 130, 107, 0.2);
        }
    `;
    document.head.appendChild(style);

    // Interactive quote container
    const quoteContainer = document.querySelector('.quote-container');
    if (quoteContainer) {
        quoteContainer.addEventListener('mouseenter', function() {
            this.style.background = 'linear-gradient(135deg, rgba(212, 130, 107, 0.15), rgba(200, 106, 79, 0.15))';
        });
        
        quoteContainer.addEventListener('mouseleave', function() {
            this.style.background = 'linear-gradient(135deg, rgba(212, 130, 107, 0.1), rgba(200, 106, 79, 0.1))';
        });
    }

    // Smooth scroll behavior for any anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Add loading animation
    window.addEventListener('load', function() {
        document.body.style.opacity = '0';
        document.body.style.transition = 'opacity 0.5s ease';
        
        setTimeout(() => {
            document.body.style.opacity = '1';
        }, 100);
    });

    // Dynamic gradient shifting for hero section
    const heroSection = document.querySelector('.hero-section');
    if (heroSection) {
        let gradientAngle = 135;
        setInterval(() => {
            gradientAngle += 1;
            if (gradientAngle > 225) gradientAngle = 135;
            
            heroSection.style.background = `linear-gradient(${gradientAngle}deg, #d4826b 0%, #c86a4f 50%, #b85a42 100%)`;
        }, 100);
    }

    // Cat silhouette interactions
    const catSilhouettes = document.querySelectorAll('.cat-silhouette');
    catSilhouettes.forEach(cat => {
        cat.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.5) rotate(10deg)';
            this.style.opacity = '0.8';
            this.style.transition = 'all 0.3s ease';
        });
        
        cat.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1) rotate(0deg)';
            this.style.opacity = '0.2';
        });
    });

    // Add mouse trail effect
    const trail = [];
    const trailLength = 10;
    
    document.addEventListener('mousemove', function(e) {
        trail.push({ x: e.clientX, y: e.clientY, time: Date.now() });
        
        if (trail.length > trailLength) {
            trail.shift();
        }
        
        // Remove old trail elements
        document.querySelectorAll('.mouse-trail').forEach(el => {
            if (Date.now() - parseInt(el.dataset.time) > 1000) {
                el.remove();
            }
        });
        
        // Create new trail element occasionally
        if (Math.random() < 0.1) {
            const trailElement = document.createElement('div');
            trailElement.className = 'mouse-trail';
            trailElement.dataset.time = Date.now();
            trailElement.style.cssText = `
                position: fixed;
                width: 4px;
                height: 4px;
                background: rgba(212, 130, 107, 0.6);
                border-radius: 50%;
                pointer-events: none;
                z-index: 9999;
                animation: trailFade 1s ease-out forwards;
            `;
            trailElement.style.left = e.clientX + 'px';
            trailElement.style.top = e.clientY + 'px';
            
            document.body.appendChild(trailElement);
        }
    });

    // Add trail fade animation
    const trailStyle = document.createElement('style');
    trailStyle.textContent = `
        @keyframes trailFade {
            0% {
                opacity: 1;
                transform: scale(1);
            }
            100% {
                opacity: 0;
                transform: scale(0);
            }
        }
    `;
    document.head.appendChild(trailStyle);

    console.log('🐱 Neko Pan animations loaded successfully!');
});