import { useState, useEffect } from 'react';
import axios from 'axios';
import { defaultWeather } from '../utils/defaultWeather';
import { mergeWeatherData } from '../utils/weatherDataUtils';

// Function to fetch weather data from your API
const fetchWeatherData = async (city, baseUrl) => {
  try {
    const weatherUrl = `${baseUrl}/api/weather?q=${city}`;
    const openWeatherUrl = `${baseUrl}/api/openweather?q=${city}`;

    const responseOpenWeather = await axios.get(openWeatherUrl);
    const responseWeather = await axios.get(weatherUrl);

    return mergeWeatherData(responseOpenWeather.data, responseWeather.data);
  } catch (error) {
    console.error('Error fetching weather data:', error);
    throw error;
  }
};

export const useWeatherApi = (city) => {
  const [weather, setWeather] = useState(defaultWeather);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Determine the base URL based on the environment
  const baseUrl = process.env.NODE_ENV === 'production' ? process.env.REACT_APP_PRODUCTION_API_URL : process.env.REACT_APP_LOCAL_API_URL;

  useEffect(() => {
    const fetchWeather = async () => {
      if (!city) return;

      setLoading(true);
      try {
        const weatherData = await fetchWeatherData(city, baseUrl);
        setWeather(weatherData);
      } catch (error) {
        console.error(error);
        setError('Unable to fetch weather data.');
      } finally {
        setLoading(false);
      }
    };

    fetchWeather();
  }, [city, baseUrl]);

  return { weather, loading, error };
};
