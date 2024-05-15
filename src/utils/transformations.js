// src/utils/transformations.js
// This function transforms the data from the OpenWeatherMap API into a more readable format
export function transformOpenWeatherMap(data) {
  return {
    // Extract the temperature from the 'main' object
    temperature: data.main.temp,
    // Extract the humidity from the 'main' object
    humidity: data.main.humidity,
    // Extract the wind speed from the 'wind' object
    windSpeed: data.wind.speed,
    // Extract the weather condition description from the first element of the 'weather' array
    condition: data.weather[0].description,
    // Construct the URL for the weather icon using the icon code from the first element of the 'weather' array
    icon: `https://openweathermap.org/img/w/${data.weather[0].icon}.png`,
    // Extract the city name
    city: data.name,
    // Extract the country code from the 'sys' object
    country: data.sys.country,
  };
}

// This function transforms the data from the WeatherAPI into a more readable format
export function transformWeatherAPI(data) {
  return {
    // Extract the temperature in Celsius from the 'current' object
    temperature: data.current.temp_c,
    // Extract the humidity from the 'current' object
    humidity: data.current.humidity,
    // Extract the wind speed in kilometers per hour from the 'current' object
    windSpeed: data.current.wind_kph,
    // Extract the weather condition description from the 'condition' object inside the 'current' object
    condition: data.current.condition.text,
    // Construct the URL for the weather icon using the icon URL from the 'condition' object inside the 'current' object
    icon: `https:${data.current.condition.icon}`,
    // Extract the city name from the 'location' object
    city: data.location.name,
    // Extract the country name from the 'location' object
    country: data.location.country,
  };
}
