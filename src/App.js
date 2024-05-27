import React, { useState, useEffect } from "react";
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
  const [content, setContent] = useState({
    header: "AI Weather Dashboard",
    description: "This app provides weather data and uses Artificial Intelligence to make useful suggestions based on that data. Play around with it and enjoy!",
    searchPlaceholder: "Enter city",
    randomButton: "Random",
    myLocationButton: "My Location",
    searchButton: "Search",
    recentSearches: "Recent Searches",
    lastUpdated: "Last updated:",
    loading: "Loading...",
    pleaseWait: "Please wait...",
    error: "Error:",
    warning: "Oops!:",
    aboutThisApp: "About this app...",
    aboutTheWeather: "About the weather...",
    errorFetchingQuote: "Error fetching quote.",
    tryRefreshing: "Try refreshing the page.",
    loadingMessagePleaseWait: "Please wait...",
    errorFetchingAdviceFromOpenAi: "Error fetching advice from OpenAI.",
    weatherCondition: "Condition",
    weatherHumidity: "Humidity",
    weatherWindSpeed: "Wind speed",
    units: "Units",
    secondAgo: "Second ago",  
    secondsAgo: "Seconds ago",
    minuteAgo: "Minute ago",
    minutesAgo: "Minutes ago",
    who: "Who?",
    switchToLightMode: "Switch to light mode",
    switchToDarkMode: "Switch to dark mode",
  });

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

  const fetchContent = async (language) => {
    const userLanguage = language || navigator.language.split('-')[0];
    if (userLanguage !== "en") {
      const translatedContent = await translateContent(content, userLanguage);
      setContent(translatedContent);
    }
  };

  useEffect(() => {
    fetchContent();
  }, []);

  // Function to simulate language change
  const simulateLanguageChange = (language) => {
    fetchContent(language);
  };

  return (
    <>
      <Header setUnit={setUnit} unit={unit} content={content} />
      <main className="App">
        <div className="content">
          <CitySelector 
            setCity={setCity} 
            results={results} 
            advice={advice}
            setShowWeather={setShowWeather}
            content={content}
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
          />
          {/* Button to simulate language change for testing */}
          {/* <button onClick={() => simulateLanguageChange('ja')}>Simulate Japanese</button> */}
          {/* <button onClick={() => simulateLanguageChange('en')}>Simulate English</button> */}
        </div>
      </main>
      <Footer content={content} />
    </>
  );
}

export default App;
