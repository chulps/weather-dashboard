// Inside WeatherDisplay.js
import React, { useEffect, useState } from "react";
import { useWeatherApi } from "../hooks/useWeatherApi";
import { getWeatherAdviceFromGPT } from "../utils/openAiUtils";
import { aiQuote } from "../utils/aiQuoteUtils";
import DOMPurify from "dompurify";
import "../css/weather-display.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowsRotate,
  faQuoteLeft,
  faQuoteRight,
  faClock,
  faCaretUp,
  faCaretDown,
  faSun,
  faMoon,
} from "@fortawesome/free-solid-svg-icons";
import moment from "moment-timezone";
import useTimePassed from "../hooks/useTimePassed";

function WeatherDisplay({ city, onResults, onAdvice }) {
  const { weather, loading, warning, error, refreshWeather } =
    useWeatherApi(city);
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

  const timePassed = useTimePassed(weather.timestamp);

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
        const loadingMessage =
          '<data class="system-message info blink">Please wait...</data>';
        const sanitizedMessage = DOMPurify.sanitize(loadingMessage);
        setAdvice(sanitizedMessage);
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
  }, [weather, loading, onAdvice]);

  useEffect(() => {
    if (weather.city) {
      const initialTime = moment()
        .tz(weather.timezone)
        .format("ddd, D MMMM H:mm:ss");
      setCurrentTime(formatTime(initialTime));

      const updateCurrentTime = () => {
        const newTime = moment()
          .tz(weather.timezone)
          .format("ddd, D MMMM H:mm:ss");
        setCurrentTime(formatTime(newTime));
      };

      const intervalId = setInterval(updateCurrentTime, 1000);

      return () => clearInterval(intervalId);
    }
  }, [weather.city, weather.timezone, weather]);

  const formatTime = (date) => {
    return date.toLocaleString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      second: "numeric",
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

  useEffect(() => {
    if (showWeather) {
      if (window.innerWidth < 576 || window.innerWidth > 992) {
        window.scrollTo(0, 0);
      } else {
        const weatherContent = document.getElementById("weather-content");
        if (weatherContent) {
          const elementPosition =
            weatherContent.getBoundingClientRect().top + window.scrollY;
          const offsetPosition = elementPosition - 72;

          window.scrollTo({
            top: offsetPosition,
            behavior: "smooth",
          });
        }
      }
    }
  }, [showWeather]);

  // New function to refresh weather data
  const handleRefreshWeather = () => {
    if (city) {
      refreshWeather(city);
    }
  };

  if (loading)
    return <data className="system-message info blink">Loading...</data>;
  if (error) return <data className="system-message">Error: {error}</data>;
  if (warning)
    return <data className="system-message warning">Oops!: {warning}</data>;

  return (
    <div className="weather-display">
      {showWeather ? (
        <div id="weather-content" className="weather-content">
          <div className="weather-header">
            <div>
              <label>Last updated:</label>
              {/* Click event to refresh the data for the city */}
              <small
                tooltip="Update weather data"
                className={`weather-refresh font-family-data tooltip bottom-right${
                  timePassed.endsWith("minutes ago") ||
                  timePassed.endsWith("minute ago") ||
                  timePassed.endsWith("seconds ago") ||
                  timePassed.endsWith("second ago")
                    ? ""
                    : " blink"
                }`}
                onClick={handleRefreshWeather}
              >
                <FontAwesomeIcon
                  className="weather-refresh-clock"
                  icon={faClock}
                />
                <FontAwesomeIcon
                  className="weather-refresh-arrows"
                  icon={faArrowsRotate}
                />
                 {timePassed}
              </small>
            </div>
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
              <div>
                {/* <label>Low</label> */}
                <data style={{ color: "var(--royal-300)" }}>
                  <FontAwesomeIcon icon={faCaretDown} />
                  &nbsp;
                  {weather.low}°
                </data>
              </div>
              <span>
                <h1>{Math.round(weather.temperature)}°C</h1>
                <small>
                  <data>{currentTime}</data>
                </small>
              </span>
              <div>
                {/* <label>High</label> */}
                <data style={{ color: "var(--danger-300)" }}>
                  <FontAwesomeIcon icon={faCaretUp} />
                  &nbsp;
                  {weather.high}°
                </data>
              </div>
            </div>

            <div className="weather-conditions">
                <data className="sun-data">
                  <FontAwesomeIcon
                    style={{ color: "var(--warning-500)" }}
                    icon={faSun}
                  />
                  {weather.sunrise}
                </data>
              <img
                className="weather-icon"
                src={weather.icon}
                alt={weather.condition}
              />
              <data className="sun-data">
                <FontAwesomeIcon
                  style={{ color: "var(--royal-200)" }}
                  icon={faMoon}
                />
                {weather.sunset}
              </data>
            </div>

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
                <label>Condition:</label>
                <data className="sentence-case">
                  {weather.condition.charAt(0).toUpperCase() +
                    weather.condition.slice(1).toLowerCase()}
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
              <data className="blink">
                Thinking of a quote about the weather...
              </data>
            )}
          </div>
          {quote && (
            <div className="weather-quote-author">
              {"- " + author + " | "}
              {author && author !== "Unknown" && (
                <a
                  className="tooltip bottom-left"
                  tooltip="Find out who said this."
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
