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

  return (
    <>
      <Header />
      <main className="App">
        <div className="content">
          <CitySelector 
            setCity={setCity} 
            results={results} 
            advice={advice} 
          />
          <WeatherDisplay
            city={city}
            onResults={setResults}
            onAdvice={setAdvice}
          />
        </div>
      </main>
      <Footer />
    </>
  );
}

export default App;
