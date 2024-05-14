import React, { useState } from 'react';
import CitySelector from './components/CitySelector';
import WeatherDisplay from './components/WeatherDisplay';
import './App.css'; 

function App() {
  const [city, setCity] = useState('');  // Default city or empty string

  return (
    <div className="App">
      <CitySelector setCity={setCity} />
      <WeatherDisplay city={city} />
    </div>
  );
}

export default App;

