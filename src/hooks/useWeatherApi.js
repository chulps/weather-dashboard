import { useState, useEffect } from 'react';
import axios from 'axios';
import { defaultWeather } from '../utils/defaultWeather';
import { transformOpenWeatherMap, transformWeatherAPI, mergeWeatherData } from '../utils/weatherDataUtils';

export const useWeatherApi = (city) => {
  const [weather, setWeather] = useState(defaultWeather);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchWeather = async () => {
      setLoading(true);
      try {
        const [owmResponse, waResponse] = await Promise.all([
          axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${process.env.REACT_APP_OPEN_WEATHER_API_KEY}&units=metric`),
          axios.get(`https://api.weatherapi.com/v1/current.json?key=${process.env.REACT_APP_WEATHER_API_KEY}&q=${city}`)
        ]);

        console.log('OpenWeatherMap Response:', owmResponse.data);
        console.log('WeatherAPI Response:', waResponse.data);

        const weatherDataOwm = transformOpenWeatherMap(owmResponse.data);
        const weatherDataWa = transformWeatherAPI(waResponse.data);

        console.log('Transformed OpenWeatherMap Data:', weatherDataOwm);
        console.log('Transformed WeatherAPI Data:', weatherDataWa);

        const mergedWeather = mergeWeatherData(weatherDataOwm, weatherDataWa);

        console.log('Merged Weather Data:', mergedWeather);

        setWeather(mergedWeather);
      } catch (error) {
        console.error("Error fetching weather data:", error);
        setError("Failed to fetch weather data.");
      } finally {
        setLoading(false);
      }
    };

    if (city) {
      fetchWeather();
    }
  }, [city]);

  return { weather, loading, error };
};
