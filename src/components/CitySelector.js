// CitySelector.js
import React, { useState, useEffect } from "react";
import "../css/city-selector.css";
import axios from "axios";
import getEnv from "../utils/getEnv";
import debounce from "lodash/debounce";
import CitySearchInput from "./CitySearchInput";
import ActionButtons from "./ActionButtons";
import RecentSearches from "./RecentSearches";
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
  const [randomButtonClicks, setRandomButtonClicks] = useState(0);
  const [randomButtonDisabled, setRandomButtonDisabled] = useState(false);
  const cities = [
    /* List of cities */
  ];
  const baseUrl =
    currentEnv === "production"
      ? "https://limitless-lake-38337.herokuapp.com"
      : "http://localhost:3001";

  useEffect(() => {
    const loadSuggestions = debounce(async () => {
      if (input.length > 1) {
        try {
          const response = await axios.get(
            `${baseUrl}/api/cities?city=${encodeURIComponent(input)}`
          );
          setSuggestions(response.data);
        } catch (error) {
          console.error(`${content.failedToFetchSuggestions}`, error);
        }
      } else {
        setSuggestions([]);
      }
    }, 2000);

    loadSuggestions();
    return () => loadSuggestions.cancel();
  }, [input, baseUrl, content.failedToFetchSuggestions]);

  const [cachedCities, setCachedCities] = useState([]);
  const [hiddenCities, setHiddenCities] = useState([]);
  const [hasRecentCityCards, setHasRecentCityCards] = useState(true);

  useEffect(() => {
    setRandomButtonDisabled(false);
    const mergedData = { results, advice };
    if (!cachedCities.find((city) => city.results.city === results.city)) {
      setCachedCities((prev) =>
        [...prev, mergedData].filter(
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

  const handleSuggestionClick = (suggestion) => {
    setInput(suggestion.description);
    setSuggestions([]);
    setCity(suggestion.description);
  };

  const handleLocation = async () => {
    setFetchingLocation(true);
    try {
      const position = await new Promise((resolve, reject) =>
        navigator.geolocation.getCurrentPosition(resolve, reject)
      );
      const { latitude, longitude } = position.coords;
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
    try {
      const response = await axios.get(`${baseUrl}/api/location`, {
        params: { lat: latitude, lon: longitude },
      });
      setCity(response.data.city);
      setShowWeather(true);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleFormSubmit = (event) => {
    event.preventDefault();
    handleSubmit();
  };

  const handleRandomCity = () => {
    if (randomButtonDisabled) return;
    setRandomButtonDisabled(true);
    const randomCity = cities[Math.floor(Math.random() * cities.length)];
    setCity(randomCity);
    setShowWeather(true);
    setRandomButtonClicks((prev) => prev + 1);

    if (randomButtonClicks >= 4) {
      setTimeout(() => setRandomButtonClicks(0), 300000);
    } else {
      setTimeout(() => setRandomButtonDisabled(false), 2000);
    }
  };

  const handleCachedCity = (city) => {
    setCity(city);
    setShowWeather(true);
    setTimeout(
      () => document.getElementById("weather-content")?.scrollIntoView(),
      0
    );
  };

  const handleDeleteCachedCity = (cityToDelete) => {
    setHiddenCities((prev) => {
      const newHiddenCities = [...prev, cityToDelete];
      const visibleCities = cachedCities.filter(
        (city) => !newHiddenCities.includes(city.results.city)
      );
      if (visibleCities.length < 1) {
        setShowWeather(false);
        setHasRecentCityCards(false);
      }
      return newHiddenCities;
    });
  };

  return (
    <div className="city-selector-container">
      <div className="city-selector">
        <form className="city-selector-form" onSubmit={handleFormSubmit}>
        <div>
            <label htmlFor="city-search">
              <TranslationWrapper targetLanguage={targetLanguage}>
                About this app...
              </TranslationWrapper>
            </label>
            <h1 className="site-header">
              <TranslationWrapper targetLanguage={targetLanguage}>
                AI Weather Dashboard
              </TranslationWrapper>
            </h1>
            <p className="app-description">
              <TranslationWrapper targetLanguage={targetLanguage}>
                This app provides weather data and uses Artificial Intelligence
                to make useful suggestions based on that data. Play around with
                it and enjoy!
              </TranslationWrapper>
            </p>
          </div>
          <CitySearchInput
            input={input}
            setInput={setInput}
            suggestions={suggestions}
            handleSuggestionClick={handleSuggestionClick}
            handleInputChange={(e) => setInput(e.target.value)}
            content={content}
            targetLanguage={targetLanguage}
          />
          <ActionButtons
            handleRandomCity={handleRandomCity}
            handleLocation={handleLocation}
            handleFormSubmit={handleFormSubmit}
            randomButtonDisabled={randomButtonDisabled}
            fetchingLocation={fetchingLocation}
            input={input}
            content={content}
            targetLanguage={targetLanguage}
          />
        </form>
        {cachedCities.length > 0 && hasRecentCityCards && (
          <RecentSearches
            cachedCities={cachedCities}
            hiddenCities={hiddenCities}
            handleCachedCity={handleCachedCity}
            handleDeleteCachedCity={handleDeleteCachedCity}
            content={content}
            targetLanguage={targetLanguage}
          />
        )}
      </div>
    </div>
  );
}

export default CitySelector;
