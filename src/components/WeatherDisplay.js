import React from 'react';
import { useWeatherApi } from '../hooks/useWeatherApi';
import '../css/WeatherDisplay.css';

function WeatherDisplay({ city }) {
  const { weather, loading, error } = useWeatherApi(city);

  // Check if weather data is effectively empty
  const hasData = weather && (weather.city || weather.temperature !== 0);

  if (loading) return <data>Loading...</data>;
  if (error) return <data>Error: {error}</data>;

  return (
    <div className="weather-display">
      {hasData ? (
        <div>
          <h1>{weather.city}, {weather.country}</h1>
          <img src={weather.icon} alt={weather.condition || "Weather icon"} style={{ width: 'var(--unit4)', height: 'var(--unit4)' }} />
          <p>Condition: {weather.condition}</p>
          <p>Temperature: {Math.round(weather.temperature)}°C</p>
          <p>Humidity: {Math.round(weather.humidity)}%</p>
          <p>Wind Speed: {Math.round(weather.windSpeed)} km/h</p>
        </div>
      ) : (
        <data>No weather data available.</data>
      )}
    </div>
  );
}

export default WeatherDisplay;