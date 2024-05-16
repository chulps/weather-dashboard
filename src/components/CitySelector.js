import React, { useState, useEffect } from "react";
import "../css/city-selector.css";
import axios from "axios";
import getEnv from "../utils/getEnv";

// Get the current environment (production or development)
const currentEnv = getEnv();

function CitySelector({ setCity }) {
  const [input, setInput] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [debounceTimer, setDebounceTimer] = useState(null);
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


  // Determine the base URL based on the environment
  const baseUrl =
    currentEnv === "production"
      ? "https://limitless-lake-38337.herokuapp.com"
      : "http://localhost:3001";

  useEffect(() => {
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

    const debounceLoadSuggestions = () => {
      clearTimeout(debounceTimer);
      const timer = setTimeout(() => {
        loadSuggestions();
      }, 2000);
      setDebounceTimer(timer);
    };

    debounceLoadSuggestions();
  }, [input]);

  const handleSuggestionClick = (suggestion) => {
    setInput(suggestion.description.split(",")[0]);
    setSuggestions([]);
    setCity(suggestion.description.split(",")[0]);
  };

  return (
    <form
      className="city-selector"
      onSubmit={(event) => {
        event.preventDefault();
        setCity(event.target.elements.city.value);
        setInput("");
      }}
    >
      <h1 className="site-header">Weather Dashboard</h1>
      <div className="city-input-container">
        <input
          className='city-input'
          type="text"
          name="city"
          placeholder="Enter city"
          value={input}
          onChange={(event) => setInput(event.target.value)}
        />
        {input.length > 0 && suggestions.length > 0 && (
          <ul className="suggestions">
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
        <a
          className={input === "" ? "secondary" : "secondary disabled"}
          // type="button"
          onClick={() => {
            const randomCity =
              cities[Math.floor(Math.random() * cities.length)];
            setCity(randomCity);
          }}
        >
          Random City
        </a>

        <button className={input === "" ? "disabled" : ""} type="submit">
          Get Weather
        </button>

      </div>
    </form>
  );
}

export default CitySelector;
