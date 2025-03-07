/**
 * TechServ Community Garden - Weather Service
 * 
 * This module handles weather data retrieval from the National Weather Service (NWS) API
 * and provides formatted data for the weather widget.
 */

// Cache for weather data to avoid excessive API calls
const weatherCache = {
  currentConditions: null,
  forecast: null,
  lastUpdated: null,
  // Cache expiration in milliseconds (30 minutes)
  cacheExpiration: 30 * 60 * 1000
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
    
    // Get location metadata from NWS API
    const pointsResponse = await fetch(`https://api.weather.gov/points/${latitude},${longitude}`);
    
    if (!pointsResponse.ok) {
      throw new Error('Failed to get location data from NWS API');
    }
    
    const pointsData = await pointsResponse.json();
    
    // Get office and grid coordinates
    const office = pointsData.properties.gridId;
    const gridX = pointsData.properties.gridX;
    const gridY = pointsData.properties.gridY;
    
    // Get forecast from NWS API
    const forecastResponse = await fetch(`https://api.weather.gov/gridpoints/${office}/${gridX},${gridY}/forecast`);
    
    if (!forecastResponse.ok) {
      throw new Error('Failed to get forecast from NWS API');
    }
    
    const forecastData = await forecastResponse.json();
    
    // Find nearest observation station
    const stationsResponse = await fetch(pointsData.properties.observationStations);
    
    if (!stationsResponse.ok) {
      throw new Error('Failed to get observation stations from NWS API');
    }
    
    const stationsData = await stationsResponse.json();
    const nearestStation = stationsData.features[0].properties.stationIdentifier;
    
    // Get latest observations
    const observationsResponse = await fetch(`https://api.weather.gov/stations/${nearestStation}/observations/latest`);
    
    if (!observationsResponse.ok) {
      throw new Error('Failed to get observations from NWS API');
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
  
  // Convert temperature from Celsius to Fahrenheit
  const tempC = properties.temperature.value;
  const tempF = tempC !== null ? Math.round((tempC * 9/5) + 32) : null;
  
  // Convert wind speed from m/s to mph
  const windSpeedMS = properties.windSpeed.value;
  const windSpeedMPH = windSpeedMS !== null ? Math.round(windSpeedMS * 2.237) : null;
  
  return {
    temperature: tempF !== null ? `${tempF}°F` : 'N/A',
    temperatureValue: tempF,
    condition: properties.textDescription || 'Unknown',
    humidity: properties.relativeHumidity.value !== null ? 
      `${Math.round(properties.relativeHumidity.value)}%` : 'N/A',
    humidityValue: properties.relativeHumidity.value !== null ? 
      Math.round(properties.relativeHumidity.value) : null,
    windSpeed: windSpeedMPH !== null ? `${windSpeedMPH} mph` : 'N/A',
    windSpeedValue: windSpeedMPH,
    iconClass: getWeatherIconClass(properties.textDescription),
    observationTime: new Date(properties.timestamp).toLocaleString(),
    cloudCover: properties.cloudLayers?.[0]?.amount || 'N/A'
  };
};

/**
 * Format forecast from NWS API response
 * @param {Object} forecastData - NWS API forecast response
 * @returns {Array} - Formatted forecast periods
 */
const formatForecast = (forecastData) => {
  return forecastData.properties.periods.map(period => {
    return {
      name: period.name,
      temperature: `${period.temperature}°${period.temperatureUnit}`,
      temperatureValue: period.temperature,
      condition: period.shortForecast,
      iconClass: getWeatherIconClass(period.shortForecast),
      windSpeed: period.windSpeed,
      windDirection: period.windDirection,
      detailedForecast: period.detailedForecast,
      isDaytime: period.isDaytime
    };
  });
};

/**
 * Get weather icon class based on condition text
 * @param {string} condition - Weather condition text
 * @returns {string} - Font Awesome icon class
 */
const getWeatherIconClass = (condition) => {
  if (!condition) return 'fa-cloud-question';
  
  const conditionLower = condition.toLowerCase();
  
  if (conditionLower.includes('thunderstorm')) return 'fa-bolt';
  if (conditionLower.includes('lightning')) return 'fa-bolt';
  if (conditionLower.includes('rain') && conditionLower.includes('snow')) return 'fa-cloud-sleet';
  if (conditionLower.includes('rain') && conditionLower.includes('ice')) return 'fa-cloud-sleet';
  if (conditionLower.includes('freezing') && conditionLower.includes('rain')) return 'fa-cloud-sleet';
  if (conditionLower.includes('sleet')) return 'fa-cloud-sleet';
  if (conditionLower.includes('rain')) return 'fa-cloud-rain';
  if (conditionLower.includes('showers')) return 'fa-cloud-rain';
  if (conditionLower.includes('drizzle')) return 'fa-cloud-drizzle';
  if (conditionLower.includes('snow')) return 'fa-snowflake';
  if (conditionLower.includes('blizzard')) return 'fa-cloud-snow';
  if (conditionLower.includes('ice')) return 'fa-icicles';
  if (conditionLower.includes('hail')) return 'fa-cloud-hail';
  if (conditionLower.includes('fog')) return 'fa-fog';
  if (conditionLower.includes('haze')) return 'fa-smog';
  if (conditionLower.includes('dust')) return 'fa-smog';
  if (conditionLower.includes('smoke')) return 'fa-smog';
  if (conditionLower.includes('clear')) return conditionLower.includes('night') ? 'fa-moon' : 'fa-sun';
  if (conditionLower.includes('sunny')) return 'fa-sun';
  if (conditionLower.includes('fair')) return conditionLower.includes('night') ? 'fa-moon' : 'fa-sun';
  if (conditionLower.includes('cloud') && conditionLower.includes('sun')) return 'fa-cloud-sun';
  if (conditionLower.includes('partly') && conditionLower.includes('cloudy')) return 'fa-cloud-sun';
  if (conditionLower.includes('mostly') && conditionLower.includes('cloudy')) return 'fa-cloud';
  if (conditionLower.includes('cloudy')) return 'fa-cloud';
  if (conditionLower.includes('overcast')) return 'fa-cloud';
  
  // Default
  return 'fa-cloud';
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
