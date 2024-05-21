import moment from 'moment-timezone';
import { getName } from 'country-list';

// Function to convert offset to timezone name
const offsetToTimezone = (offsetInSeconds) => {
  const offsetInMinutes = offsetInSeconds / 60;
  const timezones = moment.tz.names();

  for (let i = 0; i < timezones.length; i++) {
    const timezone = timezones[i];
    const offset = moment.tz(timezone).utcOffset();
    if (offset === offsetInMinutes) {
      return timezone;
    }
  }

  return null;
};

// Function to transform OpenWeatherMap data
export function transformOpenWeatherAPI(data) {
  return {
    temperature: data.main.temp,
    humidity: data.main.humidity,
    windSpeed: data.wind.speed,
    condition: data.weather[0].description,
    icon: `https://openweathermap.org/img/w/${data.weather[0].icon}.png`,
    city: data.name,
    time: new Date(data.dt * 1000).toLocaleString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
    }),
    timezone: offsetToTimezone(data.timezone),
    region: "", // Placeholder; requires additional data source
    country: getName(data.sys.country), // Convert country code to name
  };
}

// Function to transform WeatherAPI data
export function transformWeatherMap(data) {
  return {
    temperature: data.current.temp_c,
    humidity: data.current.humidity,
    windSpeed: data.current.wind_kph / 3.6, // Convert kph to m/s to match OpenWeatherMap
    condition: data.current.condition.text,
    icon: `https:${data.current.condition.icon}`,
    city: data.location.name,
    time: new Date(data.location.localtime).toLocaleString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
    }),
    timezone: data.location.tz_id,
    region: data.location.region,
    country: data.location.country,
  };
}

// Helper function to format time
function formatTime(time) {
  const date = typeof time === 'string' ? new Date(time) : new Date(time * 1000);

  const dayOptions = { weekday: 'short', month: 'short', day: 'numeric' };
  const timeOptions = { hour: 'numeric', minute: '2-digit', hour12: false };

  const formattedDay = date.toLocaleDateString('en-US', dayOptions);
  const formattedTime = date.toLocaleTimeString('en-US', timeOptions);

  return `${formattedDay}, ${formattedTime}`;
}

// Function to merge weather data from two sources
export function mergeWeatherData(dataWa, dataOwm) {

  const dataTimeStamp = new Date().toISOString()

  if (!dataOwm && !dataWa) return null;
  if (!dataOwm) return dataWa;
  if (!dataWa) return dataOwm;

  return {
    temperature:
      dataOwm.temperature && dataWa.temperature
        ? (dataOwm.temperature + dataWa.temperature) / 2
        : dataOwm.temperature || dataWa.temperature || null,
    humidity:
      dataOwm.humidity || dataWa.humidity
        ? Math.max(dataOwm.humidity, dataWa.humidity)
        : null,
    windSpeed:
      dataOwm.windSpeed && dataWa.windSpeed
        ? Math.round((dataOwm.windSpeed + dataWa.windSpeed) / 2)
        : dataOwm.windSpeed || dataWa.windSpeed || null,
    condition: dataOwm.condition ? dataOwm.condition : dataWa.condition,
    icon: dataOwm.icon ? dataOwm.icon : dataWa.icon,
    city: dataOwm.city ? dataOwm.city : dataWa.city,
    time: dataOwm.time ? formatTime(dataOwm.time) : formatTime(dataWa.time),
    timezone: dataOwm.timezone ? dataOwm.timezone : dataWa.timezone,
    region: dataOwm.region ? dataOwm.region : dataWa.region,
    country: dataOwm.country ? dataOwm.country : dataWa.country,
    timestamp: dataTimeStamp,
  };
}
