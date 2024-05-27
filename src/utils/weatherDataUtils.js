import moment from 'moment-timezone';
import { getName } from 'country-list';
import { getGeoLocationLatitude, getGeoLocationLongitude } from "./geoLocation";

// Now you can use geoLocationLatitude and geoLocationLongitude in your functions
// Function to convert offset to timezone name
const offsetToTimezone = (offsetInSeconds) => {
  const offsetInMinutes = offsetInSeconds / 60;
  const guessedTimezone = moment.tz.guess(offsetInMinutes);
  return guessedTimezone || null;
};

// Inline function to convert Unix timestamp to HH:mm format in a specific timezone
const toTimeString = (timestamp, timeZone) => {
  const options = {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
    timeZone: timeZone,
  };
  return new Date(timestamp * 1000).toLocaleTimeString('en-GB', options);
};

// Function to transform OpenWeatherMap data
export function transformOpenWeatherAPI(data) {
  console.log(data)
  const timezone = offsetToTimezone(data.timezone);
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
      timeZone: timezone,
    }),
    timezone: timezone,
    latitude: data.coord.lat,
    longitude: data.coord.lon,
    sunrise: toTimeString(data.sys.sunrise, timezone),
    sunset: toTimeString(data.sys.sunset, timezone),
    high: Math.round(data.main.temp_max),
    low: Math.round(data.main.temp_min),
    region: "", // Placeholder; requires additional data source
    country: getName(data.sys.country),
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
      timeZone: data.location.tz_id,
    }),
    latitude: data.location.lat,
    longitude: data.location.lon,
    timezone: data.location.tz_id,
    sunrise: 0, // Not available
    sunset: 0, // Not available
    high: 0, // Not available
    low: 0, // Not available
    region: data.location.region,
    country: data.location.country,
  };
}

// Helper function to format time for display
function formatTimeDisplay(time) {
  const date = typeof time === 'string' ? new Date(time) : new Date(time * 1000);

  const dayOptions = { weekday: 'short', month: 'short', day: 'numeric' };
  const timeOptions = { hour: 'numeric', minute: '2-digit', hour12: false };

  const formattedDay = date.toLocaleDateString('en-US', dayOptions);
  const formattedTime = date.toLocaleTimeString('en-US', timeOptions);

  return `${formattedDay}, ${formattedTime}`;
}

// Function to merge weather data from two sources
export function mergeWeatherData(dataWa, dataOwm) {

  const dataTimeStamp = new Date().toISOString();

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
    condition:
      dataOwm.condition && dataWa.condition
        ? dataOwm.condition.length < dataWa.condition.length
          ? dataOwm.condition
          : dataWa.condition
        : dataOwm.condition || dataWa.condition,
    icon: dataOwm.icon ? dataOwm.icon : dataWa.icon,
    city: dataOwm.city ? dataOwm.city : dataWa.city,
    time: dataOwm.time ? formatTimeDisplay(dataOwm.time) : formatTimeDisplay(dataWa.time),
    timezone: dataOwm.timezone ? dataOwm.timezone : dataWa.timezone,
    user_latitude: getGeoLocationLatitude() ? getGeoLocationLatitude() : "unknown",
    user_longitude: getGeoLocationLongitude() ? getGeoLocationLongitude() : "unknown",
    latitude: dataOwm.latitude ? dataOwm.latitude : dataWa.latitude,
    longitude: dataOwm.longitude ? dataOwm.longitude : dataWa.longitude,
    sunrise: dataWa.sunrise ? dataWa.sunrise : "--",
    sunset: dataWa.sunset ? dataWa.sunset : "--",
    high: dataWa.high ? dataWa.high : "--",
    low: dataWa.low ? dataWa.low : "--",
    region: dataOwm.region ? dataOwm.region : dataWa.region,
    country: dataOwm.country ? dataOwm.country : dataWa.country,
    timestamp: dataTimeStamp,
  };
}
