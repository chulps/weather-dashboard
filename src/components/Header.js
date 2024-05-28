// Header.js
import React, { useState, useEffect } from "react";
import logo from "../images/logo.gif";
import RotatingText from "./RotatingText";
import CustomDropdown from "./CustomDropdown";
import { languages } from "../utils/languages";
import "../css/header.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSun, faMoon } from "@fortawesome/free-solid-svg-icons";

const Header = ({ content, setTargetLanguage }) => {
  const [theme, setTheme] = useState("dark");

  useEffect(() => {
    document.documentElement.className = theme;
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === "dark" ? "light" : "dark"));
  };

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) {
      setTheme(savedTheme);
    }
  }, []);

  const handleLanguageChange = (language) => {
    setTargetLanguage(language);
  };

  return (
    <header>
      <a href="https://chulps.github.io/react-gh-pages/" className="logo-container">
        <RotatingText />
        <img className="logo" src={logo} alt="Chuck Howard" />
      </a>
      <div className="header-right">
        <CustomDropdown
          label={"Search languages"}
          description="Select a language to translate to. Search by keyword, language name,  IETF language tags, or emoji."
          options={languages.sort()}
          onChange={handleLanguageChange}
          defaultOption={navigator.language}
        />
        <button
          onClick={toggleTheme}
          className="theme-toggle tooltip left"
          tooltip={theme === "dark" ? `${content.switchToLightMode}` : `${content.switchToDarkMode}`}
        >
          {theme === "dark" ? <FontAwesomeIcon icon={faSun} /> : <FontAwesomeIcon icon={faMoon} />}
        </button>
      </div>
    </header>
  );
};

export default Header;
