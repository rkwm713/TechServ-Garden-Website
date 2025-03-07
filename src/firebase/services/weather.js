/**
 * TechServ Community Garden - Weather Service
 * 
 * This module handles weather data retrieval from the National Weather Service (NWS) API
 * and provides formatted data for the weather widget.
 * 
 * NWS API Documentation: https://www.weather.gov/documentation/services-web-api
 */

// Cache for weather data to avoid excessive API calls
const weatherCache = {
  currentConditions: null,
  forecast: null,
  location: null,
  lastUpdated: null,
  // Cache expiration in milliseconds (30 minutes)
  cacheExpiration: 30 * 60 * 1000
};

// Required headers for NWS API - they require a user-agent with contact info
const API_HEADERS = {
  'User-Agent': '(TechServ Community Garden, garden@techserv.com)',
  'Accept': 'application/geo+json'
};

/**
 * Get coordinates for the TechServ Garden location
 * @returns {Object} with latitude and longitude
 */
export const getGardenCoordinates = () => {
  // Default location for the TechServ Garden in East Texas
  // These should be updated with the actual garden coordinates
  return {
    latitude: 32.3513,  // Example coordinates for Tyler, Texas
    longitude: -95.3011
  };
};

/**
 * Get weather data for a specific location
 * @param {Object} options - Options for weather data
 * @param {number} options.latitude - Latitude
 * @param {number} options.longitude - Longitude
 * @param {boolean} options.forceRefresh - Whether to bypass cache and force refresh
 * @returns {Promise<Object>} - Weather data
 */
export const getWeatherData = async (options = {}) => {
  try {
    const { latitude, longitude } = options.latitude && options.longitude 
      ? options
      : getGardenCoordinates();
    
    const now = new Date().getTime();
    const cacheIsValid = weatherCache.lastUpdated && 
      (now - weatherCache.lastUpdated) < weatherCache.cacheExpiration;
    
    // Return cached data if available and not expired
    if (!options.forceRefresh && cacheIsValid && weatherCache.currentConditions) {
      console.log('Using cached weather data');
      return {
        currentConditions: weatherCache.currentConditions,
        forecast: weatherCache.forecast,
        location: weatherCache.location
      };
    }
    
    // Get location metadata from NWS API - this provides the grid points needed for forecast
    const pointsResponse = await fetch(
      `https://api.weather.gov/points/${latitude},${longitude}`, 
      { headers: API_HEADERS }
    );
    
    if (!pointsResponse.ok) {
      const errorData = await pointsResponse.text();
      throw new Error(`Failed to get location data from NWS API: ${pointsResponse.status} - ${errorData}`);
    }
    
    const pointsData = await pointsResponse.json();
    
    if (!pointsData.properties || !pointsData.properties.gridId) {
      throw new Error('Invalid response from NWS API points endpoint');
    }
    
    // Get office and grid coordinates
    const office = pointsData.properties.gridId;
    const gridX = pointsData.properties.gridX;
    const gridY = pointsData.properties.gridY;
    
    // Get forecast from NWS API using the forecast URL from the points response
    const forecastUrl = pointsData.properties.forecast;
    const forecastResponse = await fetch(forecastUrl, { headers: API_HEADERS });
    
    if (!forecastResponse.ok) {
      const errorData = await forecastResponse.text();
      throw new Error(`Failed to get forecast from NWS API: ${forecastResponse.status} - ${errorData}`);
    }
    
    const forecastData = await forecastResponse.json();
    
    if (!forecastData.properties || !forecastData.properties.periods) {
      throw new Error('Invalid response from NWS API forecast endpoint');
    }
    
    // Find nearest observation station using the observationStations URL from the points response
    const stationsUrl = pointsData.properties.observationStations;
    const stationsResponse = await fetch(stationsUrl, { headers: API_HEADERS });
    
    if (!stationsResponse.ok) {
      const errorData = await stationsResponse.text();
      throw new Error(`Failed to get observation stations from NWS API: ${stationsResponse.status} - ${errorData}`);
    }
    
    const stationsData = await stationsResponse.json();
    
    if (!stationsData.features || !stationsData.features.length) {
      throw new Error('No observation stations found near the specified location');
    }
    
    const nearestStation = stationsData.features[0].properties.stationIdentifier;
    
    // Get latest observations for the nearest station
    const observationsResponse = await fetch(
      `https://api.weather.gov/stations/${nearestStation}/observations/latest`, 
      { headers: API_HEADERS }
    );
    
    if (!observationsResponse.ok) {
      const errorData = await observationsResponse.text();
      throw new Error(`Failed to get observations from NWS API: ${observationsResponse.status} - ${errorData}`);
    }
    
    const observationsData = await observationsResponse.json();
    
    // Format current conditions
    const currentConditions = formatCurrentConditions(observationsData);
    
    // Format forecast
    const forecast = formatForecast(forecastData);
    
    // Format location
    const location = {
      name: pointsData.properties.relativeLocation.properties.city,
      state: pointsData.properties.relativeLocation.properties.state
    };
    
    // Update cache
    weatherCache.currentConditions = currentConditions;
    weatherCache.forecast = forecast;
    weatherCache.location = location;
    weatherCache.lastUpdated = now;
    
    return {
      currentConditions,
      forecast,
      location
    };
  } catch (error) {
    console.error('Error getting weather data:', error);
    
    // If cache is available, return it as fallback
    if (weatherCache.currentConditions) {
      console.log('Using cached weather data as fallback after error');
      return {
        currentConditions: weatherCache.currentConditions,
        forecast: weatherCache.forecast,
        location: weatherCache.location,
        error: error.message
      };
    }
    
    throw error;
  }
};

