import React, { useState } from "react";
import CitySelector from "./components/CitySelector";
import WeatherDisplay from "./components/WeatherDisplay";
import Header from "./components/Header";
import Footer from "./components/Footer";
import "./App.css";
import "./global.css";

function App() {
  const [city, setCity] = useState("");

  return (
    <>
<Header />
      <main className="App" style={{ placeItems: "center" }}>
        <CitySelector setCity={setCity} />
        <WeatherDisplay city={city} />
      </main>
      <Footer />
    </>
  );
}

export default App;
