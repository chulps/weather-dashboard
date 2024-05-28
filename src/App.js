// App.js
import React, { useState, useEffect, useCallback, useRef } from "react";
import CitySelector from "./components/CitySelector";
import WeatherDisplay from "./components/WeatherDisplay";
import Header from "./components/Header";
import Footer from "./components/Footer";
import getEnv from "./utils/getEnv";
import "./App.css";
import "./global.css";

const currentEnv = getEnv();
const baseUrl =
  currentEnv === "production"
    ? "https://limitless-lake-38337.herokuapp.com"
    : "http://localhost:3001";

function App() {
  const [city, setCity] = useState("");
  const [results, setResults] = useState([]);
  const [advice, setAdvice] = useState("");
  const [showWeather, setShowWeather] = useState(false);
  const [unit, setUnit] = useState("metric");
  const [targetLanguage, setTargetLanguage] = useState(navigator.language);
  const [content, setContent] = useState({
    aboutTheWeather: "About the weather...",
    aboutThisApp: "About this app...",
    description: "This app provides weather data and uses Artificial Intelligence to make useful suggestions based on that data. Play around with it and enjoy!",
    error: "Error:",
    errorFetchingAdviceFromOpenAi: "Error fetching advice from OpenAI.",
    errorFetchingQuote: "Error fetching quote999.",
    failedToFetchSuggestions: "Failed to fetch suggestions:",
    found: "Found!",
    header: "AI Weather Dashboard",
    inputTooltip: "Enter a city name or click the button below to get your location ↓",
    lastUpdated: "Last updated:",
    loading: "Loading...",
    loadingMessagePleaseWait: "Please wait...",
    locating: "Locating...",
    locationBlocked: "Your browser settings are preventing the AI Weather Dashboard from finding your location. Please change your settings to enable this feature.",
    myLocationButton: "My Location",
    pleaseWait: "Please wait...",
    randomButton: "Random",
    randomTooltip: "🎲 Roll the dice and see what happens!",
    recentSearches: "Recent Searches",
    refreshQuoteTooltip: "↻ Refresh the quote",
    searchButton: "Search",
    searchPlaceholder: "Enter city",
    searchTooltip: "↖︎ Enter a city into the input field above",
    switchToDarkMode: "Switch to dark mode",
    switchToLightMode: "Switch to light mode",
    tryRefreshing: "Try refreshing the page.",
    units: "Units",
    warning: "Oops!:",
    weatherCondition: "Condition",
    weatherHumidity: "Humidity",
    weatherWindSpeed: "Wind speed",
    who: "Who?",
    kmh: "km/h",
    mph: "mph",
    minuteAgo: "minute ago",
    minutesAgo: "minutes ago",
    secondAgo: "second ago", 
    secondsAgo: "seconds ago",
  });

  const translationsFetched = useRef({});

  const translateContent = async (content, targetLanguage) => {
    const translations = await Promise.all(
      Object.entries(content).map(async ([key, value]) => {
        const response = await fetch(`${baseUrl}/api/translate`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ text: value, targetLanguage }),
        });
        const data = await response.json();
        return [key, data.translatedText];
      })
    );
    return Object.fromEntries(translations);
  };

  const fetchContent = useCallback(
    async (language) => {
      const userLanguage = language || navigator.language.split("-")[0];
      console.log("Fetching content for language:", userLanguage);
      if (!translationsFetched.current[userLanguage]) {
        const translatedContent = await translateContent(content, userLanguage);
        setContent(translatedContent);
        translationsFetched.current[userLanguage] = true;
      }
    },
    [content]
  );

  useEffect(() => {
    fetchContent(targetLanguage);
  }, [targetLanguage, fetchContent]);

  return (
    <>
      <Header setUnit={setUnit} unit={unit} content={content} setTargetLanguage={setTargetLanguage} />
      <main className="App">
        <div className="content">
          <CitySelector
            setCity={setCity}
            results={results}
            advice={advice}
            setShowWeather={setShowWeather}
            content={content}
            targetLanguage={targetLanguage}
          />
          <WeatherDisplay
            city={city}
            onResults={setResults}
            onAdvice={setAdvice}
            showWeather={showWeather}
            setShowWeather={setShowWeather}
            unit={unit}
            setUnit={setUnit}
            content={content}
            targetLanguage={targetLanguage}
          />
        </div>
      </main>
      <Footer content={content} />
    </>
  );
}

export default App;
