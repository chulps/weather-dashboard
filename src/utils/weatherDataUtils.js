// src/utils/weatherDataUtils.js

// Transformation for OpenWeatherMap data
export function transformWeatherMap(data) {
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
//
// Transformation for WeatherAPI data
export function transformOpenWeatherAPI(data) {
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

// Merging function
export function mergeWeatherData(dataWa, dataOwm ) {
  if (!dataOwm && !dataWa) return null;
  if (!dataOwm) return dataWa;
  if (!dataWa) return dataOwm;
  
  return {
    temperature: (dataOwm.temperature + dataWa.temperature) / 2,
    humidity: Math.max(dataOwm.humidity, dataWa.humidity),
    windSpeed: (dataOwm.windSpeed + dataWa.windSpeed) / 2,
    condition: dataOwm.condition,
    icon: dataOwm.icon,
    city: dataOwm.city,
    country: dataOwm.country
  };
}
