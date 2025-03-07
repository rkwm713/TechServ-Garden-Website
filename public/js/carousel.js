/**
 * TechServ Community Garden Website
 * Carousel JavaScript File - Optimized with requestAnimationFrame
 */

document.addEventListener('DOMContentLoaded', function() {
    initializeCarousel();
});

/**
 * Initialize the photo carousel
 */
function initializeCarousel() {
    const carousel = document.getElementById('photo-carousel');
    if (!carousel) return;
    
    const carouselContainer = carousel.querySelector('.carousel-container');
    const slides = carousel.querySelectorAll('.carousel-slide');
    const prevButton = document.getElementById('carousel-prev');
    const nextButton = document.getElementById('carousel-next');
    const indicators = document.getElementById('carousel-indicators');
    const indicatorButtons = indicators ? indicators.querySelectorAll('.indicator') : [];
    
    let currentSlide = 0;
    let animationFrameId = null;
    let lastTransitionTime = 0;
    const intervalDuration = 5000; // 5 seconds between auto-slides
    
    // Set up initial state
    updateCarouselDisplay();
    
    // Start auto-sliding with requestAnimationFrame
    startCarouselAnimation();
    
    // Add event listeners
    if (prevButton) {
        prevButton.addEventListener('click', function(e) {
            e.preventDefault();
            goToPrevSlide();
            resetAnimation();
        });
    }
    
    if (nextButton) {
        nextButton.addEventListener('click', function(e) {
            e.preventDefault();
            goToNextSlide();
            resetAnimation();
        });
    }
    
    // Add indicator button listeners
    if (indicatorButtons.length > 0) {
        indicatorButtons.forEach((button, index) => {
            button.addEventListener('click', function(e) {
                e.preventDefault();
                currentSlide = index;
                updateCarouselDisplay();
                resetAnimation();
            });
        });
    }
    
    // Add keyboard navigation
    document.addEventListener('keydown', function(e) {
        // Only handle keyboard events when carousel is in viewport
        if (!isElementInViewport(carouselContainer)) return;
        
        if (e.key === 'ArrowLeft') {
            goToPrevSlide();
            resetAnimation();
        } else if (e.key === 'ArrowRight') {
            goToNextSlide();
            resetAnimation();
        }
    });
    
    // Add touch support
    let touchStartX = 0;
    let touchEndX = 0;
    
    carouselContainer.addEventListener('touchstart', function(e) {
        touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });
    
    carouselContainer.addEventListener('touchend', function(e) {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    }, { passive: true });
    
    // Pause auto-sliding when hovering over carousel
    carouselContainer.addEventListener('mouseenter', function() {
        stopCarouselAnimation();
    });
    
    carouselContainer.addEventListener('mouseleave', function() {
        startCarouselAnimation();
    });
    
    // Pause when page is not visible
    document.addEventListener('visibilitychange', function() {
        if (document.hidden) {
            stopCarouselAnimation();
        } else {
            startCarouselAnimation();
        }
    });
    
    /**
     * Update the carousel display
     */
    function updateCarouselDisplay() {
        // Hide all slides
        slides.forEach((slide, index) => {
            slide.classList.remove('active');
            if (indicatorButtons[index]) {
                indicatorButtons[index].classList.remove('active');
            }
        });
        
        // Show current slide
        slides[currentSlide].classList.add('active');
        if (indicatorButtons[currentSlide]) {
            indicatorButtons[currentSlide].classList.add('active');
        }
        
        // Update slides container position (if using transform for animation)
        // const slideWidth = slides[0].offsetWidth;
        // slidesContainer.style.transform = `translateX(-${currentSlide * slideWidth}px)`;
        
        // Announce slide change for screen readers
        updateAriaLiveRegion();
    }
    
    /**
     * Update ARIA live region for accessibility
     */
    function updateAriaLiveRegion() {
        const liveRegion = document.getElementById('carousel-live-region');
        if (liveRegion) {
            const caption = slides[currentSlide].querySelector('.slide-caption');
            liveRegion.textContent = caption ? 
                `Image ${currentSlide + 1} of ${slides.length}: ${caption.textContent}` : 
                `Image ${currentSlide + 1} of ${slides.length}`;
        }
    }
    
    /**
     * Go to the next slide
     */
    function goToNextSlide() {
        currentSlide = (currentSlide + 1) % slides.length;
        updateCarouselDisplay();
    }
    
    /**
     * Go to the previous slide
     */
    function goToPrevSlide() {
        currentSlide = (currentSlide - 1 + slides.length) % slides.length;
        updateCarouselDisplay();
    }
    
    /**
     * Start the carousel animation using requestAnimationFrame
     */
    function startCarouselAnimation() {
        if (animationFrameId) return; // Don't start if already running
        
        lastTransitionTime = performance.now();
        animateCarousel();
    }
    
    /**
     * Stop the carousel animation
     */
    function stopCarouselAnimation() {
        if (animationFrameId) {
            cancelAnimationFrame(animationFrameId);
            animationFrameId = null;
        }
    }
    
    /**
     * Reset the animation timing
     */
    function resetAnimation() {
        lastTransitionTime = performance.now();
    }
    
    /**
     * Animate the carousel using requestAnimationFrame
     */
    function animateCarousel(timestamp) {
        if (!timestamp) timestamp = performance.now();
        
        const elapsed = timestamp - lastTransitionTime;
        
        if (elapsed >= intervalDuration) {
            goToNextSlide();
            lastTransitionTime = timestamp;
        }
        
        animationFrameId = requestAnimationFrame(animateCarousel);
    }
    
    /**
     * Handle swipe gestures
     */
    function handleSwipe() {
        const swipeThreshold = 50;
        
        if (touchEndX < touchStartX - swipeThreshold) {
            // Swipe left, go to next slide
            goToNextSlide();
            resetAnimation();
        } else if (touchEndX > touchStartX + swipeThreshold) {
            // Swipe right, go to previous slide
            goToPrevSlide();
            resetAnimation();
        }
    }
    
    // Add a live region for screen readers if it doesn't exist
    if (!document.getElementById('carousel-live-region')) {
        const liveRegion = document.createElement('div');
        liveRegion.id = 'carousel-live-region';
        liveRegion.className = 'sr-only';
        liveRegion.setAttribute('aria-live', 'polite');
        liveRegion.setAttribute('aria-atomic', 'true');
        document.body.appendChild(liveRegion);
    }
}

/**
 * Check if an element is in the viewport
 * @param {HTMLElement} element - The element to check
 * @returns {boolean} - Whether the element is in the viewport
 */
function isElementInViewport(element) {
    const rect = element.getBoundingClientRect();
    
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}

/**
 * Utility function to throttle function calls
 * @param {Function} func - The function to throttle
 * @param {number} limit - The throttle time limit in ms
 * @returns {Function} - Throttled function
 */
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}
