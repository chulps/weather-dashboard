import React from 'react';

function CitySelector({ setCity }) {
  return (
    <form onSubmit={(event) => {
      event.preventDefault();
      setCity(event.target.elements.city.value);
    }}>
      <input type="text" name="city" placeholder="Enter city" />
      <button type="submit">Get Weather</button>
    </form>
  );
}

export default CitySelector;
