/**
 * TechServ Community Garden Website
 * Main JavaScript file for common functionality across all pages
 */

import { showNotification, closeNotification, debounce } from '../utils/helpers.js';

// Expose these utility functions globally for other scripts to use
window.showNotification = showNotification;
window.closeNotification = closeNotification;
window.debounce = debounce;

document.addEventListener('DOMContentLoaded', function() {
    // Initialize mobile menu toggle
    initMobileMenu();
    
    // Initialize tabs functionality
    initTabs();
    
    // Initialize tooltips
    initTooltips();
    
    // Initialize modals
    initModals();
    
    // Initialize weather widget if it exists
    if (document.querySelector('.weather-widget')) {
        initWeatherWidget();
    }
    
    // Initialize search functionality
    initSearch();
    
    // Initialize notification system
    initNotifications();
});

/**
 * Mobile Menu Toggle
 */
function initMobileMenu() {
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const navList = document.querySelector('.nav-list');
    
    if (mobileMenuToggle && navList) {
        mobileMenuToggle.addEventListener('click', function() {
            mobileMenuToggle.classList.toggle('active');
            navList.classList.toggle('active');
            document.body.classList.toggle('menu-open');
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', function(event) {
            if (navList.classList.contains('active') && 
                !event.target.closest('.nav-list') && 
                !event.target.closest('.mobile-menu-toggle')) {
                mobileMenuToggle.classList.remove('active');
                navList.classList.remove('active');
                document.body.classList.remove('menu-open');
            }
        });
    }
}

/**
 * Tabs Functionality
 * Used in multiple pages like garden-planning, knowledge, community, resources
 */
function initTabs() {
    // Get all tab containers
    const tabContainers = [
        { tabs: document.querySelectorAll('.planning-tab'), contents: document.querySelectorAll('.planning-content') },
        { tabs: document.querySelectorAll('.knowledge-tab'), contents: document.querySelectorAll('.knowledge-content') },
        { tabs: document.querySelectorAll('.community-tab'), contents: document.querySelectorAll('.community-content') },
        { tabs: document.querySelectorAll('.resources-tab'), contents: document.querySelectorAll('.resources-content') },
        { tabs: document.querySelectorAll('.season-tab'), contents: document.querySelectorAll('.season-content') }
    ];
    
    tabContainers.forEach(container => {
        if (container.tabs.length > 0 && container.contents.length > 0) {
            container.tabs.forEach((tab, index) => {
                tab.addEventListener('click', function() {
                    // Remove active class from all tabs and contents
                    container.tabs.forEach(t => t.classList.remove('active'));
                    container.contents.forEach(c => c.classList.remove('active'));
                    
                    // Add active class to clicked tab and corresponding content
                    tab.classList.add('active');
                    
                    // Find the corresponding content
                    // If the tabs and contents have the same number of elements, use the index
                    if (container.tabs.length === container.contents.length) {
                        container.contents[index].classList.add('active');
                    } else {
                        // Otherwise, try to match by id
                        const tabId = tab.getAttribute('data-tab');
                        if (tabId) {
                            const content = document.getElementById(tabId);
                            if (content) {
                                content.classList.add('active');
                            }
                        }
                    }
                });
            });
        }
    });
}

/**
 * Tooltips
 */
function initTooltips() {
    const tooltipElements = document.querySelectorAll('[data-tooltip]');
    
    tooltipElements.forEach(element => {
        element.addEventListener('mouseenter', function() {
            const tooltipText = this.getAttribute('data-tooltip');
            
            // Create tooltip element
            const tooltip = document.createElement('div');
            tooltip.className = 'tooltip';
            tooltip.textContent = tooltipText;
            
            // Position the tooltip
            document.body.appendChild(tooltip);
            
            const elementRect = this.getBoundingClientRect();
            const tooltipRect = tooltip.getBoundingClientRect();
            
            tooltip.style.top = (elementRect.top - tooltipRect.height - 10) + 'px';
            tooltip.style.left = (elementRect.left + (elementRect.width / 2) - (tooltipRect.width / 2)) + 'px';
            
            // Add active class for animation
            setTimeout(() => {
                tooltip.classList.add('active');
            }, 10);
            
            // Store tooltip reference
            this.tooltip = tooltip;
        });
        
        element.addEventListener('mouseleave', function() {
            if (this.tooltip) {
                this.tooltip.classList.remove('active');
                
                // Remove tooltip after animation
                setTimeout(() => {
                    if (this.tooltip && this.tooltip.parentNode) {
                        this.tooltip.parentNode.removeChild(this.tooltip);
                        this.tooltip = null;
                    }
                }, 300);
            }
        });
    });
}

/**
 * Modal Functionality
 */
