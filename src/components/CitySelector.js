import React from "react";
import "../css/city-selector.css";

// CitySelector is a functional component that renders a form for the user to enter a city name
function CitySelector({ setCity }) {
  return (
    // The form has an onSubmit event handler that prevents the default form submission behavior
    // and calls the setCity function with the value entered in the input field
    <form
      className="city-selector"
      onSubmit={(event) => {
        event.preventDefault();
        setCity(event.target.elements.city.value);
      }}
    >
      <h1 className="site-header">Weather by City</h1>
      {/* The input field where the user enters the city name */}
      <input type="text" name="city" placeholder="Enter city" />
      <div className="button-wrapper">
        {/* The button that submits the form */}
        <button type="submit">Get Weather</button>
      </div>
    </form>
  );
}

export default CitySelector;
