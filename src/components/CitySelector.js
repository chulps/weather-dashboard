import React, { useState, useEffect } from "react";
import "../css/city-selector.css";
import axios from "axios";

function CitySelector({ setCity }) {
  const [input, setInput] = useState("");
  const [suggestions, setSuggestions] = useState([]);

  useEffect(() => {
    const loadSuggestions = async () => {
      if (input.length > 2) {
        try {
          const response = await axios.get(
            `https://api.weatherapi.com/v1/search.json?key=${process.env.REACT_APP_WEATHER_API_KEY}&q=${input}`
          );
          setSuggestions(response.data);
        } catch (error) {
          console.error("Failed to fetch suggestions:", error);
        }
      } else {
        setSuggestions([]);
      }
    };
    loadSuggestions();
  }, [input]);

  return (
    <form
      className="city-selector"
      onSubmit={(event) => {
        event.preventDefault();
        setCity(event.target.elements.city.value);
        setInput("");
      }}
    >
      <h1 className="site-header">Weather by City</h1>
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
          <ul className="suggestions">
            {suggestions.map((suggestion) => (
              <li
                key={suggestion.id}
                onClick={() => {
                  setInput(`${suggestion.name}, ${suggestion.region}`);
                  setSuggestions([]);
                }}
              >
                {suggestion.name}, {suggestion.region}, {suggestion.country}
              </li>
            ))}
          </ul>
        )}
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
      </div>

      <div className="button-wrapper">
        <button type="submit">Get Weather</button>
      </div>
    </form>
  );
}

export default CitySelector;
