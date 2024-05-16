import React from "react";
import logo from "../images/logo.gif";
import RotatingText from "./RotatingText";
import "../css/header.css";

const Header = () => {
  return (
    <header>
      <a href="https://chulps.github.io/react-gh-pages/" className="logo-container">
          <RotatingText />
          <img className="logo" src={logo} alt="Chuck Howard" />
      </a>
    </header>
  );
};

export default Header;
