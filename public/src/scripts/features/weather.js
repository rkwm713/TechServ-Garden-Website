/**
 * TechServ Community Garden Website
 * Weather Widget JavaScript file
 */

import { showNotification } from '../utils/helpers.js';

document.addEventListener('DOMContentLoaded', function() {
    // Initialize weather widget
    initWeatherWidget();
});

/**
 * Weather Widget Initialization
 */
function initWeatherWidget() {
    const weatherWidget = document.querySelector('.weather-widget');
    
    if (!weatherWidget) return;
    
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
    
    // Refresh button functionality
    const refreshButton = weatherWidget.querySelector('.weather-refresh');
    
    if (refreshButton) {
        refreshButton.addEventListener('click', function() {
            showNotification('Weather data refreshed', 'info');
            updateWeatherWidget(weatherWidget, mockWeatherData);
        });
    }
}

/**
 * Update Weather Widget with data
 */
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
    
    // Update forecast if it exists
    const forecastContainer = widget.querySelector('.forecast-days');
    
    if (forecastContainer && data.forecast) {
        forecastContainer.innerHTML = '';
        
        data.forecast.forEach(day => {
            const dayElement = document.createElement('div');
            dayElement.className = 'forecast-day';
            
            // Choose icon based on condition
            let icon = 'cloud-sun';
            if (day.condition.toLowerCase().includes('sunny')) icon = 'sun';
            if (day.condition.toLowerCase().includes('rain')) icon = 'cloud-rain';
            if (day.condition.toLowerCase().includes('shower')) icon = 'cloud-sun-rain';
            
            dayElement.innerHTML = `
                <div class="day-name">${day.day}</div>
                <div class="day-condition"><i class="fas fa-${icon}"></i></div>
                <div class="day-temp">
                    <span class="high">${day.high}°</span>
                    <span class="low">${day.low}°</span>
                </div>
            `;
            
            forecastContainer.appendChild(dayElement);
        });
    }
}

// Export functions for use in other modules
export {
    initWeatherWidget,
    updateWeatherWidget
};
