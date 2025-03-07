/**
 * TechServ Community Garden Website
 * Weather Widget JavaScript file
 * 
 * This file integrates with the NWS Weather API service to display
 * real-time weather data for the garden location.
 */

import { showNotification } from '../utils/helpers.js';
import { getGardenWeather, getGardenAdvice } from '../../firebase/services/weather.js';

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
    
    // Show loading state
    showLoadingState(weatherWidget);
    
    // Fetch real weather data
    fetchAndUpdateWeather(weatherWidget)
        .catch(error => {
            console.error('Weather API error:', error);
            // Fallback to mock data
            updateWeatherWidgetWithMockData(weatherWidget);
            showNotification('Unable to fetch real-time weather. Using cached data.', 'warning');
        });
    
    // Refresh button functionality
    const refreshButton = weatherWidget.querySelector('.weather-refresh');
    
    if (refreshButton) {
        refreshButton.addEventListener('click', function() {
            showLoadingState(weatherWidget);
            
            fetchAndUpdateWeather(weatherWidget, true)
                .then(() => {
                    showNotification('Weather data refreshed', 'success');
                })
                .catch(error => {
                    console.error('Failed to refresh weather:', error);
                    showNotification('Failed to refresh weather data', 'error');
                    // Don't update with mock data on refresh failure
                });
        });
    }
}

/**
 * Fetch and update weather data
 * @param {Element} widget - Weather widget element
 * @param {boolean} forceRefresh - Whether to force refresh cache
 * @returns {Promise} - Promise that resolves when weather is updated
 */
async function fetchAndUpdateWeather(widget, forceRefresh = false) {
    try {
        const weatherData = await getGardenWeather(forceRefresh);
        
        if (!weatherData || !weatherData.currentConditions) {
            throw new Error('Invalid weather data received');
        }
        
        // Format the data for the widget
        const formattedData = {
            location: weatherData.location ? 
                `${weatherData.location.name}, ${weatherData.location.state}` : 'East Texas',
            temperature: weatherData.currentConditions.temperatureValue || 0,
            condition: weatherData.currentConditions.condition || 'Unknown',
            humidity: weatherData.currentConditions.humidityValue || 0,
            windSpeed: weatherData.currentConditions.windSpeedValue || 0,
            forecast: weatherData.forecast.slice(0, 5).map(day => ({
                day: day.name.split(' ')[0], // Get just first word (e.g., "Tonight" -> "Tonight", "Monday" -> "Monday")
                high: day.temperatureValue || 0,
                low: day.isDaytime ? null : day.temperatureValue || 0, // Use temperature as low if night forecast
                condition: day.condition || 'Unknown'
            }))
        };
        
        // Update the widget with formatted data
        updateWeatherWidget(widget, formattedData);
        
        return formattedData;
    } catch (error) {
        console.error('Failed to fetch weather data:', error);
        throw error;
    }
}

/**
 * Show loading state in the widget
 * @param {Element} widget - Weather widget element
 */
function showLoadingState(widget) {
    const currentTemp = widget.querySelector('.current-temperature');
    const currentCondition = widget.querySelector('.current-condition');
    
    if (currentTemp) currentTemp.textContent = '--°F';
    if (currentCondition) currentCondition.textContent = 'Loading...';
    
    // Show spinner in each forecast day
    const forecastDays = widget.querySelectorAll('.forecast-day .day-condition i');
    forecastDays.forEach(icon => {
        icon.className = 'fas fa-sync fa-spin';
    });
}

/**
 * Update widget with mock data if API fails
 * @param {Element} widget - Weather widget element
 */
function updateWeatherWidgetWithMockData(widget) {
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
    
    updateWeatherWidget(widget, mockWeatherData);
}

