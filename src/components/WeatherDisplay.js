import React, { useEffect, useState } from "react";
import { useWeatherApi } from "../hooks/useWeatherApi";
import { getWeatherAdviceFromGPT } from "../utils/openAiUtils";
import "../css/weather-display.css";

// WeatherDisplay component displays weather information and advice for a given city
function WeatherDisplay({ city }) {
  // Use the useWeatherApi hook to fetch weather data for the given city
  const { weather, loading, warning, error } = useWeatherApi(city);
  // State to store the weather advice fetched from OpenAI
  const [advice, setAdvice] = useState("");

  // When the weather data changes, fetch weather advice from OpenAI
  useEffect(() => {
    if (weather.city) {
      getWeatherAdviceFromGPT(weather)
        .then((advice) => {
          setAdvice(advice);
        })
        .catch((error) => {
          console.error("Error fetching advice from OpenAI:", error);
          setAdvice("Error fetching advice.");
        });
    }
  }, [weather]);

  // If weather data is still loading, show a loading message
  if (loading) return <data>Loading...</data>;
  // If there was an error fetching weather data, show an error message
  if (error) return <data>Error: {error}</data>;
  if (warning) return <data>Oops!: {warning}</data>;
  
  return (
    <div className="weather-display">
      {/* If weather data is available, show weather information and advice */}
      {weather.city ? (
        <div className="weather-content">
          <div className="weather-top">
            {/* Display temperature */}
            <h1>{Math.round(weather.temperature)}°C</h1>
            {/* Display weather icon */}
            <img
              src={weather.icon}
              alt={weather.condition || "Weather icon"}
              style={{ width: "var(--space-4)", height: "var(--space-4)" }}
            />
            {/* Display city and country */}
            <h3 className="weather-city">
              <i>
                {weather.city}, {weather.region}, {weather.country}
              </i>
            </h3>
          </div>
          <div className="weather-data">
            {/* Display weather condition */}
            <div>
              <label>Condition:</label>{" "}
              <data>{weather.condition}</data>
            </div>

            {/* Display humidity */}
            <div>
              <label>Humidity:</label>{" "}
              <data>{Math.round(weather.humidity)}%</data>
            </div>

            {/* Display wind speed */}
            <div>
              <label>Wind Speed:</label>{" "}
              <data>{Math.round(weather.windSpeed)} km/h</data>
            </div>
          </div>
          {/* Display weather advice */}
          <div>
            <label>Advice:</label> {advice || "Fetching advice..."}
          </div>
        </div>
      ) : (
        <div>
          {/* If no weather data is available, show a default message */}
          <label>About the weather...</label>
          <h3>
            <i>
              "Sunshine is delicious, rain is refreshing, wind braces us up,
              snow is exhilarating; there is really no such thing as bad
              weather, only different kinds of good weather."
            </i>
          </h3>
          <p>- John Ruskin</p>
        </div>
      )}
    </div>
  );
}

export default WeatherDisplay;
