/**
 * TechServ Community Garden Website
 * Weather Widget JavaScript File
 * 
 * This file integrates with the OpenWeatherMap API to display
 * real-time weather data for the garden location.
 */

import { getWeatherData, getWeatherIconClass, getGardenAdvice } from '../src/services/weatherAPI.js';

document.addEventListener('DOMContentLoaded', function() {
    initializeWeatherWidget();
});

/**
 * Initialize the weather widget
 */
function initializeWeatherWidget() {
    const weatherContainer = document.getElementById('weather-container');
    if (!weatherContainer) return;
    
    // Show loading state
    showWeatherLoadingState(weatherContainer);
    
    // Fetch real weather data from our NWS API service
    fetchAndUpdateWeather()
        .catch(error => {
            console.error('Error fetching weather data:', error);
            // Fallback to simulated data if the API fails
            updateWeatherWidget(getSimulatedWeatherData());
        });
    
    // Update weather every 30 minutes
    setInterval(function() {
        fetchAndUpdateWeather()
            .catch(error => {
                console.error('Error updating weather data:', error);
                // Don't fallback to simulated data on interval failures
                // to avoid replacing potentially valid cached data
            });
    }, 30 * 60 * 1000);
}

/**
 * Fetch weather data from the API and update the widget
 */
async function fetchAndUpdateWeather() {
    try {
        const weatherData = await getWeatherData();
        
        if (!weatherData || !weatherData.current) {
            throw new Error('Invalid weather data received');
        }
        
        // Format the data for the widget
        const formattedData = {
            location: {
                name: weatherData.current.location?.name || 'East Texas'
            },
            current: {
                condition: weatherData.current.condition,
                temperature: weatherData.current.temperature,
                humidity: weatherData.current.humidity,
                windSpeed: weatherData.current.windSpeed,
                iconCode: weatherData.current.iconCode
            },
            forecast: weatherData.forecast.map(day => ({
                day: day.day.slice(0, 3), // Convert "Monday" to "Mon", etc.
                condition: day.condition,
                temperature: day.temperature,
                iconCode: day.iconCode
            }))
        };
        
        // Update the widget with the formatted data
        updateWeatherWidget(formattedData);
        
        // If there was an error but we got fallback data, show a warning to the user
        if (weatherData.error) {
            console.warn('Using fallback weather data:', weatherData.error);
            showWeatherWarning(weatherContainer, 'Using cached weather data');
        }
        
        return weatherData;
    } catch (error) {
        console.error('Failed to fetch weather data:', error);
        
        // Update with simulated data as fallback
        updateWeatherWidget(getSimulatedWeatherData());
        
        // Show warning to the user
        showWeatherWarning(weatherContainer, 'Unable to fetch weather data');
        
        throw error;
    }
}

/**
 * Show a warning message in the weather widget
 */
function showWeatherWarning(container, message) {
    if (!container) return;
    
    // Check if warning already exists
    let warningElement = container.querySelector('.weather-warning');
    
    if (!warningElement) {
        // Create warning element
        warningElement = document.createElement('div');
        warningElement.className = 'weather-warning';
        container.appendChild(warningElement);
    }
    
    // Set message and make visible
    warningElement.textContent = message;
    warningElement.style.display = 'block';
    
    // Hide after 5 seconds
    setTimeout(() => {
        warningElement.style.display = 'none';
    }, 5000);
}

/**
 * Show loading state in the weather widget
 */
function showWeatherLoadingState(container) {
    const currentWeather = container.querySelector('.current-weather');
    if (currentWeather) {
        const weatherIcon = currentWeather.querySelector('.weather-icon i');
        const temperature = currentWeather.querySelector('.temperature');
        const conditions = currentWeather.querySelector('.conditions');
        
        if (weatherIcon) weatherIcon.className = 'fas fa-sync fa-spin';
        if (temperature) temperature.textContent = '--°F';
        if (conditions) conditions.textContent = 'Loading...';
    }
}

/**
 * Update the weather widget with data
 * @param {Object} data - Weather data
 */
