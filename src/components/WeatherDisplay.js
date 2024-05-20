// components/WeatherDisplay.js
import React, { useEffect, useState } from "react";
import { useWeatherApi } from "../hooks/useWeatherApi";
import { getWeatherAdviceFromGPT } from "../utils/openAiUtils";
import { aiQuote } from "../utils/aiQuoteUtils";
import DOMPurify from "dompurify";
import "../css/weather-display.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowsRotate, faQuoteLeft, faQuoteRight } from "@fortawesome/free-solid-svg-icons";

function WeatherDisplay({ city, onResults, onAdvice }) {
  const { weather, loading, warning, error } = useWeatherApi(city);
  const [advice, setAdvice] = useState("");
  const [quote, setQuote] = useState("");
  const [author, setAuthor] = useState("");
  const [link, setLink] = useState("");
  const [currentTime, setCurrentTime] = useState("");
  const [refreshingQuote, setRefreshingQuote] = useState(false);
  const [showWeather, setShowWeather] = useState(false);
  const [refreshCount, setRefreshCount] = useState(0);
  const [refreshTimeout, setRefreshTimeout] = useState(null);
  const [remainingTime, setRemainingTime] = useState(0);

  const errorMessage = "Error fetching quote.";
  const refreshMessage = "Try refreshing the page.";

  useEffect(() => {
    aiQuote()
      .then((response) => {
        const { quote, author, link } = JSON.parse(response);
        setQuote(quote);
        setAuthor(author);
        setLink(link);
      })
      .catch((error) => {
        console.error("Error fetching quote from OpenAI:", error);
        setQuote(errorMessage);
        setAuthor(refreshMessage);
        setLink("");
      });
  }, []);

  useEffect(() => {
    onResults(weather);
  }, [weather, onResults]);

  const handleRefreshQuote = () => {
    if (refreshTimeout) return;

    if (refreshCount < 3) {
      setRefreshingQuote(true);
      setRefreshCount(refreshCount + 1);
      aiQuote()
        .then((response) => {
          const { quote, author, link } = JSON.parse(response);
          setQuote(quote);
          setAuthor(author);
          setLink(link);
          setRefreshingQuote(false);
        })
        .catch((error) => {
          console.error("Error fetching quote from OpenAI:", error);
          setQuote(errorMessage);
          setAuthor(refreshMessage);
          setLink("");
          setRefreshingQuote(false);
        });
    } else {
      const timeout = 60;
      setRefreshTimeout(Date.now() + timeout * 1000);
      setRemainingTime(timeout);
    }
  };

  useEffect(() => {
    if (refreshTimeout) {
      const intervalId = setInterval(() => {
        const timeLeft = Math.ceil((refreshTimeout - Date.now()) / 1000);
        setRemainingTime(timeLeft);
        if (timeLeft <= 0) {
          setRefreshCount(0);
          setRefreshTimeout(null);
          clearInterval(intervalId);
        }
      }, 1000);

      return () => clearInterval(intervalId);
    }
  }, [refreshTimeout]);

  useEffect(() => {
    if (weather.city) {
      if (loading) {
        setAdvice("Please wait...");
      } else {
        getWeatherAdviceFromGPT(weather)
          .then((advice) => {
            const sanitizedAdvice = DOMPurify.sanitize(advice);
            setAdvice(sanitizedAdvice);
            onAdvice(sanitizedAdvice);
          })
          .catch((error) => {
            console.error("Error fetching advice from OpenAI:", error);
            setAdvice("Error fetching advice. Please try again later.");
          });
      }
    }
  }, [weather, loading]);

  useEffect(() => {
    if (weather.city) {
      const initialTime = new Date(weather.time);
      setCurrentTime(formatTime(initialTime));

      const now = new Date();
      const delay = 60000 - (now % 60000);

      const updateCurrentTime = () => {
        const newTime = new Date();
        setCurrentTime(formatTime(newTime));
      };

      const timeoutId = setTimeout(() => {
        updateCurrentTime();
        const intervalId = setInterval(updateCurrentTime, 60000);
        return () => clearInterval(intervalId);
      }, delay);

      return () => clearTimeout(timeoutId);
    }
  }, [weather.city, weather.time]);

  const formatTime = (date) => {
    return date.toLocaleString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      hour12: false,
    });
  };

  const toggleView = () => {
    setShowWeather(!showWeather);
  };

  useEffect(() => {
    if (weather.city) {
      setShowWeather(true);
    }
  }, [weather.city]);

  if (loading) return <data className="system-message blink">Loading...</data>;
  if (error) return <data className="system-message">Error: {error}</data>;
  if (warning) return <data className="system-message">Oops!: {warning}</data>;

  return (
    <div className="weather-display">
      {showWeather ? (
        <div className="weather-content">
          <div className="weather-header">
            <label>Current conditions</label>
            <span
              tooltip="← Back to quotes"
              className="toggle-view-button tooltip left"
              onClick={toggleView}
            >
              <FontAwesomeIcon
                className={refreshingQuote ? "spin" : ""}
                icon={faQuoteLeft}
              />
              <FontAwesomeIcon
                className={refreshingQuote ? "spin" : ""}
                icon={faQuoteRight}
              />
            </span>
          </div>
          <div className="weather-top">
            <div className="weather-temperature">
              <h1>{Math.round(weather.temperature)}°C</h1>
              <small>
                <data>{currentTime}</data>
              </small>
            </div>

            <img
              className="weather-icon"
              src={weather.icon}
              alt={weather.condition}
            />

            <div className="weather-location">
              <h3 className="weather-city">{weather.city}</h3>
              <p>
                {weather.region}
                {weather.region ? ", " : ""}  
                {weather.country}
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
            <div
              dangerouslySetInnerHTML={{
                __html: advice || advice ? advice : "Please wait...",
              }}
            />
          </div>
        </div>
      ) : (
        <div className="quote-container">
          <div className="quote-header">
            <label>About the weather...</label>
            <span
              tooltip="Get a fresh quote"
              className={`refresh-quote tooltip left ${
                refreshingQuote ? "disabled" : ""
              } ${refreshTimeout ? "disabled" : ""}`}
              onClick={handleRefreshQuote}
            >
              {!refreshTimeout && refreshingQuote && (
                <small>Getting fresh quote...</small>
              )}
              {refreshTimeout && (
                <small>Please wait {remainingTime} seconds</small>
              )}
              <FontAwesomeIcon
                className={refreshingQuote ? "spin" : ""}
                icon={faArrowsRotate}
              />
            </span>
          </div>
          <div>
            {quote ? (
              <>
                <p className="weather-quote">
                  <i>"{quote}"</i>
                </p>
              </>
            ) : (
              <data>Thinking of a quote about the weather...</data>
            )}
          </div>
          {quote && (
            <div className="weather-quote-author">
              {"- " + author + " | "}
              {author && author !== "Unknown" && (
                <a
                  className="tooltip bottom-left"
                  tooltip="Find out who said this quote"
                  target={quote !== errorMessage ? "_blank" : "_self"}
                  rel="noreferrer"
                  href={quote ? link : "/"}
                >
                  {quote !== errorMessage ? "Who?" : "Refresh"}
                </a>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default WeatherDisplay;
