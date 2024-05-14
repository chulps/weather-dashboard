import React, { useState } from 'react';
import CitySelector from './components/CitySelector';
import WeatherDisplay from './components/WeatherDisplay';
import './App.css'; 

function App() {
  const [city, setCity] = useState('');

  return (
    <div className="App auto-grid-large" style={{placeItems: "center"}}>
      <CitySelector setCity={setCity} />
      <WeatherDisplay city={city} />
    </div>
  );
}

export default App;

