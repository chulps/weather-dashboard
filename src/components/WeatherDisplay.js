import React, { useEffect, useState } from "react";
import { useWeatherApi } from "../hooks/useWeatherApi";
import { getWeatherAdviceFromGPT } from "../utils/openAiUtils";
import "../css/weather-display.css";
import { aiQuote } from "../utils/aiQuoteUtils";
import DOMPurify from "dompurify"; // Import DOMPurify

function WeatherDisplay({ city }) {
  const { weather, loading, warning, error } = useWeatherApi(city);
  const [advice, setAdvice] = useState("");
  const [quote, setQuote] = useState("");
  const [author, setAuthor] = useState("");

  useEffect(() => {
    aiQuote()
      .then((response) => {
        const { quote, author } = JSON.parse(response);
        setQuote(quote);
        setAuthor(author);
      })
      .catch((error) => {
        console.error("Error fetching quote from OpenAI:", error);
        setQuote("Error fetching quote.");
        setAuthor("");
      });
  }, []);

  useEffect(() => {
    if (weather.city) {
      getWeatherAdviceFromGPT(weather)
        .then((advice) => {
          // Sanitize the HTML content
          const sanitizedAdvice = DOMPurify.sanitize(advice);
          setAdvice(sanitizedAdvice);
        })
        .catch((error) => {
          console.error("Error fetching advice from OpenAI:", error);
          setAdvice("Error fetching advice. Please try again later.");
        });
    }
  }, [weather]);

  if (loading) return <data className="system-message blink">Loading...</data>;
  if (error) return <data className="system-message">Error: {error}</data>;
  if (warning) return <data className="system-message">Oops!: {warning}</data>;

  return (
    <div className="weather-display">
      {weather.city ? (
        <div className="weather-content">
          <div className="weather-top">
            <div className="weather-temperature">
              <h1>{Math.round(weather.temperature)}°C</h1>
              <small>{weather.time}</small>
            </div>

            <img src={weather.icon} alt={weather.condition || "Weather icon"} />
            <div className="weather-location">
              <h3 className="weather-city">{weather.city}</h3>
              <p>
                {weather.region}, {weather.country}
              </p>
            </div>

            <div className="weather-data">
              <div>
                <label>Condition:</label> <data>{weather.condition}</data>
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
          </div>

          <div className="weather-advice">
            {/* This code renders the advice text or a loading message */}
            <div
              dangerouslySetInnerHTML={{
                __html: advice || "Fetching advice...",
              }}
            />
          </div>
        </div>
      ) : (
        <div>
          <label>About the weather...</label>
          <div>
            {quote ? (
              <h3 className="weather-quote">
                <i>"{quote}"</i>
              </h3>
            ) : (
              <data>Thinking of a quote about the weather...</data>
            )}
          </div>
          <div className="weather-quote-author">- {author}</div>
        </div>
      )}
    </div>
  );
}

export default WeatherDisplay;
