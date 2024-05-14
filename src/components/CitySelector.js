import React from 'react';
import '../css/city-selector.css';

function CitySelector({ setCity }) {
  return (
    <form className="city-selector" onSubmit={(event) => {
      event.preventDefault();
      setCity(event.target.elements.city.value);
    }}>
      <h1 className="site-header">Weather by City</h1>
      <input type="text" name="city" placeholder="Enter city" />
      <div className="button-wrapper"><button type="submit">Get Weather</button></div>
    </form>
  );
}

export default CitySelector;
