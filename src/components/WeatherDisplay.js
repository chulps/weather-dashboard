import React from 'react';
import { useWeatherApi } from '../hooks/useWeatherApi';
import '../css/WeatherDisplay.css';

function WeatherDisplay({ city }) {
  const { weather, loading, error } = useWeatherApi(city);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="weather-display">
      {weather ? (
        <div>
          <h1>{weather.city}</h1>
          <p>Temperature: {weather.temperature}°C</p>
          <p>Humidity: {weather.humidity}%</p>
          <p>Wind Speed: {weather.windSpeed} km/h</p>
        </div>
      ) : (
        <p>No weather data available.</p>
      )}
    </div>
  );
}

export default WeatherDisplay;
