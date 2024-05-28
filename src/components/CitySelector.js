import React, { useState, useEffect, useRef, useMemo } from "react";
import "../css/city-selector.css";
import axios from "axios";
import getEnv from "../utils/getEnv";
import debounce from "lodash/debounce";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faLocationDot,
  faShuffle,
  faSearch,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import { setGeoLocation } from "../utils/geoLocation";
import TranslationWrapper from "./TranslationWrapper";

const currentEnv = getEnv();

function CitySelector({
  setCity,
  results,
  advice,
  setShowWeather,
  loading,
  content,
  targetLanguage,
}) {
  const [input, setInput] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [fetchingLocation, setFetchingLocation] = useState(false);
  const [locationFound, setLocationFound] = useState(false);
  const [errorMessage, setErrorMessage] = useState(""); // State to manage error messages
  const suggestionsRef = useRef(null);
  const [randomButtonClicks, setRandomButtonClicks] = useState(0);
  const [randomButtonDisabled, setRandomButtonDisabled] = useState(false);
  const [countdownTime, setCountdownTime] = useState(300); // 5 minutes in seconds
  const cities = [
    "Amsterdam",
    "Athens",
    "Bangkok",
    "Barcelona",
    "Beijing",
    "Berlin",
    "Buenos Aires",
    "Cairo",
    "Cape Town",
    "Chicago",
    "Dubai",
    "Hong Kong",
    "Istanbul",
    "Jakarta",
    "Kuala Lumpur",
    "London",
    "Los Angeles",
    "Madrid",
    "Melbourne",
    "Mexico City",
    "Moscow",
    "Mumbai",
    "New York",
    "Paris",
    "Rio de Janeiro",
    "Rome",
    "San Francisco",
    "Sapporo",
    "Seoul",
    "Shanghai",
    "Singapore",
    "Sydney",
    "Taipei",
    "Tokyo",
    "Toronto",
    "Vancouver",
    "Vienna",
  ];

  const baseUrl =
    currentEnv === "production"
      ? "https://limitless-lake-38337.herokuapp.com"
      : "http://localhost:3001";

  useEffect(() => {
    let debounceSearch = null;
    const loadSuggestions = async () => {
      if (input.length > 1) {
        try {
          const citiesUrl = `${baseUrl}/api/cities?city=${encodeURIComponent(
            input
          )}`;
          const responseCities = await axios.get(citiesUrl);
          setSuggestions(responseCities.data);
        } catch (error) {
          console.error(`${content.failedToFetchSuggestions}`, error);
        }
      } else {
        setSuggestions([]);
      }
    };

    if (!debounceSearch) {
      debounceSearch = debounce(loadSuggestions, 2000);
    }

    debounceSearch();

    return () => {
      if (debounceSearch) {
        debounceSearch.cancel();
        debounceSearch = null;
      }
    };
  }, [input, baseUrl, content.failedToFetchSuggestions]);

  const [cachedCities, setCachedCities] = useState([]);
  const [hiddenCities, setHiddenCities] = useState([]);
  const [hasRecentCityCards, setHasRecentCityCards] = useState(true);

  useEffect(() => {
    setRandomButtonDisabled(false);
    const mergedData = { results, advice };
    const existingCity = cachedCities.find(
      (city) => city.results.city === results.city
    );
    if (!existingCity) {
      setCachedCities((prevCachedCities) =>
        [...prevCachedCities, mergedData].filter(
          (city, index, self) =>
            index ===
            self.findIndex(
              (c) =>
                c.results.city === city.results.city && c.advice === city.advice
            )
        )
      );
    }
  }, [results, advice, cachedCities]);

  const trimmedCachedCities = useMemo(
    () => cachedCities.slice(2),
    [cachedCities]
  );

  const handleSuggestionClick = (suggestion) => {
    const formattedDescription = suggestion.description.replace(/, \s*/g, ",");
    setInput(formattedDescription);
    setSuggestions([]);
    setCity(formattedDescription);
  };

  const handleClickOutside = (event) => {
    if (
      suggestionsRef.current &&
      !suggestionsRef.current.contains(event.target)
    ) {
      setSuggestions([]);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLocation = async () => {
    setFetchingLocation(true);
    try {
      const position = await new Promise((resolve, reject) =>
        navigator.geolocation.getCurrentPosition(resolve, reject)
      );
      const { latitude, longitude } = position.coords;
      setGeoLocation(latitude, longitude); // Set the geoLocation values
      setLocationFound(true);
      setTimeout(() => {
        setLocationFound(false);
      }, 3000);
      handleSubmit(latitude, longitude);
    } catch (error) {
      if (error.code === error.PERMISSION_DENIED) {
        alert(content.locationBlocked);
      } else {
        console.error("Error getting location:", error);
      }
    } finally {
      setFetchingLocation(false);
    }
  };

  const handleSubmit = async (latitude, longitude) => {
    if (latitude && longitude) {
      try {
        const { data: locationData } = await axios.get(
          `${baseUrl}/api/location`,
          {
            params: { lat: latitude, lon: longitude },
          }
        );
        const cityName = locationData.city;
        setCity(cityName);
        setShowWeather(true); // Ensure the weather data is shown
      } catch (error) {
        if (
          error.response &&
          error.response.data.message &&
          error.response.data.message.includes("language")
        ) {
          setErrorMessage(
            "The city's data is not available in your language. Please try another city or change the language."
          );
        } else {
          console.error("Error fetching data:", error);
          console.error("Error response:", error.response);
        }
      }
    } else {
      const coordinatePattern = /^-?\d+(\.\d+)?,-?\d+(\.\d+)?$/;
      if (coordinatePattern.test(input.trim())) {
        const [lat, lon] = input.trim().split(",").map(Number);
        try {
          const { data: locationData } = await axios.get(
            `${baseUrl}/api/location`,
            {
              params: { lat, lon },
            }
          );
          const cityName = locationData.city;
          setCity(cityName);

          setShowWeather(true); // Ensure the weather data is shown
        } catch (error) {
          if (
            error.response &&
            error.response.data.message &&
            error.response.data.message.includes("language")
          ) {
            setErrorMessage(
              "The city's data is not available in your language. Please try another city or change the language."
            );
          } else {
            console.error("Error fetching data:", error);
            console.error("Error response:", error.response);
          }
        }
      } else {
        setCity(input);

        try {
          // Detect the language of the input city name
          const { data: detectionData } = await axios.post(
            `${baseUrl}/api/detect-language`,
            {
              text: input,
            }
          );
          const detectedLanguage = detectionData.language;

          // Translate the input city name to English if it's not already in English
          let translatedCity = input;
          if (detectedLanguage !== "en") {
            const { data: translationData } = await axios.post(
              `${baseUrl}/api/translate-city`,
              {
                text: input,
                targetLanguage: "en",
              }
            );
            translatedCity = translationData.translatedText;
          }

          setCity(translatedCity);
          setShowWeather(true); // Ensure the weather data is shown
        } catch (error) {
          if (
            error.response &&
            error.response.data.message &&
            error.response.data.message.includes("language")
          ) {
            setErrorMessage(
              "The city's data is not available in your language. Please try another city or change the language."
            );
          } else {
            console.error("Error fetching data:", error);
            console.error("Error response:", error.response);
          }
        }
      }
    }
    setInput("");
  };

  const handleFormSubmit = (event) => {
    event.preventDefault();
    handleSubmit();
  };

  const handleRandomCity = (event) => {
    event.preventDefault();
    if (randomButtonDisabled) return;

    setRandomButtonDisabled(true);
    const randomCity = cities[Math.floor(Math.random() * cities.length)];
    setCity(randomCity);
    setShowWeather(true); // Ensure the weather data is shown
    setRandomButtonClicks((prevClicks) => prevClicks + 1);

    if (randomButtonClicks >= 4) {
      const timeoutDuration = 300000; // 5 minutes in milliseconds
      setTimeout(() => {
        setRandomButtonClicks(0);
        setRandomButtonDisabled(false);
        setCountdownTime(300);
      }, timeoutDuration);
    } else {
      setTimeout(() => {
        setRandomButtonDisabled(false);
      }, 2000); // Enable button after 2 seconds for the next click
    }
  };

  const handleCachedCity = (city) => {
    setCity(city);
    setShowWeather(true); // Ensure showWeather is set to true
    setTimeout(() => {
      const weatherContent = document.getElementById("weather-content");
      if (weatherContent) {
        weatherContent.scrollIntoView();
      }
    }, 0); // Ensure DOM is updated before scrolling
  };

  const handleDeleteCachedCity = (cityToDelete) => {
    setHiddenCities((prevHiddenCities) => {
      const newHiddenCities = [...prevHiddenCities, cityToDelete];
      const visibleCities = trimmedCachedCities.filter(
        (city) => !newHiddenCities.includes(city.results.city)
      );
      if (visibleCities.length < 1) {
        setShowWeather(false);
        setHasRecentCityCards(false);
      }
      return newHiddenCities;
    });
  };

  useEffect(() => {
    const countdownInterval = setInterval(() => {
      if (countdownTime > 0 && randomButtonDisabled) {
        setCountdownTime((prevTime) => prevTime - 1);
      }
    }, 1000); // Update countdown every second

    return () => {
      clearInterval(countdownInterval);
    };
  }, [countdownTime, randomButtonDisabled]);

  return (
    <div className="city-selector-container">
      <div className="city-selector">
        <form className="city-selector-form" onSubmit={handleFormSubmit}>
          <div>
            <label htmlFor="city-search">{content.aboutThisApp}</label>
            <h1 className="site-header">{content.header}</h1>
            <p className="app-description">{content.description}</p>
          </div>
          <div
            tooltip="Enter the name of the city you want to search ↓"
            className="city-input-container tooltip top-right"
          >
            <label htmlFor="city-input" style={{ display: "none" }}>
              City
            </label>{" "}
            {/* Added this line */}
            <input
              tooltip={content.inputTooltip}
              className="city-input"
              type="text"
              name="city"
              placeholder={content.searchPlaceholder}
              value={input}
              onChange={(event) => setInput(event.target.value)}
              id="city-input"
            />
            {input.length > 0 && suggestions.length > 0 && (
              <ul className="suggestions" ref={suggestionsRef}>
                {suggestions.map((suggestion) => (
                  <li
                    key={suggestion.description}
                    onClick={() => handleSuggestionClick(suggestion)}
                  >
                    <TranslationWrapper targetLanguage={targetLanguage}>
                      {suggestion.description}
                    </TranslationWrapper>
                  </li>
                ))}
              </ul>
            )}
            {input && (
              <button
                className="clear-button secondary small"
                type="button"
                onClick={() => {
                  setInput("");
                  setSuggestions([]);
                }}
              >
                <TranslationWrapper targetLanguage={targetLanguage}>
                  Clear
                </TranslationWrapper>
              </button>
            )}
          </div>

          <div className="button-wrapper">
            <div className="options-wrapper">
              <button
                className={`random-city-button tooltip bottom-right ${
                  input === "" ? "hollow" : "hollow disabled"
                } ${randomButtonDisabled ? "disabled" : ""}`}
                tooltip={content.randomTooltip}
                type="button"
                onClick={handleRandomCity}
                disabled={randomButtonDisabled}
              >
                <FontAwesomeIcon className="fa-icon" icon={faShuffle} />
                <span>
                  <TranslationWrapper targetLanguage={targetLanguage}>
                    Random
                  </TranslationWrapper>
                </span>
              </button>

              <button
                className={`hollow tooltip bottom-left ${
                  fetchingLocation ? "disabled" : ""
                }`}
                tooltip="Get weather data for your current location."
                type="button"
                onClick={handleLocation}
                disabled={fetchingLocation}
              >
                <span>
                  <FontAwesomeIcon className="fa-icon" icon={faLocationDot} />
                </span>
                <span>
                  {fetchingLocation ? (
                    <span className="blink">{content.locating}</span>
                  ) : locationFound ? (
                    <span className="blink">{content.found}</span>
                  ) : (
                    content.myLocationButton
                  )}
                </span>
              </button>
            </div>

            <button
              style={{ padding: "1em" }}
              className={`tooltip top-left ${input === "" ? "disabled" : ""}`}
              type="submit"
              tooltip={content.searchTooltip}
            >
              <FontAwesomeIcon className="fa-icon" icon={faSearch} />
              {content.searchButton}
            </button>
          </div>
        </form>
        {errorMessage && <p className="error-message">{errorMessage}</p>}{" "}
        {/* Display error message */}
        {trimmedCachedCities.length > 0 && hasRecentCityCards && (
          <div className="recent-searches">
            <label>{content.recentSearches}</label>
            <div className="recent-cities-grid">
              {trimmedCachedCities.map((city, index) => {
                if (hiddenCities.includes(city.results.city)) {
                  return null; // Skip rendering this city
                }

                return (
                  <div
                    className="recent-city-card"
                    onClick={() => handleCachedCity(city.results.city)}
                    key={index}
                  >
                    <img
                      src={city.results.icon}
                      alt={city.results.condition + " in " + city.results.city}
                    />
                    <div>
                      <p className="recent-city-header">
                        <TranslationWrapper targetLanguage={targetLanguage}>
                          {city.results.city}
                        </TranslationWrapper>
                      </p>
                      <div className="recent-city-data">
                        <small className="font-family-data">
                          {Math.round(city.results.temperature)}°C
                        </small>
                        <small className="font-family-data">
                          <TranslationWrapper targetLanguage={targetLanguage}>
                            {city.results.condition.charAt(0).toUpperCase() +
                              city.results.condition.slice(1).toLowerCase()}
                          </TranslationWrapper>
                        </small>
                      </div>
                    </div>
                    <span
                      className="delete-recent-city-button"
                      onClick={(e) => {
                        e.stopPropagation(); // Prevent event bubbling
                        handleDeleteCachedCity(city.results.city);
                      }}
                    >
                      <small
                        tooltip="Remove this city from your recent searches"
                        className="delete-cached-city tooltip"
                      >
                        <FontAwesomeIcon icon={faTrash} />
                      </small>
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default CitySelector;
