import React, { useEffect, useState } from "react";
import { useWeatherApi } from "../hooks/useWeatherApi";
import { getWeatherAdviceFromGPT } from "../utils/openAiUtils";
import { aiQuote } from "../utils/aiQuoteUtils";
import "../css/weather-display.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowsRotate,
  faClock,
  faCaretUp,
  faCaretDown,
  faGlobe,
} from "@fortawesome/free-solid-svg-icons";
import moment from "moment-timezone";
import useTimePassed from "../hooks/useTimePassed";
import ToggleSwitch from "./ToggleSwitch";
import TranslationWrapper from "./TranslationWrapper";

function WeatherDisplay({
  city,
  onResults,
  onAdvice,
  unit,
  setUnit,
  content,
  targetLanguage,
}) {
  const { weather, loading, warning, error, refreshWeather } =
    useWeatherApi(city);
  const [advice, setAdvice] = useState([]);
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

  const errorMessage = `${content.errorFetchingQuote}`;
  const refreshMessage = `${content.tryRefreshing}`;

  useEffect(() => {
    aiQuote()
      .then((response) => {
        const { quote, author, link } = JSON.parse(response);
        setQuote(quote);
        setAuthor(author);
        setLink(link);
      })
      .catch((error) => {
        setQuote(errorMessage);
        setAuthor(refreshMessage);
        setLink("");
      });
  }, [errorMessage, refreshMessage]);

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

  const validateAndCorrectJSON = (jsonString) => {
    try {
      JSON.parse(jsonString);
      return jsonString; // If valid, return as is
    } catch (e) {
      let correctedJSON = jsonString.trim();

      const firstBracketIndex = correctedJSON.indexOf("[");
      if (firstBracketIndex !== -1) {
        correctedJSON = correctedJSON.slice(firstBracketIndex);
      } else {
        correctedJSON = "[]";
      }

      if (!correctedJSON.endsWith("]")) {
        correctedJSON = correctedJSON + "]";
      }

      const openBraces = (correctedJSON.match(/{/g) || []).length;
      const closeBraces = (correctedJSON.match(/}/g) || []).length;
      const openBrackets = (correctedJSON.match(/\[/g) || []).length;
      const closeBrackets = (correctedJSON.match(/]/g) || []).length;
      const quotes = (correctedJSON.match(/"/g) || []).length;

      if (openBraces > closeBraces) {
        correctedJSON += "}".repeat(openBraces - closeBraces);
      }
      if (openBrackets > closeBrackets) {
        correctedJSON += "]".repeat(openBrackets - closeBrackets);
      }
      if (quotes % 2 !== 0) {
        correctedJSON += '"';
      }

      try {
        JSON.parse(correctedJSON);
        return correctedJSON;
      } catch (e) {
        console.error("Failed to correct JSON string:", e);
        const validJSON = correctedJSON.match(/\{(?:[^{}])*}/g) || [];
        return "[" + validJSON.join(",") + "]";
      }
    }
  };

  useEffect(() => {
    if (weather.city) {
      if (loading) {
        setAdvice([]);
      } else {
        getWeatherAdviceFromGPT(weather)
          .then((advice) => {
            const validatedAdvice = validateAndCorrectJSON(advice);
            const parsedAdvice = JSON.parse(validatedAdvice);
            const adviceData = parsedAdvice.advice || [];
            setAdvice(adviceData);
            onAdvice(adviceData);
          })
          .catch((error) => {
            console.error(content.errorFetchingAdviceFromOpenAi, error);
            setTimeout(() => {
              getWeatherAdviceFromGPT(weather)
                .then((advice) => {
                  const validatedAdvice = validateAndCorrectJSON(advice);
                  const parsedAdvice = JSON.parse(validatedAdvice);
                  const adviceData = parsedAdvice.advice || [];
                  setAdvice(adviceData);
                  onAdvice(adviceData);
                })
                .catch((error) => {
                  console.error(content.errorFetchingAdviceFromOpenAi, error);
                  setAdvice([]);
                });
            }, 10000);
          });
      }
    }
  }, [weather, loading, onAdvice, content.errorFetchingAdviceFromOpenAi]);

  useEffect(() => {
    if (weather.city) {
      const initialTime = moment()
        .tz(weather.timezone)
        .format("ddd, D MMMM H:mm:ss");
      setCurrentTime(formatTime(initialTime, unit));

      const updateCurrentTime = () => {
        const newTime = moment()
          .tz(weather.timezone)
          .format("ddd, D MMMM H:mm:ss");
        setCurrentTime(formatTime(newTime, unit));
      };

      const intervalId = setInterval(updateCurrentTime, 1000);

      return () => clearInterval(intervalId);
    }
    /* eslint-disable */
  }, [weather.city, weather.timezone, weather, unit]);
  console.log(targetLanguage);
  const formatTime = (date, unit) => {
    return new Date(date).toLocaleString(targetLanguage, {
      weekday: "short",
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      second: "numeric",
      hour12: unit === "imperial",
    });
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

  const handleRefreshWeather = () => {
    if (city) {
      refreshWeather(city);
    }
  };

  const handleUnitToggle = () => {
    console.log("Toggle unit");
    setUnit((prevUnit) => (prevUnit === "metric" ? "imperial" : "metric"));
  };

  const convertTemperature = (temp, toUnit) => {
    if (toUnit === "imperial") {
      return (temp * 9) / 5 + 32; // Celsius to Fahrenheit
    } else {
      return ((temp - 32) * 5) / 9; // Fahrenheit to Celsius
    }
  };

  const convertWindSpeed = (speed, toUnit) => {
    if (toUnit === "imperial") {
      return speed * 0.621371; // m/s to mph
    } else {
      return speed / 0.621371; // mph to m/s
    }
  };

  const displayedTemperature =
    unit === "metric"
      ? weather.temperature
      : convertTemperature(weather.temperature, "imperial");
  const displayedLow =
    unit === "metric"
      ? weather.low
      : convertTemperature(weather.low, "imperial");
  const displayedHigh =
    unit === "metric"
      ? weather.high
      : convertTemperature(weather.high, "imperial");
  const displayedWindSpeed =
    unit === "metric"
      ? weather.windSpeed
      : convertWindSpeed(weather.windSpeed, "imperial");

  if (loading)
    return (
      <data className="system-message info blink">
        <TranslationWrapper targetLanguage={targetLanguage}>
          Loading...
        </TranslationWrapper>
      </data>
    );
  if (error)
    return (
      <data className="system-message">
        <TranslationWrapper targetLanguage={targetLanguage}>
          Error: {error}
        </TranslationWrapper>
      </data>
    );
  if (warning)
    return (
      <data className="system-message warning">
        <TranslationWrapper targetLanguage={targetLanguage}>
          Oops!: {warning}
        </TranslationWrapper>
      </data>
    );

  return (
    <div className="weather-display">
      {showWeather ? (
        <div id="weather-content" className="weather-content">
          <div className="weather-header">
            <div>
              <label>
                <TranslationWrapper targetLanguage={targetLanguage}>
                  Last Updated
                </TranslationWrapper>
              </label>
              <small
                tooltip={content.refreshWeatherTooltip}
                className={`weather-refresh font-family-data tooltip bottom-right system-message ${
                  timePassed.endsWith("minutes ago") ||
                  timePassed.endsWith("minute ago") ||
                  timePassed.endsWith("seconds ago") ||
                  timePassed.endsWith("second ago")
                    ? "success"
                    : "warning blink"
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
                <TranslationWrapper targetLanguage={targetLanguage}>
                  {timePassed}
                </TranslationWrapper>
              </small>
            </div>
            <ToggleSwitch
              label="Units"
              isOn={unit === "imperial"}
              handleToggle={handleUnitToggle}
              onIcon={<span>🇺🇸</span>}
              offIcon={<FontAwesomeIcon icon={faGlobe} />}
              className="tooltip bottom-left"
              tooltip={content.unitsTooltip}
            />
          </div>
          <div className="weather-top">
            <div className="weather-temperature">
              <div>
                <data style={{ color: "var(--royal-300)" }}>
                  <FontAwesomeIcon icon={faCaretDown} />
                  &nbsp;
                  {Math.round(displayedLow)}°
                </data>
              </div>
              <span>
                <h1>
                  {Math.round(displayedTemperature)}°
                  {unit === "metric" ? "C" : "F"}
                </h1>
                <small>
                  <data>
                    <TranslationWrapper targetLanguage={targetLanguage}>
                      {currentTime}
                    </TranslationWrapper>
                  </data>
                </small>
              </span>
              <div>
                <data style={{ color: "var(--danger-300)" }}>
                  <FontAwesomeIcon icon={faCaretUp} />
                  &nbsp;
                  {Math.round(displayedHigh)}°
                </data>
              </div>
            </div>

            <div className="weather-conditions">
              <img
                className="weather-icon"
                src={weather.icon}
                alt={weather.condition}
              />
            </div>

            <div className="weather-location">
              <h3 className="weather-city">
                <TranslationWrapper targetLanguage={targetLanguage}>
                  {weather.city}
                </TranslationWrapper>
              </h3>
              <p>
                <TranslationWrapper targetLanguage={targetLanguage}>
                  {weather.region}
                </TranslationWrapper>
                {weather.region ? ", " : ""}
                <TranslationWrapper targetLanguage={targetLanguage}>
                  {weather.country}
                </TranslationWrapper>
              </p>
            </div>

            <div className="weather-data">
              <div>
                <label>
                  <TranslationWrapper targetLanguage={targetLanguage}>
                    Conditions
                  </TranslationWrapper>
                </label>
                <data className="sentence-case">
                  <TranslationWrapper targetLanguage={targetLanguage}>
                    {weather.condition.charAt(0).toUpperCase() +
                      weather.condition.slice(1).toLowerCase()}
                  </TranslationWrapper>
                </data>
              </div>
              <div>
                <label>
                  <TranslationWrapper targetLanguage={targetLanguage}>
                    Humidity
                  </TranslationWrapper>
                </label>{" "}
                <data>{Math.round(weather.humidity)}%</data>
              </div>
              <div>
                <label>
                  <TranslationWrapper targetLanguage={targetLanguage}>
                    Wind Speed
                  </TranslationWrapper>
                </label>{" "}
                <data>
                  {/* <TranslationWrapper targetLanguage={targetLanguage}> */}
                  {Math.round(displayedWindSpeed)}{" "}
                  {unit === "metric" ? "km/h" : "mph"}
                  {/* </TranslationWrapper> */}
                </data>
              </div>
            </div>
          </div>
          <div className="weather-advice">
            {advice.length > 0 ? (
              advice.map((item, index) => (
                <div key={index} className="advice-item">
                  <label>
                    <TranslationWrapper targetLanguage={targetLanguage}>
                      {item.label}
                    </TranslationWrapper>
                  </label>
                  <p>
                    <TranslationWrapper targetLanguage={targetLanguage}>
                      {item.p}
                    </TranslationWrapper>
                  </p>
                  <div className="weather-advice-links">
                    {item.links.map((link, idx) => (
                      <a
                        className="link"
                        key={idx}
                        href={`https://www.google.com/search?q=${link.href}`}
                        target="_blank"
                        rel="noreferrer"
                      >
                        <TranslationWrapper targetLanguage={targetLanguage}>
                          {link.text}
                        </TranslationWrapper>
                      </a>
                    ))}
                  </div>
                </div>
              ))
            ) : (
              <data className="system-message blink info">
                <TranslationWrapper targetLanguage={targetLanguage}>
                  Please wait...
                </TranslationWrapper>
              </data>
            )}
          </div>
        </div>
      ) : (
        <div className="quote-container">
          <div className="quote-header">
            <label>
              <TranslationWrapper targetLanguage={targetLanguage}>
                About the weather...
              </TranslationWrapper>
            </label>
            <span
              tooltip={content.refreshQuoteTooltip}
              className={`refresh-quote tooltip left ${
                refreshingQuote ? "disabled" : ""
              } ${refreshTimeout ? "disabled" : ""}`}
              onClick={handleRefreshQuote}
            >
              {!refreshTimeout && refreshingQuote && (
                <small>
                  <TranslationWrapper targetLanguage={targetLanguage}>
                    Getting fresh quote...
                  </TranslationWrapper>
                </small>
              )}
              {refreshTimeout && (
                <small className="system-message warning">
                  <TranslationWrapper targetLanguage={targetLanguage}>
                    Please wait {remainingTime} seconds
                  </TranslationWrapper>
                </small>
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
                  <i>
                    "
                    <TranslationWrapper targetLanguage={targetLanguage}>
                      {quote}
                    </TranslationWrapper>
                    "
                  </i>
                </p>
              </>
            ) : (
              <data className="system-message info blink">
                <TranslationWrapper targetLanguage={targetLanguage}>
                  Thinking of a quote about the weather...
                </TranslationWrapper>
              </data>
            )}
          </div>
          {quote && (
            <div className="weather-quote-author">
              <TranslationWrapper targetLanguage={targetLanguage}>
                {"- " + author + " | "}
              </TranslationWrapper>
              {author && author !== "Unknown" && (
                <a
                  className="tooltip bottom-left"
                  tooltip="Find out who said this."
                  target={quote !== errorMessage ? "_blank" : "_self"}
                  rel="noreferrer"
                  href={quote ? link : "/"}
                >
                  <TranslationWrapper targetLanguage={targetLanguage}>
                    {quote !== errorMessage ? "Who?" : "Refresh"}
                  </TranslationWrapper>
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
