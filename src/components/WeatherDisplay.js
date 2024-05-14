import axios from 'axios';
import { useState, useEffect } from 'react';
import '../css/WeatherDisplay.css';

const API_KEY = process.env.REACT_APP_OPEN_WEATHER_API;

function WeatherDisplay({ city }) {
  const [weather, setWeather] = useState(null);

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const response = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}`);;
        setWeather(response.data);
      } catch (error) {
        console.error("Failed to fetch weather", error);
      }
    };

    fetchWeather();
  }, [city]);

  return (
    <div>
      {weather ? (
        <div>
          <h1>{weather.name}</h1>
          <p>Temperature: {weather.main.temp}°C</p>
          <p>Humidity: {weather.main.humidity}%</p>
          <p>Wind Speed: {weather.wind.speed} km/h</p>
        </div>
      ) : (
        <p>Loading...</p>
      )}
      <div>
</div>
    </div>
  );
}

export default WeatherDisplay;