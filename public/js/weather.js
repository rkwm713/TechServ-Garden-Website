/**
 * TechServ Community Garden Website
 * Weather Widget JavaScript File
 * 
 * This file integrates with the NWS Weather API service to display
 * real-time weather data for the garden location.
 */

import { getGardenWeather, getGardenAdvice } from '../src/firebase/services/weather.js';

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
        const weatherData = await getGardenWeather();
        
        if (!weatherData || !weatherData.currentConditions) {
            throw new Error('Invalid weather data received');
        }
        
        // Format the data for the widget
        const formattedData = {
            current: {
                condition: weatherData.currentConditions.condition,
                temperature: weatherData.currentConditions.temperatureValue,
                humidity: weatherData.currentConditions.humidityValue,
                windSpeed: weatherData.currentConditions.windSpeedValue
            },
            forecast: weatherData.forecast.slice(0, 3).map(day => ({
                day: day.name.slice(0, 3), // Convert "Monday" to "Mon", etc.
                condition: day.condition,
                temperature: day.temperatureValue
            }))
        };
        
        // Update the widget with the formatted data
        updateWeatherWidget(formattedData);
        
        return weatherData;
    } catch (error) {
        console.error('Failed to fetch weather data:', error);
        throw error;
    }
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
        
        if (weatherIcon) weatherIcon.className = getWeatherIconClass(data.current.condition);
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
            forecastTitle.textContent = 'Forecast';
        }
        
        if (forecastDays) {
            // Clear previous forecast
            forecastDays.innerHTML = '';
            
            // Add new forecast days
            data.forecast.forEach(day => {
                const dayElement = document.createElement('div');
                dayElement.className = 'forecast-day';
                
                dayElement.innerHTML = `
                    <div class="day-name">${day.day}</div>
                    <div class="day-icon"><i class="${getWeatherIconClass(day.condition)}"></i></div>
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
            // Use the imported getGardenAdvice function from weather service if available
            try {
                advice.textContent = getGardenAdvice(data.current);
            } catch (error) {
                // Fallback to local function if imported one isn't available
                advice.textContent = getLocalGardenAdvice(data.current);
            }
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

/**
 * Get the appropriate Font Awesome icon class for a weather condition
 * @param {string} condition - Weather condition
 * @returns {string} - Font Awesome icon class
 */
function getWeatherIconClass(condition) {
    if (!condition) return 'fas fa-cloud';
    
    const conditionLower = condition.toLowerCase();
    
    // Use the same mapping as our weather service for consistency
    // Main weather condition checks
    if (conditionLower.includes('thunderstorm')) return 'fas fa-bolt';
    if (conditionLower.includes('lightning')) return 'fas fa-bolt';
    if (conditionLower.includes('rain') && conditionLower.includes('snow')) return 'fas fa-cloud-rain';
    if (conditionLower.includes('rain') && conditionLower.includes('ice')) return 'fas fa-cloud-rain';
    if (conditionLower.includes('freezing') && conditionLower.includes('rain')) return 'fas fa-cloud-rain';
    if (conditionLower.includes('sleet')) return 'fas fa-cloud-rain';
    if (conditionLower.includes('showers')) return 'fas fa-cloud-showers-heavy';
    if (conditionLower.includes('rain')) return 'fas fa-cloud-rain';
    if (conditionLower.includes('drizzle')) return 'fas fa-cloud-rain';
    if (conditionLower.includes('snow')) return 'fas fa-snowflake';
    if (conditionLower.includes('blizzard')) return 'fas fa-snowflake';
    if (conditionLower.includes('ice')) return 'fas fa-icicles';
    if (conditionLower.includes('hail')) return 'fas fa-cloud-meatball';
    if (conditionLower.includes('fog')) return 'fas fa-smog';
    if (conditionLower.includes('haze')) return 'fas fa-smog';
    if (conditionLower.includes('dust')) return 'fas fa-smog';
    if (conditionLower.includes('smoke')) return 'fas fa-smog';
    
    // Clear and sunny conditions
    if (conditionLower.includes('clear')) {
        return conditionLower.includes('night') ? 'fas fa-moon' : 'fas fa-sun';
    }
    if (conditionLower.includes('sunny')) return 'fas fa-sun';
    if (conditionLower.includes('fair')) {
        return conditionLower.includes('night') ? 'fas fa-moon' : 'fas fa-sun';
    }
    
    // Cloudy conditions
    if (conditionLower.includes('partly') && conditionLower.includes('cloudy')) {
        return conditionLower.includes('night') ? 'fas fa-cloud-moon' : 'fas fa-cloud-sun';
    }
    if (conditionLower.includes('mostly') && conditionLower.includes('cloudy')) return 'fas fa-cloud';
    if (conditionLower.includes('cloudy')) return 'fas fa-cloud';
    if (conditionLower.includes('overcast')) return 'fas fa-cloud';
    
    // Default case
    return 'fas fa-cloud';
}

/**
 * Local fallback for garden advice if the imported function isn't available
 * @param {Object} current - Current weather data
 * @returns {string} - Garden advice
 */
function getLocalGardenAdvice(current) {
    if (!current) return 'Weather data unavailable. Check back later for garden advice.';
    
    const condition = (current.condition || '').toLowerCase();
    const temp = current.temperature;
    
    if (temp > 85) {
        return 'High temperatures today! Make sure to water plants thoroughly and provide shade for sensitive crops.';
    } else if (temp < 45) {
        return 'Cold temperatures expected. Consider covering sensitive plants or bringing potted plants indoors.';
    }
    
    if (condition.includes('rain') || condition.includes('thunderstorm')) {
        return 'Rain in the forecast! Hold off on watering and consider postponing any planting until drier conditions.';
    } else if (condition.includes('sunny') || condition.includes('partly')) {
        return 'Perfect day for gardening! Great time for planting, weeding, or harvesting.';
    } else if (condition.includes('windy')) {
        return 'Windy conditions today. Secure any loose structures and consider waiting to apply fertilizers or pesticides.';
    } else if (condition.includes('foggy')) {
        return 'Foggy conditions can increase disease risk. Avoid working with wet plants and ensure good air circulation.';
    }
    
    return 'Moderate weather conditions. A good day for general garden maintenance.';
}
