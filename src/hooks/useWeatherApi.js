import { useState, useEffect } from 'react';
import axios from 'axios';
import { saveToCache, getFromCache } from '../utils/cacheUtils';
import { transformOpenWeatherMap, transformWeatherAPI, mergeWeatherData } from '../utils/weatherDataUtils';

export const useWeatherApi = (city) => {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchWeather = async () => {
      setLoading(true);
      setError(null);

      // Attempt to load cached data
      const cachedData = getFromCache();
      if (cachedData && cachedData.city === city) {
        setWeather(cachedData);
        setLoading(false);
        return;
      }

      try {
        const [owmResponse, waResponse] = await Promise.all([
          axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${process.env.REACT_APP_OPEN_WEATHER_API_KEY}&units=metric`),
          axios.get(`https://api.weatherapi.com/v1/current.json?q=${city}&key=${process.env.REACT_APP_WEATHER_API_KEY}`)
        ]);

        const weatherDataOwm = transformOpenWeatherMap(owmResponse.data);
        const weatherDataWa = transformWeatherAPI(waResponse.data);

        const mergedWeather = mergeWeatherData(weatherDataOwm, weatherDataWa);

        setWeather(mergedWeather);
        saveToCache(mergedWeather);
      } catch (error) {
        console.error("Error fetching weather data:", error);
        setError("Failed to fetch weather data, using cached data if available.");
        if (cachedData) {  // Use cached data as a fallback if it's available
          setWeather(cachedData);
        }
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
