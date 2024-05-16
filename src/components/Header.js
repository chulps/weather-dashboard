import React from "react";
import logo from "../images/logo.gif";
import RotatingText from "./RotatingText";
import "../css/header.css";
const Header = () => {
  return (
    <header>
      <div className="logo-container">
          <RotatingText />
          <img className="logo" src={logo} alt="Chuck Howard" />
      </div>
    </header>
  );
};

export default Header;
