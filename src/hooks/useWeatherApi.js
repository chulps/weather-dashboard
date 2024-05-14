import { useState, useEffect } from 'react';
import axios from 'axios';

const openWeatherMapAPI = process.env.REACT_APP_OPEN_WEATHER_API_KEY;
const weatherAPIKey = process.env.REACT_APP_WEATHER_API_KEY;

const useWeatherApi = (city) => {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!city) return;

    const fetchOpenWeatherMap = async () => {
      const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${openWeatherMapAPI}&units=metric`;
      console.log("Fetching OpenWeatherMap:", url);
      try {
        const response = await axios.get(url);
        console.log("OpenWeatherMap response:", response.data);
        return response.data;
      } catch (error) {
        console.error("Failed to fetch from OpenWeatherMap", error);
        return null;
      }
    };

    const fetchWeatherAPI = async () => {
      const url = `https://api.weatherapi.com/v1/current.json?key=${weatherAPIKey}&q=${city}&aqi=no`;
      console.log("Fetching WeatherAPI:", url);
      try {
        const response = await axios.get(url);
        console.log("WeatherAPI response:", response.data);
        return response.data;
      } catch (error) {
        console.error("Failed to fetch from WeatherAPI", error);
        return null;
      }
    };

    const fetchWeather = async () => {
      setLoading(true);
      setError(null);

      const results = await Promise.allSettled([fetchOpenWeatherMap(), fetchWeatherAPI()]);
      console.log("API call results:", results);

      const successfulResults = results.filter(result => result.status === 'fulfilled' && result.value);
      if (successfulResults.length > 0) {
        // Example: use the first successful response
        setWeather(successfulResults[0].value);
      } else {
        setError('Failed to fetch weather data from any source.');
      }

      setLoading(false);
    };

    fetchWeather();
  }, [city]);

  return { weather, loading, error };
};

export default useWeatherApi;
