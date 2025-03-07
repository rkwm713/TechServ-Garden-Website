/**
 * TechServ Community Garden Website
 * Weather Feature Module
 * 
 * Main entry point for weather-related functionality
 */

// Export all weather API functions
export {
  getWeatherData,
  getWeatherIconClass,
  getGardenAdvice
} from './api.js';

// Export widget initialization
export {
  initializeWeatherWidget
} from './widget.js';

// Initialize weather functionality when this module is imported
import { initializeWeatherWidget } from './widget.js';

// Main initialization function for the weather feature
export function initWeather() {
  document.addEventListener('DOMContentLoaded', () => {
    initializeWeatherWidget();
  });
}

// Auto-initialize if this module is loaded directly
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initWeather);
} else {
  // DOM already loaded
  initWeather();
}
