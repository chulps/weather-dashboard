// src/utils/transformations.js
export function transformOpenWeatherMap(data) {
    return {
      temperature: data.main.temp,
      humidity: data.main.humidity,
      windSpeed: data.wind.speed,
      condition: data.weather[0].description,
      icon: `https://openweathermap.org/img/w/${data.weather[0].icon}.png`,
      city: data.name,
      country: data.sys.country
    };
  }
  
  export function transformWeatherAPI(data) {
    return {
      temperature: data.current.temp_c,
      humidity: data.current.humidity,
      windSpeed: data.current.wind_kph,
      condition: data.current.condition.text,
      icon: `https:${data.current.condition.icon}`,
      city: data.location.name,
      country: data.location.country
    };
  }
  