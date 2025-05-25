// Wait for the DOM to fully load
document.addEventListener('DOMContentLoaded', function() {
    // Carousel elements
    const carouselSlides = document.getElementById('carouselSlides');
    const slides = document.querySelectorAll('.carousel-slide');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const dots = document.querySelectorAll('.dot');
    
    // Carousel configuration
    let slidesToShow = 4; // Number of slides visible at once (will be adjusted for responsive)
    const totalSlides = slides.length;
    let currentIndex = 0;
    let slideWidth;
    
    // Initial setup
    initCarousel();
    
    // Initialize carousel
    function initCarousel() {
        // Set initial slides to show based on screen size
        setResponsiveValues();
        
        // Add event listeners
        prevBtn.addEventListener('click', navigatePrev);
        nextBtn.addEventListener('click', navigateNext);
        
        // Add dot event listeners
        dots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                navigateToGroup(index);
            });
        });
        
        // Make slides clickable
        slides.forEach(slide => {
            slide.addEventListener('click', function() {
                // Here you can add functionality when a slide is clicked
                console.log('Slide clicked:', this);
            });
        });
        
        // Add responsive behavior
        window.addEventListener('resize', function() {
            setResponsiveValues();
            updateCarousel(true);
        });
        
        // Set initial state
        updateCarousel(false);
        
        // Set first dot as active
        dots[0].classList.add('active');
    }
    
    // Set responsive values based on screen width
    function setResponsiveValues() {
        // Determine how many slides to show based on screen width
        if (window.innerWidth <= 576) {
            slidesToShow = 1;
        } else if (window.innerWidth <= 768) {
            slidesToShow = 2;
        } else if (window.innerWidth <= 900) {
            slidesToShow = 3;
        } else {
            slidesToShow = 4;
        }
        
        // Calculate slide width as percentage
        slideWidth = 100 / slidesToShow;
        
        // Update all slides with new width
        slides.forEach(slide => {
            slide.style.minWidth = `${slideWidth}%`;
        });
    }
    
    // Update carousel based on current index
    function updateCarousel(animate = true) {
        // If animating, add transition class
        if (animate) {
            carouselSlides.style.transition = 'transform 0.5s ease-in-out';
        } else {
            carouselSlides.style.transition = 'none';
        }
        
        // Calculate transform value
        const transformValue = -currentIndex * slideWidth;
        carouselSlides.style.transform = `translateX(${transformValue}%)`;
        
        // Update active state for all slides
        slides.forEach((slide, index) => {
            if (index >= currentIndex && index < currentIndex + slidesToShow) {
                slide.classList.add('active');
            } else {
                slide.classList.remove('active');
            }
        });
        
        // Update dots
        const activeDotIndex = Math.min(Math.floor(currentIndex / slidesToShow), dots.length - 1);
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === activeDotIndex);
        });
    }
    
    // Navigate to previous slide group
    function navigatePrev() {
        // Move by the number of visible slides
        if (currentIndex > 0) {
            currentIndex = Math.max(currentIndex - slidesToShow, 0);
        } else {
            // Loop to the end
            currentIndex = Math.max(totalSlides - slidesToShow, 0);
        }
        updateCarousel();
    }
    
    // Navigate to next slide group
    function navigateNext() {
        // Move by the number of visible slides
        if (currentIndex < totalSlides - slidesToShow) {
            currentIndex = Math.min(currentIndex + slidesToShow, totalSlides - slidesToShow);
        } else {
            // Loop to the beginning
            currentIndex = 0;
        }
        updateCarousel();
    }
    
    // Navigate to specific slide group by dot index
    function navigateToGroup(dotIndex) {
        currentIndex = dotIndex * slidesToShow;
        
        // Make sure we don't exceed the limit
        if (currentIndex > totalSlides - slidesToShow) {
            currentIndex = totalSlides - slidesToShow;
        }
        
        updateCarousel();
    }
    
    // Auto-play functionality
    let autoPlayInterval = setInterval(navigateNext, 4000);
    
    // Pause auto-play on hover
    carouselSlides.addEventListener('mouseenter', () => {
        clearInterval(autoPlayInterval);
    });
    
    // Resume auto-play after hover
    carouselSlides.addEventListener('mouseleave', () => {
        autoPlayInterval = setInterval(navigateNext, 4000);
    });
    
    // Add touch support for mobile
    let touchStartX = 0;
    let touchEndX = 0;
    
    carouselSlides.addEventListener('touchstart', e => {
        touchStartX = e.changedTouches[0].screenX;
    }, {passive: true});
    
    carouselSlides.addEventListener('touchend', e => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    }, {passive: true});
    
    function handleSwipe() {
        const swipeThreshold = 50;
        if (touchStartX - touchEndX > swipeThreshold) {
            // Swipe left
            navigateNext();
        } else if (touchEndX - touchStartX > swipeThreshold) {
            // Swipe right
            navigatePrev();
        }
    }
});