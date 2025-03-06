/**
 * TechServ Community Garden Website
 * Carousel JavaScript File
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
    
    const slides = carousel.querySelectorAll('.carousel-slide');
    const prevButton = document.getElementById('carousel-prev');
    const nextButton = document.getElementById('carousel-next');
    const indicators = document.getElementById('carousel-indicators');
    const indicatorButtons = indicators ? indicators.querySelectorAll('.indicator') : [];
    
    let currentSlide = 0;
    let slideInterval;
    const intervalTime = 5000; // 5 seconds between auto-slides
    
    // Set up initial state
    updateCarousel();
    
    // Start auto-sliding
    startSlideInterval();
    
    // Add event listeners
    if (prevButton) {
        prevButton.addEventListener('click', function() {
            goToPrevSlide();
            resetSlideInterval();
        });
    }
    
    if (nextButton) {
        nextButton.addEventListener('click', function() {
            goToNextSlide();
            resetSlideInterval();
        });
    }
    
    // Add indicator button listeners
    if (indicatorButtons.length > 0) {
        indicatorButtons.forEach((button, index) => {
            button.addEventListener('click', function() {
                currentSlide = index;
                updateCarousel();
                resetSlideInterval();
            });
        });
    }
    
    // Add keyboard navigation
    document.addEventListener('keydown', function(e) {
        // Only handle keyboard events when carousel is in viewport
        if (!isElementInViewport(carousel)) return;
        
        if (e.key === 'ArrowLeft') {
            goToPrevSlide();
            resetSlideInterval();
        } else if (e.key === 'ArrowRight') {
            goToNextSlide();
            resetSlideInterval();
        }
    });
    
    // Add touch support
    let touchStartX = 0;
    let touchEndX = 0;
    
    carousel.addEventListener('touchstart', function(e) {
        touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });
    
    carousel.addEventListener('touchend', function(e) {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    }, { passive: true });
    
    // Pause auto-sliding when hovering over carousel
    carousel.addEventListener('mouseenter', function() {
        clearInterval(slideInterval);
    });
    
    carousel.addEventListener('mouseleave', function() {
        startSlideInterval();
    });
    
    /**
     * Update the carousel display
     */
    function updateCarousel() {
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
        
        // Announce slide change for screen readers
        const liveRegion = document.getElementById('carousel-live-region');
        if (liveRegion) {
            const caption = slides[currentSlide].querySelector('.slide-caption');
            liveRegion.textContent = caption ? `Image ${currentSlide + 1} of ${slides.length}: ${caption.textContent}` : 
                                              `Image ${currentSlide + 1} of ${slides.length}`;
        }
    }
    
    /**
     * Go to the next slide
     */
    function goToNextSlide() {
        currentSlide = (currentSlide + 1) % slides.length;
        updateCarousel();
    }
    
    /**
     * Go to the previous slide
     */
    function goToPrevSlide() {
        currentSlide = (currentSlide - 1 + slides.length) % slides.length;
        updateCarousel();
    }
    
    /**
     * Start the auto-slide interval
     */
    function startSlideInterval() {
        slideInterval = setInterval(function() {
            goToNextSlide();
        }, intervalTime);
    }
    
    /**
     * Reset the auto-slide interval
     */
    function resetSlideInterval() {
        clearInterval(slideInterval);
        startSlideInterval();
    }
    
    /**
     * Handle swipe gestures
     */
    function handleSwipe() {
        const swipeThreshold = 50;
        
        if (touchEndX < touchStartX - swipeThreshold) {
            // Swipe left, go to next slide
            goToNextSlide();
            resetSlideInterval();
        } else if (touchEndX > touchStartX + swipeThreshold) {
            // Swipe right, go to previous slide
            goToPrevSlide();
            resetSlideInterval();
        }
    }
    
    // Add a live region for screen readers
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
