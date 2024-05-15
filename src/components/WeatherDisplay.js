import React, { useEffect, useState } from "react";
import { useWeatherApi } from "../hooks/useWeatherApi";
import { getWeatherAdviceFromGPT } from "../utils/openAiUtils";
import "../css/weather-display.css";

function WeatherDisplay({ city }) {
  const { weather, loading, error } = useWeatherApi(city);
  const [advice, setAdvice] = useState("");

  useEffect(() => {
    if (weather) {
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

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;
  return (
    <div className="weather-display">
      {weather ? (
        <div className="weather-content">
          <div className="weather-top">
            <h1>{Math.round(weather.temperature)}°C</h1>
            <img
              src={weather.icon}
              alt={weather.condition || "Weather icon"}
              style={{ width: "var(--space-4)", height: "var(--space-4)" }}
            />
            <h3>
              <i>
                {weather.city}, {weather.country}
              </i>
            </h3>
          </div>
          <div className="weather-data">
            <div>
              <label>Condition:</label>{" "}
              <data>
                {/* {weather.condition.charAt(0).toUpperCase() +
                  weather.condition.slice(1).toLowerCase()} */}
                   {weather.condition}
              </data>
            </div>

            <div>
              <label>Humidity:</label>{" "}
              <data>{Math.round(weather.humidity)}%</data>
            </div>

            <div>
              <label>Wind Speed:</label>{" "}
              <data>{Math.round(weather.windSpeed)} km/h</data>
            </div>
          </div>
          <div>
            <label>Advice:</label> {advice || "Fetching advice..."}
          </div>
        </div>
      ) : (
        <div>
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
