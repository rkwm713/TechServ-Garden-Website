/**
 * Weather API Service
 * Uses OpenWeatherMap API for more reliable data access with proper error handling
 * and caching mechanisms.
 */

// Cache expiration in milliseconds (30 minutes)
const CACHE_EXPIRATION = 30 * 60 * 1000;

// Initialize cache structure
let weatherCache = {
  current: null,
  forecast: null,
  lastUpdated: null
};

// Try to load previously saved cache from localStorage
try {
  const savedCache = localStorage.getItem('weatherCache');
  if (savedCache) {
    weatherCache = JSON.parse(savedCache);
  }
} catch (error) {
  console.error('Failed to load weather cache:', error);
}

/**
 * Get weather data for the garden location
 * @param {Object} options Options for the API request
 * @param {boolean} options.forceRefresh Force refresh instead of using cache
 * @returns {Promise<Object>} Weather data
 */
export async function getWeatherData(options = {}) {
  const { forceRefresh = false } = options;
  
  // Check if cache is valid and return if it is
  const now = Date.now();
  if (!forceRefresh && 
      weatherCache.lastUpdated && 
      weatherCache.current && 
      (now - weatherCache.lastUpdated < CACHE_EXPIRATION)) {
    console.log('Using cached weather data');
    return {
      current: weatherCache.current,
      forecast: weatherCache.forecast
    };
  }
  
  try {
    // Garden coordinates (Tyler, TX)
    const lat = 32.3513;
    const lon = -95.3011;
    
    // Use environment variables for API key
    const apiKey = import.meta.env.VITE_WEATHER_API_KEY;
    
    if (!apiKey) {
      throw new Error('Weather API key not found. Please set VITE_WEATHER_API_KEY in your environment variables.');
    }
    
    // Fetch current weather and forecast in parallel for efficiency
    const [currentResponse, forecastResponse] = await Promise.all([
      fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=imperial&appid=${apiKey}`),
      fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=imperial&appid=${apiKey}`)
    ]);
    
    // Check responses
    if (!currentResponse.ok) {
      throw new Error(`Failed to fetch current weather: ${currentResponse.status} ${currentResponse.statusText}`);
    }
    
    if (!forecastResponse.ok) {
      throw new Error(`Failed to fetch forecast: ${forecastResponse.status} ${forecastResponse.statusText}`);
    }
    
    // Parse responses
    const currentData = await currentResponse.json();
    const forecastData = await forecastResponse.json();
    
    // Format data
    const formattedCurrent = formatCurrentWeather(currentData);
    const formattedForecast = formatForecastData(forecastData);
    
    // Update cache
    weatherCache = {
      current: formattedCurrent,
      forecast: formattedForecast,
      lastUpdated: now
    };
    
    // Save to localStorage
    try {
      localStorage.setItem('weatherCache', JSON.stringify(weatherCache));
    } catch (error) {
      console.error('Failed to save weather cache:', error);
    }
    
    return {
      current: formattedCurrent,
      forecast: formattedForecast
    };
  } catch (error) {
    console.error('Weather API error:', error);
    
    // If we have cached data, return it as fallback
    if (weatherCache.current) {
      console.log('Using cached weather data as fallback after error');
      return {
        current: weatherCache.current,
        forecast: weatherCache.forecast,
        error: error.message
      };
    }
    
    // If no cache available, generate fallback data
    return {
      current: generateFallbackWeatherData().current,
      forecast: generateFallbackWeatherData().forecast,
      error: error.message
    };
  }
}

/**
 * Format current weather data
 * @param {Object} data Raw API response
 * @returns {Object} Formatted weather data
 */
function formatCurrentWeather(data) {
  if (!data || !data.main) {
    throw new Error('Invalid weather data format');
  }
  
  return {
    temperature: Math.round(data.main.temp),
    condition: data.weather[0].main,
    description: data.weather[0].description,
    humidity: data.main.humidity,
    windSpeed: Math.round(data.wind.speed),
    iconCode: data.weather[0].icon,
    location: {
      name: data.name,
      country: data.sys.country
    },
    timestamp: new Date(data.dt * 1000).toISOString()
  };
}

