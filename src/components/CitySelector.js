import React, { useState, useEffect, useRef, useCallback } from "react";
import "../css/city-selector.css";
import axios from "axios";
import getEnv from "../utils/getEnv";
import debounce from "lodash/debounce";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faLocationDot,
  faShuffle,
  faSearch,
  faBomb,
} from "@fortawesome/free-solid-svg-icons";

// Get the current environment (production or development)
const currentEnv = getEnv();

function CitySelector({ setCity }) {
  const [input, setInput] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [latLon, setLatLon] = useState(null);
  const [fetchingLocation, setFetchingLocation] = useState(false);
  const [locationFound, setLocationFound] = useState(false);
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
    "Seoul",
    "Shanghai",
    "Singapore",
    "Sydney",
    "Tokyo",
    "Toronto",
    "Vancouver",
    "Vienna",
  ];

  const suggestionsRef = useRef(null);
  const [randomButtonClicks, setRandomButtonClicks] = useState(0);
  const [randomButtonDisabled, setRandomButtonDisabled] = useState(false);
  const [countdownTime, setCountdownTime] = useState(300); // 5 minutes in seconds

  // Determine the base URL based on the environment
  const baseUrl =
    currentEnv === "production"
      ? "https://limitless-lake-38337.herokuapp.com"
      : "http://localhost:3001";

  useEffect(() => {
    let debounceSearch = null;
    const loadSuggestions = async () => {
      if (input.length > 2) {
        try {
          // URL for fetching city data
          const citiesUrl = `${baseUrl}/api/cities?city=${input}`;

          // Fetch data from cities APIs
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

  const handleSuggestionClick = (suggestion) => {
    setInput(suggestion.description.split(",")[0]);
    setSuggestions([]);
    setCity(suggestion.description.split(",")[0]);
    window.scrollTo(0, 0);
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

  const handleLocation = () => {
    setFetchingLocation(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setLatLon({ latitude, longitude });
        setFetchingLocation(false);
        setLocationFound(true);
        setTimeout(() => {
          setLocationFound(false);
        }, 3000); // Reset "Found!" text after 3 seconds
      },
      (error) => {
        console.error("Error getting location:", error);
        setFetchingLocation(false);
      }
    );
  };

  const handleSubmit = useCallback(
    async (event) => {
      event.preventDefault();
      if (latLon) {
        try {
          const { data } = await axios.get(`${baseUrl}/api/location`, {
            params: { lat: latLon.latitude, lon: latLon.longitude },
          });
          setCity(data.city);
          setLatLon(null);
        } catch (error) {
          console.error("Error fetching city from coordinates:", error);
        }
      } else {
        setCity(input);
      }
      setInput("");
      window.scrollTo(0, 0);
    },
    [latLon, baseUrl, input, setCity]
  );

  const handleRandomCity = (event) => {
    event.preventDefault();
    const randomCity = cities[Math.floor(Math.random() * cities.length)];
    setCity(randomCity);
    window.scrollTo(0, 0);

    // Increment the random button click count
    setRandomButtonClicks((prevClicks) => prevClicks + 1);
  };

  useEffect(() => {
    if (latLon) {
      handleSubmit(new Event("submit"));
    }
  }, [latLon, handleSubmit]);

  useEffect(() => {
    let timeout;

    if (randomButtonClicks >= 5) {
      setRandomButtonDisabled(true);
      timeout = setTimeout(() => {
        setRandomButtonClicks(0);
        setRandomButtonDisabled(false);
        setCountdownTime(300); // Reset countdown to 5 minutes
      }, 300000); // 5 minutes in milliseconds
    }

    return () => {
      clearTimeout(timeout);
    };
  }, [randomButtonClicks]);

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
      <form className="city-selector" onSubmit={handleSubmit}>
        <div>
          <label>about this app...</label>
          <h1 className="site-header">AI Weather Dashboard</h1>
          <p className="app-description">
            This app provides weather data and uses Artificial Intelligence to
            make useful suggestions based on that data. Play around with it and
            enjoy!
          </p>
        </div>
        <div className="city-input-container">
          <input
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
              className={`random-city-button tooltip bottom-right ${input === "" ? "hollow" : "hollow disabled"} ${randomButtonDisabled ? "disabled" : ""}`}
              tooltip="🎲 Roll the dice and see what happens!"
              type="button"
              onClick={handleRandomCity}
              disabled={randomButtonDisabled}
            >
              <FontAwesomeIcon className="fa-icon" icon={faShuffle} />
              <span>Random</span>
            </button>
  
            <button
              className={`hollow tooltip bottom ${fetchingLocation ? "disabled" : ""}`}
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
            style={{padding: '1em'}}
            className={`tooltip top-left ${input === "" ? "disabled" : ""}`}
            type="submit"
            tooltip="↖︎ Enter a city into the input field above"
          >
            <FontAwesomeIcon className="fa-icon" icon={faSearch} />
            Search
          </button>
        </div>
        {randomButtonDisabled && (
          <div className="system-message warning">
            <span className="icon"><FontAwesomeIcon icon={faBomb} /></span>
            Warning: Too many requests in a short amount of time. 
            Please wait 0{Math.floor(countdownTime / 60)}:{String(countdownTime % 60).padStart(2, "0")} seconds
          </div>
        )}
      </form>
    </div>
  );
}

export default CitySelector;
