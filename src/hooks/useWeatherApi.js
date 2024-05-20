// hooks/useWeatherApi.js
import { useState, useEffect } from "react";
import axios from "axios";
import { defaultWeather } from "../utils/defaultWeather";
import {
  mergeWeatherData,
  transformOpenWeatherAPI,
  transformWeatherMap,
} from "../utils/weatherDataUtils";
import getEnv from "../utils/getEnv";

const currentEnv = getEnv();
const baseUrl =
  currentEnv === "production"
    ? "https://limitless-lake-38337.herokuapp.com"
    : "http://localhost:3001";

const fetchWeatherData = async (city, baseUrl) => {
  try {
    const weatherUrl = `${baseUrl}/api/weather?city=${city}`;
    const openWeatherUrl = `${baseUrl}/api/openweather?city=${city}`;
    const responseOpenWeather = await axios.get(openWeatherUrl);
    const responseWeather = await axios.get(weatherUrl);
    const Wdata = transformWeatherMap(responseWeather.data);
    const Odata = transformOpenWeatherAPI(responseOpenWeather.data);
    return mergeWeatherData(Odata, Wdata);
  } catch (error) {
    if (error.config && error.config.url) {
      const apiName = error.config.url.includes("openweather")
        ? "OpenWeather API"
        : "WeatherMap API";
      console.error(`Error fetching weather data from ${apiName}:`, error);
    } else {
      console.error("Error fetching weather data:", error);
    }
    throw error;
  }
};

const cache = new Map();
console.log(cache)
export const useWeatherApi = (city) => {
  const [weather, setWeather] = useState(defaultWeather);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [warning, setWarning] = useState(null);

  useEffect(() => {
    const fetchWeather = async () => {
      if (!city) return;

      if (cache.has(city)) {
        setWeather(cache.get(city));
        return;
      }

      setLoading(true);
      setWarning(null);
      setError(null);

      try {
        const weatherData = await fetchWeatherData(city, baseUrl);
        cache.set(city, weatherData);
        setWeather(weatherData);
      } catch (error) {
        console.error(error);
        if (error.response && error.response.status === 400) {
          setWarning(
            `Sorry, we couldn't find weather data for "${city}". Please check the city name and try again.`
          );
        } else if (error.response && error.response.status === 429) {
          setWarning(
            "Too many requests. Please wait a while before trying again." // TODO: add a countdown timer
          );
        } else if (error.response && error.response.status === 500) {
          setWarning(
            "There is a problem with our data source, please check back later."
          );
        } else if (error.code === "ECONNABORTED") {
          setWarning("Sorry, the request timed out. Please try again later.");
        } else if (error.code === "EAI_AGAIN") {
          setWarning(
            "Sorry, there was a temporary failure in name resolution. Please try again later."
          );
        } else {
          setWarning(
            "Sorry, an unexpected error occurred while fetching weather data. Please try again later."
          );
        }
      } finally {
        setLoading(false);
      }
    };

    fetchWeather();
  }, [city]);

  return { weather, loading, warning, error };
};