/**
 * Format forecast data
 * @param {Object} data Raw API response
 * @returns {Array} Formatted forecast data
 */
function formatForecastData(data) {
  if (!data || !data.list || !Array.isArray(data.list)) {
    throw new Error('Invalid forecast data format');
  }
  
  // Process 5-day forecast - group by day
  const dailyForecasts = {};
  
  data.list.forEach(item => {
    const date = new Date(item.dt * 1000);
    const day = date.toISOString().split('T')[0]; // YYYY-MM-DD
    
    if (!dailyForecasts[day]) {
      dailyForecasts[day] = {
        day: formatDay(date),
        date: day,
        temps: [],
        conditions: [],
        icons: []
      };
    }
    
    dailyForecasts[day].temps.push(item.main.temp);
    dailyForecasts[day].conditions.push(item.weather[0].main);
    dailyForecasts[day].icons.push(item.weather[0].icon);
  });
  
  // Create daily summaries
  return Object.values(dailyForecasts).map(day => {
    // Get the most common condition and icon for the day
    const conditionCounts = {};
    day.conditions.forEach(condition => {
      conditionCounts[condition] = (conditionCounts[condition] || 0) + 1;
    });
    
    const iconCounts = {};
    day.icons.forEach(icon => {
      iconCounts[icon] = (iconCounts[icon] || 0) + 1;
    });
    
    const mainCondition = Object.entries(conditionCounts)
      .sort((a, b) => b[1] - a[1])[0][0];
      
    const mainIcon = Object.entries(iconCounts)
      .sort((a, b) => b[1] - a[1])[0][0];
    
    // Get average high temp
    const avgTemp = Math.round(day.temps.reduce((sum, temp) => sum + temp, 0) / day.temps.length);
    
    return {
      day: day.day,
      date: day.date,
      temperature: avgTemp,
      condition: mainCondition,
      iconCode: mainIcon
    };
  }).slice(0, 5); // Return only 5 days
}

/**
 * Format day name
 * @param {Date} date Date to format
 * @returns {string} Formatted day name
 */
function formatDay(date) {
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  return days[date.getDay()];
}

/**
 * Get icon class based on OpenWeatherMap icon code
 * @param {string} iconCode OpenWeatherMap icon code
 * @returns {string} Font Awesome icon class
 */
export function getWeatherIconClass(iconCode) {
  if (!iconCode) return 'fas fa-cloud';
  
  // Map OpenWeatherMap icon codes to Font Awesome classes
  const iconMap = {
    '01d': 'fas fa-sun', // clear sky day
    '01n': 'fas fa-moon', // clear sky night
    '02d': 'fas fa-cloud-sun', // few clouds day
    '02n': 'fas fa-cloud-moon', // few clouds night
    '03d': 'fas fa-cloud', // scattered clouds day
    '03n': 'fas fa-cloud', // scattered clouds night
    '04d': 'fas fa-cloud', // broken clouds day
    '04n': 'fas fa-cloud', // broken clouds night
    '09d': 'fas fa-cloud-showers-heavy', // shower rain day
    '09n': 'fas fa-cloud-showers-heavy', // shower rain night
    '10d': 'fas fa-cloud-rain', // rain day
    '10n': 'fas fa-cloud-rain', // rain night
    '11d': 'fas fa-bolt', // thunderstorm day
    '11n': 'fas fa-bolt', // thunderstorm night
    '13d': 'fas fa-snowflake', // snow day
    '13n': 'fas fa-snowflake', // snow night
    '50d': 'fas fa-smog', // mist day
    '50n': 'fas fa-smog' // mist night
  };
  
  return iconMap[iconCode] || 'fas fa-cloud';
}

/**
 * Generate garden advice based on weather conditions
 * @param {Object} currentWeather Current weather data
 * @returns {string} Garden advice
 */
