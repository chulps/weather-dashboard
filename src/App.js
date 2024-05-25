import React, { useState } from "react";
import CitySelector from "./components/CitySelector";
import WeatherDisplay from "./components/WeatherDisplay";
import Header from "./components/Header";
import Footer from "./components/Footer";
import "./App.css";
import "./global.css";

function App() {
  const [city, setCity] = useState("");
  const [results, setResults] = useState([]);
  const [advice, setAdvice] = useState("");
  const [showWeather, setShowWeather] = useState(false);
  const [unit, setUnit] = useState("metric"); // New state for unit type

  return (
    <>
      <Header setUnit={setUnit} unit={unit} />
      <main className="App">
        <div className="content">
          <CitySelector 
            setCity={setCity} 
            results={results} 
            advice={advice}
            setShowWeather={setShowWeather}  // Pass setShowWeather here
          />
          <WeatherDisplay
            city={city}
            onResults={setResults}
            onAdvice={setAdvice}
            showWeather={showWeather}
            setShowWeather={setShowWeather}  // Pass setShowWeather here
            unit={unit} // Pass the unit to WeatherDisplay
            setUnit={setUnit} // Pass setUnit to WeatherDisplay
          />
        </div>
      </main>
      <Footer />
    </>
  );
}

export default App;
