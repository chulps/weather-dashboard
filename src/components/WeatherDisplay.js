import React from 'react';
import useWeatherApi from '../hooks/useWeatherApi'; // Adjust the path as necessary
import '../css/WeatherDisplay.css';

function WeatherDisplay({ city }) {
  const { weather, loading, error } = useWeatherApi(city);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="weather-display">
      {weather ? (
        <div>
          <h1>{weather.location ? weather.location.name : weather.name}</h1>
          <p>Temperature: {weather.current ? weather.current.temp_c : weather.main.temp}°C</p>
          <p>Humidity: {weather.current ? weather.current.humidity : weather.main.humidity}%</p>
          <p>Wind Speed: {weather.current ? weather.current.wind_kph : weather.wind.speed} km/h</p>
        </div>
      ) : (
        <p>No weather data available.</p>
      )}
    </div>
  );
}

export default WeatherDisplay;