function initModals() {
    // Modal triggers
    const modalTriggers = document.querySelectorAll('[data-modal]');
    
    modalTriggers.forEach(trigger => {
        trigger.addEventListener('click', function() {
            const modalId = this.getAttribute('data-modal');
            const modal = document.getElementById(modalId);
            
            if (modal) {
                openModal(modal);
            }
        });
    });
    
    // Close buttons
    const closeButtons = document.querySelectorAll('.modal-close, .modal-cancel');
    
    closeButtons.forEach(button => {
        button.addEventListener('click', function() {
            const modal = this.closest('.modal');
            if (modal) {
                closeModal(modal);
            }
        });
    });
    
    // Close when clicking outside modal content
    document.addEventListener('click', function(event) {
        if (event.target.classList.contains('modal')) {
            closeModal(event.target);
        }
    });
    
    // Close with Escape key
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape') {
            const openModal = document.querySelector('.modal.active');
            if (openModal) {
                closeModal(openModal);
            }
        }
    });
}

function openModal(modal) {
    modal.classList.add('active');
    document.body.classList.add('modal-open');
    
    // Focus the first input or button
    setTimeout(() => {
        const firstInput = modal.querySelector('input, button');
        if (firstInput) {
            firstInput.focus();
        }
    }, 100);
}

function closeModal(modal) {
    modal.classList.remove('active');
    document.body.classList.remove('modal-open');
}

/**
 * Weather Widget
 */
function initWeatherWidget() {
    const weatherWidget = document.querySelector('.weather-widget');
    
    // In a real implementation, this would fetch data from a weather API
    // For demo purposes, we'll use mock data
    const mockWeatherData = {
        location: 'East Texas',
        temperature: 78,
        condition: 'Partly Cloudy',
        humidity: 65,
        windSpeed: 8,
        forecast: [
            { day: 'Today', high: 78, low: 62, condition: 'Partly Cloudy' },
            { day: 'Tomorrow', high: 82, low: 65, condition: 'Sunny' },
            { day: 'Friday', high: 85, low: 68, condition: 'Sunny' },
            { day: 'Saturday', high: 80, low: 64, condition: 'Scattered Showers' },
            { day: 'Sunday', high: 76, low: 60, condition: 'Partly Cloudy' }
        ]
    };
    
    updateWeatherWidget(weatherWidget, mockWeatherData);
}

function updateWeatherWidget(widget, data) {
    if (!widget) return;
    
    // Update current weather
    const currentTemp = widget.querySelector('.current-temperature');
    const currentCondition = widget.querySelector('.current-condition');
    const humidity = widget.querySelector('.humidity-value');
    const windSpeed = widget.querySelector('.wind-value');
    
    if (currentTemp) currentTemp.textContent = `${data.temperature}°F`;
    if (currentCondition) currentCondition.textContent = data.condition;
    if (humidity) humidity.textContent = `${data.humidity}%`;
    if (windSpeed) windSpeed.textContent = `${data.windSpeed} mph`;
    
    // Update forecast
    const forecastContainer = widget.querySelector('.forecast-days');
    
    if (forecastContainer && data.forecast) {
        forecastContainer.innerHTML = '';
        
        data.forecast.forEach(day => {
            const dayElement = document.createElement('div');
            dayElement.className = 'forecast-day';
            
            dayElement.innerHTML = `
                <div class="day-name">${day.day}</div>
                <div class="day-condition"><i class="fas fa-cloud-sun"></i></div>
                <div class="day-temp">
                    <span class="high">${day.high}°</span>
                    <span class="low">${day.low}°</span>
                </div>
            `;
            
            forecastContainer.appendChild(dayElement);
        });
    }
}

/**
 * Search Functionality
 */
function initSearch() {
    const searchInputs = document.querySelectorAll('.search-input');
    const searchButtons = document.querySelectorAll('.search-button');
    
    searchButtons.forEach((button, index) => {
        button.addEventListener('click', function() {
            const input = searchInputs[index];
            if (input && input.value.trim() !== '') {
                performSearch(input.value.trim());
            }
        });
    });
    
    searchInputs.forEach(input => {
        input.addEventListener('keypress', function(event) {
            if (event.key === 'Enter' && this.value.trim() !== '') {
                performSearch(this.value.trim());
            }
        });
    });
}

function performSearch(query) {
    // In a real implementation, this would search the site content
    // For demo purposes, we'll just log the query
    console.log('Searching for:', query);
    
    // Redirect to a search results page
    // window.location.href = `search-results.html?q=${encodeURIComponent(query)}`;
    
    // For demo, show an alert
    showNotification(`Search functionality would search for: "${query}"`, 'info');
}

/**
 * Notification System
 */
function initNotifications() {
    // Check for notification triggers
    const notificationTriggers = document.querySelectorAll('[data-notification]');
    
    notificationTriggers.forEach(trigger => {
        trigger.addEventListener('click', function() {
            const message = this.getAttribute('data-notification');
            const type = this.getAttribute('data-notification-type') || 'info';
            
            if (message) {
                showNotification(message, type);
            }
        });
    });
}

// Export functions for use in other modules
export {
    initMobileMenu,
    initTabs,
    initTooltips,
    initModals,
    openModal,
    closeModal,
    initWeatherWidget,
    updateWeatherWidget,
    initSearch,
    performSearch,
    initNotifications
};