/**
 * Format current conditions from NWS API response
 * @param {Object} observationsData - NWS API observations response
 * @returns {Object} - Formatted current conditions
 */
const formatCurrentConditions = (observationsData) => {
  const properties = observationsData.properties;
  
  if (!properties) {
    throw new Error('Invalid observations data structure');
  }
  
  // Handle potential null values safely
  // Convert temperature from Celsius to Fahrenheit
  const tempC = properties.temperature?.value;
  const tempF = tempC !== null && tempC !== undefined ? Math.round((tempC * 9/5) + 32) : null;
  
  // Convert wind speed from m/s to mph
  const windSpeedMS = properties.windSpeed?.value;
  const windSpeedMPH = windSpeedMS !== null && windSpeedMS !== undefined ? Math.round(windSpeedMS * 2.237) : null;
  
  // Get relative humidity value safely
  const humidityValue = properties.relativeHumidity?.value;
  const humidityRounded = humidityValue !== null && humidityValue !== undefined ? 
    Math.round(humidityValue) : null;
  
  return {
    temperature: tempF !== null ? `${tempF}°F` : 'N/A',
    temperatureValue: tempF,
    condition: properties.textDescription || 'Unknown',
    humidity: humidityRounded !== null ? `${humidityRounded}%` : 'N/A',
    humidityValue: humidityRounded,
    windSpeed: windSpeedMPH !== null ? `${windSpeedMPH} mph` : 'N/A',
    windSpeedValue: windSpeedMPH,
    iconClass: getWeatherIconClass(properties.textDescription),
    observationTime: properties.timestamp ? new Date(properties.timestamp).toLocaleString() : 'Unknown',
    cloudCover: properties.cloudLayers && properties.cloudLayers.length > 0 ? 
      properties.cloudLayers[0].amount : 'N/A'
  };
};

/**
 * Format forecast from NWS API response
 * @param {Object} forecastData - NWS API forecast response
 * @returns {Array} - Formatted forecast periods
 */
const formatForecast = (forecastData) => {
  if (!forecastData.properties || !forecastData.properties.periods || !Array.isArray(forecastData.properties.periods)) {
    throw new Error('Invalid forecast data structure');
  }
  
  return forecastData.properties.periods.map(period => {
    if (!period) return null;
    
    return {
      name: period.name || 'Unknown',
      temperature: period.temperature !== undefined ? 
        `${period.temperature}°${period.temperatureUnit || 'F'}` : 'N/A',
      temperatureValue: period.temperature,
      condition: period.shortForecast || 'Unknown',
      iconClass: getWeatherIconClass(period.shortForecast),
      windSpeed: period.windSpeed || 'N/A',
      windDirection: period.windDirection || 'N/A',
      detailedForecast: period.detailedForecast || '',
      isDaytime: !!period.isDaytime,
      startTime: period.startTime || null,
      endTime: period.endTime || null
    };
  }).filter(period => period !== null); // Remove any invalid periods
};