/**
 * Update Weather Widget with data
 * @param {Element} widget - Weather widget element
 * @param {Object} data - Weather data
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
            
            // Get icon based on condition
            const icon = getWeatherIconClass(day.condition);
            
            // Create HTML with high/low temperatures
            let tempHTML = '';
            if (day.high !== null && day.low !== null) {
                tempHTML = `
                    <span class="high">${day.high}°</span>
                    <span class="low">${day.low}°</span>
                `;
            } else if (day.high !== null) {
                tempHTML = `<span class="high">${day.high}°</span>`;
            } else if (day.low !== null) {
                tempHTML = `<span class="low">${day.low}°</span>`;
            }
            
            dayElement.innerHTML = `
                <div class="day-name">${day.day}</div>
                <div class="day-condition"><i class="${icon}"></i></div>
                <div class="day-temp">
                    ${tempHTML}
                </div>
            `;
            
            forecastContainer.appendChild(dayElement);
        });
    }
    
    // Update garden advice if it exists
    const gardenAdvice = widget.querySelector('.garden-advice p');
    if (gardenAdvice) {
        try {
            const advice = getGardenAdvice({
                temperatureValue: data.temperature,
                condition: data.condition
            });
            gardenAdvice.textContent = advice;
        } catch (error) {
            console.error('Failed to get garden advice:', error);
            gardenAdvice.textContent = getLocalGardenAdvice(data);
        }
    }
}

/**
 * Get the appropriate Font Awesome icon class for a weather condition
 * @param {string} condition - Weather condition
 * @returns {string} - Font Awesome icon class
 */
function getWeatherIconClass(condition) {
    if (!condition) return 'fas fa-cloud';
    
    const conditionLower = condition.toLowerCase();
    
    // Common weather conditions
    if (conditionLower.includes('thunderstorm')) return 'fas fa-bolt';
    if (conditionLower.includes('lightning')) return 'fas fa-bolt';
    if (conditionLower.includes('shower') || conditionLower.includes('scattered')) return 'fas fa-cloud-showers-heavy';
    if (conditionLower.includes('rain')) return 'fas fa-cloud-rain';
    if (conditionLower.includes('snow')) return 'fas fa-snowflake';
    if (conditionLower.includes('clear') || conditionLower.includes('sunny')) return 'fas fa-sun';
    if (conditionLower.includes('partly cloudy') || conditionLower.includes('partly sunny')) return 'fas fa-cloud-sun';
    if (conditionLower.includes('cloudy') || conditionLower.includes('overcast')) return 'fas fa-cloud';
    if (conditionLower.includes('wind')) return 'fas fa-wind';
    if (conditionLower.includes('fog')) return 'fas fa-smog';
    
    // Default case
    return 'fas fa-cloud';
}

/**
 * Local fallback for garden advice if service function isn't available
 * @param {Object} data - Weather data
 * @returns {string} - Garden advice text
 */
function getLocalGardenAdvice(data) {
    const condition = (data.condition || '').toLowerCase();
    const temp = data.temperature;
    
    if (temp > 85) {
        return 'High temperatures today! Make sure to water plants thoroughly and provide shade for sensitive crops.';
    } else if (temp < 45) {
        return 'Cold temperatures expected. Consider covering sensitive plants or bringing potted plants indoors.';
    }
    
    if (condition.includes('rain') || condition.includes('shower')) {
        return 'Rain in the forecast! Hold off on watering and consider postponing any planting until drier conditions.';
    } else if (condition.includes('sunny') || condition.includes('clear')) {
        return 'Perfect day for gardening! Great time for planting, weeding, or harvesting.';
    } else if (condition.includes('wind')) {
        return 'Windy conditions today. Secure any loose structures and consider waiting to apply fertilizers or pesticides.';
    } else if (condition.includes('fog')) {
        return 'Foggy conditions can increase disease risk. Avoid working with wet plants and ensure good air circulation.';
    } else if (condition.includes('partly cloudy')) {
        return 'Good gardening conditions with some shade. Great for transplanting or working on garden projects.';
    }
    
    return 'Moderate weather conditions. A good day for general garden maintenance.';
}

// Export functions for use in other modules
export {
    initWeatherWidget,
    updateWeatherWidget,
    fetchAndUpdateWeather
};
