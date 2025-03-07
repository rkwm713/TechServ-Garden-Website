/**
 * TechServ Community Garden Website
 * Carousel JavaScript File - Optimized with requestAnimationFrame and Lazy Loading
 */

// Initialize carousels when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    initializeCarousel();
    setupIntersectionObserver();
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
    
    // Set up initial state with performance optimizations
    // Use setTimeout to ensure this happens after the main rendering priority tasks
    setTimeout(() => {
        updateCarouselDisplay();
        // Start auto-sliding with requestAnimationFrame only if the carousel is in viewport
        if (isElementInViewport(carouselContainer)) {
            startCarouselAnimation();
        }
    }, 100);
    
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
    
    // Pause auto-sliding when hovering over carousel - use event delegation for better performance
    carouselContainer.addEventListener('mouseenter', () => {
        stopCarouselAnimation();
    }, { passive: true });
    
    carouselContainer.addEventListener('mouseleave', () => {
        if (isElementInViewport(carouselContainer)) {
            startCarouselAnimation();
        }
    }, { passive: true });
    
    // Pause when page is not visible to save resources
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            stopCarouselAnimation();
        } else if (isElementInViewport(carouselContainer)) {
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
 * Set up IntersectionObserver for lazy loading images and managing carousel animations
 */
function setupIntersectionObserver() {
    // Lazy load carousel images
    const lazyImages = document.querySelectorAll('.carousel-slide img');
    
    // Set up observer for images to be lazy-loaded
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                // Replace placeholder src with the actual src
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                }
                // Stop observing this image once loaded
                observer.unobserve(img);
            }
        });
    }, {
        rootMargin: '50px', // Start loading when within 50px of viewport
        threshold: 0.01 // Trigger with just 1% visible
    });
    
    lazyImages.forEach(img => {
        if (img.src && !img.dataset.src) {
            // Store original src in data-src and replace src with a placeholder
            img.dataset.src = img.src;
            img.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1 1"%3E%3C/svg%3E';
        }
        imageObserver.observe(img);
    });
    
    // Manage carousel animations based on visibility
    const carouselContainer = document.querySelector('.carousel-container');
    if (!carouselContainer) return;
    
    const carouselObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                startCarouselAnimation();
            } else {
                stopCarouselAnimation();
            }
        });
    }, {
        threshold: 0.1 // When 10% of the carousel is visible
    });
    
    carouselObserver.observe(carouselContainer);
}

/**
 * Check if an element is in the viewport
 * @param {HTMLElement} element - The element to check
 * @returns {boolean} - Whether the element is in the viewport
 */
function isElementInViewport(element) {
    if (!element) return false;
    
    const rect = element.getBoundingClientRect();
    const windowHeight = window.innerHeight || document.documentElement.clientHeight;
    const windowWidth = window.innerWidth || document.documentElement.clientWidth;
    
    // Consider element in viewport if any part of it is visible
    return (
        rect.bottom > 0 &&
        rect.right > 0 &&
        rect.top < windowHeight &&
        rect.left < windowWidth
    );
}

/**
 * Utility function to throttle function calls
 * @param {Function} func - The function to throttle
 * @param {number} limit - The throttle time limit in ms
 * @returns {Function} - Throttled function
 */
function throttle(func, limit) {
    let lastFunc;
    let lastRan;
    
    return function() {
        const context = this;
        const args = arguments;
        
        if (!lastRan) {
            func.apply(context, args);
            lastRan = Date.now();
        } else {
            clearTimeout(lastFunc);
            lastFunc = setTimeout(() => {
                if (Date.now() - lastRan >= limit) {
                    func.apply(context, args);
                    lastRan = Date.now();
                }
            }, limit - (Date.now() - lastRan));
        }
    };
}

// Optimize resize event handling
window.addEventListener('resize', throttle(() => {
    // Update any carousels that are visible
    const carouselContainers = document.querySelectorAll('.carousel-container');
    carouselContainers.forEach(container => {
        if (isElementInViewport(container)) {
            const carousel = container.closest('.photo-carousel');
            if (carousel) {
                // Refresh the carousel layout (if needed)
                const event = new CustomEvent('carouselResize');
                carousel.dispatchEvent(event);
            }
        }
    });
}, 200), { passive: true });