function updateWeatherWidget(data) {
    const weatherContainer = document.getElementById('weather-container');
    if (!weatherContainer) return;
    
    // Update location and date
    const weatherLocation = weatherContainer.querySelector('.weather-location');
    const weatherDate = weatherContainer.querySelector('#weather-date');
    
    if (weatherLocation && data.location) {
        weatherLocation.textContent = data.location.name || 'East Texas';
    }
    
    if (weatherDate) {
        const today = new Date();
        weatherDate.textContent = today.toLocaleDateString('en-US', {
            month: 'long',
            day: 'numeric',
            year: 'numeric'
        });
    }
    
    // Update current weather
    const currentWeather = weatherContainer.querySelector('.current-weather');
    const forecast = weatherContainer.querySelector('.forecast');
    const gardenAdvice = weatherContainer.querySelector('.garden-advice');
    
    // Update current weather
    if (currentWeather) {
        const weatherIcon = currentWeather.querySelector('.weather-icon i');
        const temperature = currentWeather.querySelector('.temperature');
        const conditions = currentWeather.querySelector('.conditions');
        
        if (weatherIcon) {
            // Use the imported icon class function with the API's icon code
            const iconClass = data.current.iconCode ? 
                getWeatherIconClass(data.current.iconCode) : 
                'fas fa-cloud-sun';
            weatherIcon.className = iconClass;
        }
        
        if (temperature) temperature.textContent = `${data.current.temperature}°F`;
        if (conditions) conditions.textContent = data.current.condition;
    }
    
    // Update weather details
    const humidityValue = weatherContainer.querySelector('.humidity-value');
    const windValue = weatherContainer.querySelector('.wind-value');
    
    if (humidityValue && data.current.humidity != null) {
        humidityValue.textContent = `${data.current.humidity}%`;
    }
    
    if (windValue && data.current.windSpeed != null) {
        windValue.textContent = `${data.current.windSpeed} mph`;
    }
    
    // Update forecast
    if (forecast) {
        const forecastTitle = forecast.querySelector('.forecast-title');
        const forecastDays = forecast.querySelector('.forecast-days');
        
        if (forecastTitle) {
            forecastTitle.textContent = '5-Day Forecast';
        }
        
        if (forecastDays) {
            // Clear previous forecast
            forecastDays.innerHTML = '';
            
            // Add new forecast days
            data.forecast.forEach(day => {
                const dayElement = document.createElement('div');
                dayElement.className = 'forecast-day';
                
                // Use the imported icon class function with the API's icon code
                const iconClass = day.iconCode ? 
                    getWeatherIconClass(day.iconCode) : 
                    'fas fa-cloud-sun';
                
                dayElement.innerHTML = `
                    <div class="day-name">${day.day}</div>
                    <div class="day-icon"><i class="${iconClass}"></i></div>
                    <div class="day-temp">${day.temperature}°F</div>
                `;
                
                forecastDays.appendChild(dayElement);
            });
        }
    }
    
    // Update garden advice
    if (gardenAdvice) {
        const advice = gardenAdvice.querySelector('p');
        if (advice) {
            // Use the imported getGardenAdvice function
            advice.textContent = getGardenAdvice(data.current);
        }
    }
}

/**
 * Get simulated weather data (fallback if API fails)
 * @returns {Object} - Simulated weather data
 */
function getSimulatedWeatherData() {
    // Use a consistent set of data for 3258 Earl Campbell Pkwy, Tyler, TX 75701
    // to avoid drastically changing weather display when the API fails
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    
    // Get current day index (0-6)
    const today = new Date().getDay();
    
    // Generate seasonal temperature based on current date
    const now = new Date();
    const month = now.getMonth(); // 0-11
    
    // Base temperature varies by season (higher in summer, lower in winter)
    let baseTemp;
    if (month >= 5 && month <= 8) { // Summer (Jun-Sep)
        baseTemp = 82;
    } else if (month >= 9 && month <= 10) { // Fall (Oct-Nov)
        baseTemp = 68;
    } else if (month >= 11 || month <= 1) { // Winter (Dec-Feb)
        baseTemp = 52;
    } else { // Spring (Mar-May)
        baseTemp = 72;
    }
    
    // Small daily variation (±5°F)
    const dateHash = now.getDate() + now.getMonth() * 31;
    const tempVariation = (dateHash % 10) - 5;
    const currentTemp = baseTemp + tempVariation;
    
    // Define consistent condition based on temperature
    let currentCondition;
    if (currentTemp > 85) {
        currentCondition = 'Sunny';
    } else if (currentTemp < 50) {
        currentCondition = 'Cloudy';
    } else if (currentTemp % 10 < 3) { // Use remainder to determine some days with rain
        currentCondition = 'Light Rain';
    } else if (currentTemp % 10 >= 7) {
        currentCondition = 'Partly Cloudy';
    } else {
        currentCondition = 'Sunny';
    }
    
    // Generate consistent forecast for next 3 days
    const forecast = [];
    for (let i = 1; i <= 3; i++) {
        const dayIndex = (today + i) % 7;
        // Base forecast on day of week for consistency
        let condition;
        const dayTemp = baseTemp + ((dateHash + i) % 10) - 5; // Similar algorithm but offset by day
        
        if (dayIndex % 7 === 0 || dayIndex % 7 === 3) { // Sunday or Wednesday
            condition = 'Partly Cloudy';
        } else if (dayIndex % 7 === 1 || dayIndex % 7 === 5) { // Monday or Friday
            condition = 'Sunny';
        } else if (dayIndex % 7 === 2) { // Tuesday
            condition = 'Light Rain';
        } else {
            condition = 'Cloudy';
        }
        
        forecast.push({
            day: days[dayIndex],
            condition: condition,
            temperature: dayTemp
        });
    }
    
    return {
        location: {
            name: 'Tyler',
            state: 'TX'
        },
        current: {
            condition: currentCondition,
            temperature: currentTemp,
            humidity: 55 + (dateHash % 20), // Consistent but varies by date (55-75%)
            windSpeed: 5 + (dateHash % 10) // Consistent but varies by date (5-15 mph)
        },
        forecast: forecast
    };
}

// We no longer need the getWeatherIconClass and getLocalGardenAdvice functions
// as they have been moved to the weatherAPI.js module and imported
