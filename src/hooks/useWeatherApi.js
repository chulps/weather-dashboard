import { useState, useEffect } from "react";
import axios from "axios";
import { defaultWeather } from "../utils/defaultWeather";
import {
  mergeWeatherData,
  transformOpenWeatherAPI,
  transformWeatherMap,
} from "../utils/weatherDataUtils";
import getEnv from "../utils/getEnv";

// Get the current environment (production or development)
const currentEnv = getEnv();

// Function to fetch weather data from your API
const fetchWeatherData = async (city, baseUrl) => {
  try {
    // URLs for fetching weather data from different APIs
    const weatherUrl = `${baseUrl}/api/weather?city=${city}`;
    const openWeatherUrl = `${baseUrl}/api/openweather?city=${city}`;

    // Fetch data from both APIs
    const responseOpenWeather = await axios.get(openWeatherUrl);
    const responseWeather = await axios.get(weatherUrl);

    // Transform the data from each API to a desired format
    const Wdata = transformWeatherMap(responseWeather.data);
    const Odata = transformOpenWeatherAPI(responseOpenWeather.data);

    // Merge the data from both APIs
    return mergeWeatherData(Odata, Wdata);
  } catch (error) {
    console.error("Error fetching weather data:", error);
    throw error;
  }
};

export const useWeatherApi = (city) => {
  // State variables for weather data, loading state, and error
  const [weather, setWeather] = useState(defaultWeather);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [warning, setWarning] = useState(null);
  // Determine the base URL based on the environment
  const baseUrl =
    currentEnv === "production"
      ? "https://limitless-lake-38337.herokuapp.com"
      : "http://localhost:3001";

  useEffect(() => {
    // Async function to fetch weather data
    const fetchWeather = async () => {
      // Return if no city is provided
      if (!city) return;

      // Set loading state to true
      setLoading(true);
      setWarning(null);
      setError(null);
      try {
        // Fetch weather data and update state
        const weatherData = await fetchWeatherData(city, baseUrl);
        setWeather(weatherData);
      } catch (error) {
        console.error(error);
        // Set error state if unable to fetch weather data
        if (error.response.status === 400) {
          setWarning("Sorry, we don't have data for that location");
        } else {
          setWarning("Sorry, something went wrong");
        }
      } finally {
        // Set loading state to false after fetching data
        setLoading(false);
      }
    };

    // Call the fetchWeather function
    fetchWeather();
  }, [city, baseUrl]);

  // Return weather data, loading state, and error state
  return { weather, loading, warning, error };
};
