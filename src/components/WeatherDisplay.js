import React, { useEffect, useState } from 'react';
import { useWeatherApi } from '../hooks/useWeatherApi';
import { getWeatherAdviceFromGPT } from '../utils/openAiUtils';

function WeatherDisplay({ city }) {
  const { weather, loading, error } = useWeatherApi(city);
  const [advice, setAdvice] = useState("");

  useEffect(() => {
    if (weather) {
        getWeatherAdviceFromGPT(weather).then(advice => {
            console.log("AI-generated advice:", advice);
            setAdvice(advice);
        }).catch(error => {
            console.error("Error fetching advice from OpenAI:", error);
            setAdvice("Error fetching advice.");
        });
    }
}, [weather]);


  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="weather-display">
      {weather ? (
        <div>
          <h1>{weather.city}, {weather.country}</h1>
          <img src={weather.icon} alt={weather.condition || "Weather icon"} style={{ width: 50, height: 50 }} />
          <p>Condition: {weather.condition}</p>
          <p>Temperature: {Math.round(weather.temperature)}°C</p>
          <p>Humidity: {Math.round(weather.humidity)}%</p>
          <p>Wind Speed: {Math.round(weather.windSpeed)} km/h</p>
          <p>Advice: {advice || "Fetching advice..."}</p>
        </div>
      ) : (
        <p>No weather data available.</p>
      )}
    </div>
  );
}

export default WeatherDisplay;