/**
 * Get weather icon class based on condition text
 * @param {string} condition - Weather condition text
 * @returns {string} - Font Awesome icon class
 */
const getWeatherIconClass = (condition) => {
  if (!condition) return 'fas fa-cloud-question';
  
  const conditionLower = condition.toLowerCase();
  
  // Use fontawesome 6 classes that match the website's usage
  // Main weather condition checks
  if (conditionLower.includes('thunderstorm')) return 'fas fa-bolt';
  if (conditionLower.includes('lightning')) return 'fas fa-bolt';
  if (conditionLower.includes('rain') && conditionLower.includes('snow')) return 'fas fa-cloud-sleet';
  if (conditionLower.includes('rain') && conditionLower.includes('ice')) return 'fas fa-cloud-sleet';
  if (conditionLower.includes('freezing') && conditionLower.includes('rain')) return 'fas fa-cloud-sleet';
  if (conditionLower.includes('sleet')) return 'fas fa-cloud-sleet';
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
};

/**
 * Get weather data for the TechServ Garden
 * @param {boolean} forceRefresh - Whether to bypass cache and force refresh
 * @returns {Promise<Object>} - Weather data
 */
export const getGardenWeather = async (forceRefresh = false) => {
  const coordinates = getGardenCoordinates();
  return getWeatherData({
    latitude: coordinates.latitude,
    longitude: coordinates.longitude,
    forceRefresh
  });
};

/**
 * Get garden advice based on current weather conditions
 * @param {Object} currentConditions - Current weather conditions
 * @returns {string} - Garden advice text
 */
export const getGardenAdvice = (currentConditions) => {
  if (!currentConditions) return 'Weather data unavailable. Check back later for garden advice.';
  
  const temp = currentConditions.temperatureValue;
  const condition = (currentConditions.condition || '').toLowerCase();
  
  // Temperature-based advice
  if (temp > 85) {
    return 'High temperatures today! Make sure to water plants thoroughly and provide shade for sensitive crops.';
  } else if (temp < 45) {
    return 'Cold temperatures expected. Consider covering sensitive plants or bringing potted plants indoors.';
  }
  
  // Condition-based advice
  if (condition.includes('rain') || condition.includes('shower') || condition.includes('drizzle')) {
    return 'Rain in the forecast! Hold off on watering and consider postponing any planting until drier conditions.';
  } else if (condition.includes('thunderstorm')) {
    return 'Thunderstorms expected! Secure any loose garden structures and postpone garden activities until the weather clears.';
  } else if (condition.includes('snow') || condition.includes('sleet') || condition.includes('ice')) {
    return 'Freezing precipitation expected! Protect sensitive plants with covers and avoid walking on frozen garden beds.';
  } else if (condition.includes('fog') || condition.includes('haze')) {
    return 'Foggy conditions can increase disease risk. Avoid working with wet plants and ensure good air circulation.';
  } else if (condition.includes('wind') || condition.includes('breezy')) {
    return 'Windy conditions today. Secure any loose structures and consider waiting to apply fertilizers or pesticides.';
  } else if (condition.includes('clear') || condition.includes('sunny') || condition.includes('fair')) {
    return 'Perfect day for gardening! Great time for planting, weeding, or harvesting.';
  } else if (condition.includes('partly cloudy') || condition.includes('mostly sunny')) {
    return 'Good conditions for gardening. A mix of sun and clouds provides ideal conditions for most garden tasks.';
  } else if (condition.includes('cloudy') || condition.includes('overcast')) {
    return 'Cloudy conditions today. Good for transplanting seedlings as they\'ll be protected from intense sun.';
  }
  
  // Default advice
  return 'Moderate weather conditions. A good day for general garden maintenance.';
};
