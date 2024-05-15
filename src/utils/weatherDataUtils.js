// src/utils/weatherDataUtils.js

// Transformation for OpenWeatherMap data
// This function transforms the data received from the OpenWeatherMap API into a standardized format
export function transformOpenWeatherAPI(data) {
  return {
    temperature: data.main.temp, // Extract temperature from the 'main' object
    humidity: data.main.humidity, // Extract humidity from the 'main' object
    windSpeed: data.wind.speed, // Extract wind speed from the 'wind' object
    condition: data.weather[0].description, // Extract weather condition description from the first element of the 'weather' array
    icon: `https://openweathermap.org/img/w/${data.weather[0].icon}.png`, // Construct the URL for the weather icon
    city: data.name, // Extract the city name
    country: data.sys.country, // Extract the country code from the 'sys' object
  };
}

// Transformation for WeatherAPI data
// This function transforms the data received from the WeatherAPI into a standardized format
export function transformWeatherMap(data) {
  console.log(data)
  return {
    temperature: data.current.temp_c, // Extract temperature in Celsius from the 'current' object
    humidity: data.current.humidity, // Extract humidity from the 'current' object
    windSpeed: data.current.wind_kph, // Extract wind speed in kilometers per hour from the 'current' object
    condition: data.current.condition.text, // Extract weather condition description from the 'condition' object
    icon: `https:${data.current.condition.icon}`, // Construct the URL for the weather icon
    city: data.location.name, // Extract the city name from the 'location' object
    region: data.location.region, // Extract the region name from the 'location' object
    country: data.location.country, // Extract the country name from the 'location' object
  };
}

// Merging function
// This function merges the weather data from two different sources (OpenWeatherMap and WeatherAPI)
export function mergeWeatherData(dataWa, dataOwm) {
  // Check if both data sources are available
  if (!dataOwm && !dataWa) return null; // If both are unavailable, return null
  if (!dataOwm) return dataWa; // If OpenWeatherMap data is unavailable, return WeatherAPI data
  if (!dataWa) return dataOwm; // If WeatherAPI data is unavailable, return OpenWeatherMap data

  // Merge the data from both sources
  return {
    temperature: (dataOwm.temperature + dataWa.temperature) / 2, // Calculate the average temperature
    humidity: Math.max(dataOwm.humidity, dataWa.humidity), // Take the maximum humidity value
    windSpeed: (dataOwm.windSpeed + dataWa.windSpeed) / 2, // Calculate the average wind speed
    condition: dataOwm.condition, // Use the weather condition from OpenWeatherMap
    icon: dataOwm.icon, // Use the weather icon from OpenWeatherMap
    city: dataOwm.city, // Use the city name from OpenWeatherMap
    country: dataOwm.country, // Use the country code from OpenWeatherMap
  };
}
