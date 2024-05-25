import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  useMemo,
} from "react";
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

const currentEnv = getEnv();

function CitySelector({ setCity, results, advice, setShowWeather, loading }) {
  const [input, setInput] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [latLon, setLatLon] = useState(null);
  const [fetchingLocation, setFetchingLocation] = useState(false);
  const [locationFound, setLocationFound] = useState(false);
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
      if (input.length > 2) {
        try {
          const citiesUrl = `${baseUrl}/api/cities?city=${input}`;
          const responseCities = await axios.get(citiesUrl);
          setSuggestions(responseCities.data);
        } catch (error) {
          console.error("Failed to fetch suggestions:", error);
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
  }, [input, baseUrl]);

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
    const formattedDescription = suggestion.description.replace(/, \s*/g, ',');
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
      setLatLon({ latitude, longitude });
      setGeoLocation(latitude, longitude); // Set the geoLocation values
      setLocationFound(true);
      setTimeout(() => {
        setLocationFound(false);
      }, 3000);
      // Call handleSubmit with the new latLon values
      handleSubmit(latitude, longitude);
    } catch (error) {
      if (error.code === error.PERMISSION_DENIED) {
        alert(
          "Your browser settings are preventing the AI Weather Dashboard from finding your location. Please change your settings to enable this feature."
        );
      } else {
        console.error("Error getting location:", error);
      }
    } finally {
      setFetchingLocation(false);
    }
  };

  const handleSubmit = async (latitude, longitude) => {
    if (latitude && longitude) {
      console.log("Coordinates detected:", { latitude, longitude });
      try {
        const { data: locationData } = await axios.get(`${baseUrl}/api/location`, {
          params: { lat: latitude, lon: longitude },
        });
        console.log("Data fetched for coordinates:", locationData);
        const cityName = locationData.city;
        setCity(cityName);
  
        // Fetch weather data for the detected city
        const { data: weatherData } = await axios.get(`${baseUrl}/api/openweather`, {
          params: { city: cityName },
        });
        console.log("Weather data fetched for city:", weatherData);
        setShowWeather(true); // Ensure the weather data is shown
      } catch (error) {
        console.error("Error fetching data:", error);
        console.error("Error response:", error.response);
      }
    } else {
      const coordinatePattern = /^-?\d+(\.\d+)?,-?\d+(\.\d+)?$/;
      if (coordinatePattern.test(input.trim())) {
        const [lat, lon] = input.trim().split(",").map(Number);
        console.log("Coordinates detected from input:", { lat, lon });
  
        try {
          const { data: locationData } = await axios.get(`${baseUrl}/api/location`, {
            params: { lat, lon },
          });
          console.log("Data fetched for coordinates:", locationData);
          const cityName = locationData.city;
          setCity(cityName);
  
          // Fetch weather data for the detected city
          const { data: weatherData } = await axios.get(`${baseUrl}/api/openweather`, {
            params: { city: cityName },
          });
          console.log("Weather data fetched for city:", weatherData);
          setShowWeather(true); // Ensure the weather data is shown
        } catch (error) {
          console.error("Error fetching data:", error);
          console.error("Error response:", error.response);
        }
      } else {
        setCity(input);
  
        try {
          const { data: weatherData } = await axios.get(`${baseUrl}/api/openweather`, {
            params: { city: input },
          });
          console.log("Weather data fetched for city:", weatherData);
          setShowWeather(true); // Ensure the weather data is shown
        } catch (error) {
          console.error("Error fetching data:", error);
          console.error("Error response:", error.response);
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
            <label>about this app...</label>
            <h1 className="site-header">AI Weather Dashboard</h1>
            <p className="app-description">
              This app provides weather data and uses Artificial Intelligence to
              make useful suggestions based on that data. Play around with it
              and enjoy!
            </p>
          </div>
          <div
            tooltip="Enter the name of the city you want to search ↓"
            className="city-input-container tooltip top-right"
          >
            <input
              tooltip="Enter a city name or click the button below to get your location ↓"
              className="city-input"
              type="text"
              name="city"
              placeholder="Enter city"
              value={input}
              onChange={(event) => setInput(event.target.value)}
            />
            {input.length > 0 && suggestions.length > 0 && (
              <ul className="suggestions" ref={suggestionsRef}>
                {suggestions.map((suggestion) => (
                  <li
                    key={suggestion.description}
                    onClick={() => handleSuggestionClick(suggestion)}
                  >
                    {suggestion.description}
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
                Clear
              </button>
            )}
          </div>

          <div className="button-wrapper">
            <div className="options-wrapper">
              <button
                className={`random-city-button tooltip bottom-right ${
                  input === "" ? "hollow" : "hollow disabled"
                } ${randomButtonDisabled ? "disabled" : ""}`}
                tooltip="🎲 Roll the dice and see what happens!"
                type="button"
                onClick={handleRandomCity}
                disabled={randomButtonDisabled}
              >
                <FontAwesomeIcon className="fa-icon" icon={faShuffle} />
                <span>Random</span>
              </button>

              <button
                className={`hollow tooltip bottom ${
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
                    <span className="blink">Locating...</span>
                  ) : locationFound ? (
                    <span className="blink">Found!</span>
                  ) : (
                    "My Location"
                  )}
                </span>
              </button>
            </div>

            <button
              style={{ padding: "1em" }}
              className={`tooltip top-left ${input === "" ? "disabled" : ""}`}
              type="submit"
              tooltip="↖︎ Enter a city into the input field above"
            >
              <FontAwesomeIcon className="fa-icon" icon={faSearch} />
              Search
            </button>
          </div>
        </form>
        {trimmedCachedCities.length > 0 && hasRecentCityCards && (
          <div className="recent-searches">
            <label>Recent Searches</label>
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
                      <p className="recent-city-header">{city.results.city}</p>
                      <div className="recent-city-data">
                        <small className="font-family-data">
                          {Math.round(city.results.temperature)}°C
                        </small>
                        <small className="font-family-data">
                          {city.results.condition.charAt(0).toUpperCase() +
                            city.results.condition.slice(1).toLowerCase()}
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
