/**
 * TechServ Community Garden Website
 * Weather Widget JavaScript File
 */

document.addEventListener('DOMContentLoaded', function() {
    initializeWeatherWidget();
});

/**
 * Initialize the weather widget
 */
function initializeWeatherWidget() {
    const weatherContainer = document.getElementById('weather-container');
    if (!weatherContainer) return;
    
    // In a real implementation, we would fetch weather data from an API
    // For this demo, we'll use simulated data
    
    // Simulate API call delay
    setTimeout(function() {
        updateWeatherWidget(getSimulatedWeatherData());
    }, 1000);
    
    // Update weather every 30 minutes
    setInterval(function() {
        updateWeatherWidget(getSimulatedWeatherData());
    }, 30 * 60 * 1000);
}

/**
 * Update the weather widget with data
 * @param {Object} data - Weather data
 */
function updateWeatherWidget(data) {
    const weatherContainer = document.getElementById('weather-container');
    if (!weatherContainer) return;
    
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
    
    // Update forecast
    if (forecast) {
        const forecastDays = forecast.querySelectorAll('.forecast-day');
        
        forecastDays.forEach((day, index) => {
            if (index < data.forecast.length) {
                const dayName = day.querySelector('.day-name');
                const dayIcon = day.querySelector('.day-icon i');
                const dayTemp = day.querySelector('.day-temp');
                
                if (dayName) dayName.textContent = data.forecast[index].day;
                if (dayIcon) dayIcon.className = getWeatherIconClass(data.forecast[index].condition);
                if (dayTemp) dayTemp.textContent = `${data.forecast[index].temperature}°F`;
            }
        });
    }
    
    // Update garden advice
    if (gardenAdvice) {
        const advice = gardenAdvice.querySelector('p');
        if (advice) advice.textContent = getGardenAdvice(data.current);
    }
}

/**
 * Get simulated weather data
 * @returns {Object} - Simulated weather data
 */
function getSimulatedWeatherData() {
    // For demo purposes, we'll use randomized but realistic data
    const conditions = ['Sunny', 'Partly Cloudy', 'Cloudy', 'Light Rain', 'Rain', 'Thunderstorm', 'Windy', 'Foggy'];
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    
    // Get current day index (0-6)
    const today = new Date().getDay();
    
    // Generate random current weather
    const currentCondition = conditions[Math.floor(Math.random() * conditions.length)];
    const currentTemp = Math.floor(Math.random() * 30) + 50; // 50-80°F
    
    // Generate random forecast for next 3 days
    const forecast = [];
    for (let i = 1; i <= 3; i++) {
        const dayIndex = (today + i) % 7;
        const condition = conditions[Math.floor(Math.random() * conditions.length)];
        const temp = Math.floor(Math.random() * 30) + 50; // 50-80°F
        
        forecast.push({
            day: days[dayIndex],
            condition: condition,
            temperature: temp
        });
    }
    
    return {
        current: {
            condition: currentCondition,
            temperature: currentTemp,
            humidity: Math.floor(Math.random() * 50) + 30, // 30-80%
            windSpeed: Math.floor(Math.random() * 15) + 5 // 5-20 mph
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
    switch (condition.toLowerCase()) {
        case 'sunny':
            return 'fas fa-sun';
        case 'partly cloudy':
            return 'fas fa-cloud-sun';
        case 'cloudy':
            return 'fas fa-cloud';
        case 'light rain':
            return 'fas fa-cloud-rain';
        case 'rain':
            return 'fas fa-cloud-showers-heavy';
        case 'thunderstorm':
            return 'fas fa-bolt';
        case 'windy':
            return 'fas fa-wind';
        case 'foggy':
            return 'fas fa-smog';
        default:
            return 'fas fa-cloud';
    }
}

/**
 * Get garden advice based on current weather
 * @param {Object} current - Current weather data
 * @returns {string} - Garden advice
 */
function getGardenAdvice(current) {
    const condition = current.condition.toLowerCase();
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
