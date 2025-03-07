/**
 * TechServ Community Garden Website
 * Weather Widget Component
 * 
 * Renders weather data from the weather API
 */

import { getWeatherData, getWeatherIconClass, getGardenAdvice } from './api.js';

/**
 * Initialize the weather widget
 */
export function initializeWeatherWidget() {
  const weatherContainer = document.getElementById('weather-container');
  if (!weatherContainer) return;
  
  // Show loading state
  showWeatherLoadingState(weatherContainer);
  
  // Fetch weather data
  fetchAndUpdateWeather(weatherContainer)
    .catch(error => {
      console.error('Error fetching weather data:', error);
      showWeatherError(weatherContainer, 'Unable to fetch weather data');
    });
  
  // Update weather every 30 minutes
  setInterval(() => {
    fetchAndUpdateWeather(weatherContainer)
      .catch(error => {
        console.error('Error updating weather data:', error);
        // Don't show error on interval failures to avoid disrupting the UI
      });
  }, 30 * 60 * 1000);
}

/**
 * Fetch weather data and update the widget
 * @param {HTMLElement} container - The weather widget container
 * @returns {Promise} - Promise that resolves when weather is updated
 */
async function fetchAndUpdateWeather(container) {
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
    updateWeatherWidget(container, formattedData);
    
    // If there was an error but we got fallback data, show a warning to the user
    if (weatherData.error) {
      console.warn('Using fallback weather data:', weatherData.error);
      showWeatherWarning(container, 'Using cached weather data');
    }
    
    return weatherData;
  } catch (error) {
    console.error('Failed to fetch weather data:', error);
    throw error;
  }
}

/**
 * Show loading state in the weather widget
 * @param {HTMLElement} container - The weather widget container
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
 * Show error state in the weather widget
 * @param {HTMLElement} container - The weather widget container
 * @param {string} message - Error message to display
 */
function showWeatherError(container, message) {
  // Update icon to error state
  const weatherIcon = container.querySelector('.weather-icon i');
  if (weatherIcon) weatherIcon.className = 'fas fa-exclamation-triangle';
  
  // Show error message
  showWeatherWarning(container, message);
}

/**
 * Show a warning message in the weather widget
 * @param {HTMLElement} container - The weather widget container
 * @param {string} message - Warning message to display
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
 * Update the weather widget with data
 * @param {HTMLElement} container - The weather widget container
 * @param {Object} data - Weather data
 */
function updateWeatherWidget(container, data) {
  if (!container) return;
  
  // Update location and date
  const weatherLocation = container.querySelector('.weather-location');
  const weatherDate = container.querySelector('#weather-date');
  
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
  const currentWeather = container.querySelector('.current-weather');
  const forecast = container.querySelector('.forecast');
  const gardenAdvice = container.querySelector('.garden-advice');
  
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
  const humidityValue = container.querySelector('.humidity-value');
  const windValue = container.querySelector('.wind-value');
  
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
 * Add CSS styles for the weather widget warning
 */
function addWeatherWidgetStyles() {
  // Only add styles if they don't already exist
  if (!document.getElementById('weather-widget-styles')) {
    const styleElement = document.createElement('style');
    styleElement.id = 'weather-widget-styles';
    styleElement.textContent = `
      .weather-warning {
        background-color: #fff3cd;
        color: #856404;
        padding: 0.5rem;
        margin-top: 0.5rem;
        border-radius: 0.25rem;
        font-size: 0.875rem;
        text-align: center;
        display: none;
      }
    `;
    document.head.appendChild(styleElement);
  }
}

// Add weather widget styles when the module is imported
addWeatherWidgetStyles();
