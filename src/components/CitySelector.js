import React, { useState, useEffect, useRef } from "react";
import "../css/city-selector.css";
import axios from "axios";
import getEnv from "../utils/getEnv";
import debounce from "lodash/debounce";
// Get the current environment (production or development)
const currentEnv = getEnv();

function CitySelector({ setCity }) {
  const [input, setInput] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const cities = [
    "New York",
    "London",
    "Paris",
    "Tokyo",
    "Sydney",
    "Moscow",
    "Rio de Janeiro",
    "Cape Town",
    "Dubai",
    "Shanghai",
    "Toronto",
    "Berlin",
    "Barcelona",
    "Rome",
    "Amsterdam",
    "Istanbul",
    "Seoul",
    "Mexico City",
    "Buenos Aires",
    "Cairo",
  ];

  const suggestionsRef = useRef(null);

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

  const handleSubmit = (event) => {
    event.preventDefault();
    setCity(event.target.elements.city.value);
    setInput("");
    window.scrollTo(0, 0);
  };

  const handleRandomCity = () => {
    const randomCity = cities[Math.floor(Math.random() * cities.length)];
    setCity(randomCity);
    window.scrollTo(0, 0);
  };

  return (
    <div>
      <form className="city-selector" onSubmit={handleSubmit}>
        <h1 className="site-header">Weather Dashboard</h1>
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
          <span
            className={input === "" ? "link" : "link disabled"}
            onClick={handleRandomCity}
          >
            Random City
          </span>
  
          <button className={input === "" ? "disabled" : ""} type="submit">
            Get Weather
          </button>
        </div>
      </form>
    </div>
  );
}

export default CitySelector;
