import { useState, useEffect } from 'react';
import axios from 'axios';
import { defaultWeather } from '../utils/defaultWeather';
import { mergeWeatherData, transformOpenWeatherAPI, transformWeatherMap } from '../utils/weatherDataUtils';
import getEnv  from '../utils/getEnv';

const currentEnv = getEnv();

// Function to fetch weather data from your API
const fetchWeatherData = async (city, baseUrl) => {
  try {
    const weatherUrl = `${baseUrl}/api/weather?city=${city}`;
    const openWeatherUrl = `${baseUrl}/api/openweather?city=${city}`;

    const responseOpenWeather = await axios.get(openWeatherUrl);
    const responseWeather = await axios.get(weatherUrl);

    const Wdata = transformWeatherMap(responseWeather.data);
    const Odata = transformOpenWeatherAPI(responseOpenWeather.data);

    console.log(Wdata)

return mergeWeatherData(Odata, Wdata);
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
  const baseUrl = currentEnv === 'production' ? 'https://limitless-lake-38337.herokuapp.com' : 'http://localhost:3001';

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
