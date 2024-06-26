/**
 * Default structure for weather data in the application.
 * This object is used to initialize state and standardize data transformation outputs.
 */
export const defaultWeather = {
  temperature: 0,  // Celsius
  humidity: 0,     // Percentage
  windSpeed: 0,    // km/h
  condition: "",   // Description of weather conditions
  icon: "",        // URL to weather icon image
  time: "",        // Date and time in local time
  user_latitude: 0,     // Latitude
  user_longitude: 0,    // Longitude
  latitude: 0,     // Latitude
  longitude: 0,    // Longitude
  timezone: "",    // Time zone
  sunrise: "", // string
  sunset: "null", // string
  high: 0, // degrees in celcius
  low: 0, // degrees in celcius
  city: "",        // Name of the city
  region: "",      // Region name
  country: "",     // Country name
};