export function getGardenAdvice(currentWeather) {
  if (!currentWeather) {
    return 'Weather data unavailable. Check back later for garden advice.';
  }
  
  const temp = currentWeather.temperature;
  const condition = (currentWeather.condition || '').toLowerCase();
  
  // Temperature-based advice
  if (temp > 85) {
    return 'High temperatures today! Make sure to water plants thoroughly and provide shade for sensitive crops.';
  } else if (temp < 45) {
    return 'Cold temperatures expected. Consider covering sensitive plants or bringing potted plants indoors.';
  }
  
  // Condition-based advice
  if (condition.includes('rain') || condition.includes('drizzle')) {
    return 'Rain in the forecast! Hold off on watering and consider postponing any planting until drier conditions.';
  } else if (condition.includes('thunderstorm')) {
    return 'Thunderstorms expected! Secure any loose garden structures and postpone garden activities until the weather clears.';
  } else if (condition.includes('snow') || condition.includes('sleet')) {
    return 'Freezing precipitation expected! Protect sensitive plants with covers and avoid walking on frozen garden beds.';
  } else if (condition.includes('fog') || condition.includes('mist')) {
    return 'Foggy conditions can increase disease risk. Avoid working with wet plants and ensure good air circulation.';
  } else if (condition.includes('clear') || condition.includes('sunny')) {
    return 'Perfect day for gardening! Great time for planting, weeding, or harvesting.';
  } else if (condition.includes('clouds')) {
    return 'Good conditions for gardening. A mix of sun and clouds provides ideal conditions for most garden tasks.';
  }
  
  // Default advice
  return 'Moderate weather conditions. A good day for general garden maintenance.';
}

/**
 * Generate fallback weather data when API is unavailable
 * @returns {Object} Fallback weather data
 */
function generateFallbackWeatherData() {
  // Use date-based algorithm to ensure consistent fallback data for the same day
  const now = new Date();
  const day = now.getDate();
  const month = now.getMonth();
  
  // Seasonal base temperature
  let baseTemp;
  if (month >= 5 && month <= 8) { // Summer
    baseTemp = 82;
  } else if (month >= 9 && month <= 10) { // Fall
    baseTemp = 68;
  } else if (month >= 11 || month <= 1) { // Winter
    baseTemp = 52;
  } else { // Spring
    baseTemp = 72;
  }
  
  // Daily variation based on date
  const tempVariation = (day % 10) - 5;
  const currentTemp = baseTemp + tempVariation;
  
  // Consistent condition based on day of month
  let currentCondition;
  if (day % 5 === 0) {
    currentCondition = 'Rain';
  } else if (day % 4 === 0) {
    currentCondition = 'Clouds';
  } else if (day % 3 === 0) {
    currentCondition = 'Partly Cloudy';
  } else {
    currentCondition = 'Clear';
  }
  
  // Generate forecast for the next 5 days
  const forecast = [];
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const currentDayIndex = now.getDay();
  
  for (let i = 0; i < 5; i++) {
    const forecastDate = new Date(now);
    forecastDate.setDate(now.getDate() + i);
    
    const forecastDay = days[(currentDayIndex + i) % 7];
    const forecastTemp = baseTemp + ((day + i) % 10) - 5;
    
    let forecastCondition;
    if ((day + i) % 5 === 0) {
      forecastCondition = 'Rain';
    } else if ((day + i) % 4 === 0) {
      forecastCondition = 'Clouds';
    } else if ((day + i) % 3 === 0) {
      forecastCondition = 'Partly Cloudy';
    } else {
      forecastCondition = 'Clear';
    }
    
    forecast.push({
      day: forecastDay,
      date: forecastDate.toISOString().split('T')[0],
      temperature: forecastTemp,
      condition: forecastCondition,
      iconCode: forecastCondition === 'Clear' ? '01d' : 
                forecastCondition === 'Partly Cloudy' ? '02d' : 
                forecastCondition === 'Clouds' ? '03d' : '10d'
    });
  }
  
  return {
    current: {
      temperature: currentTemp,
      condition: currentCondition,
      description: currentCondition,
      humidity: 65 + (day % 20),
      windSpeed: 5 + (day % 10),
      iconCode: currentCondition === 'Clear' ? '01d' : 
                currentCondition === 'Partly Cloudy' ? '02d' : 
                currentCondition === 'Clouds' ? '03d' : '10d',
      location: {
        name: 'Tyler',
        country: 'US'
      },
      timestamp: new Date().toISOString()
    },
    forecast: forecast
  };
}
