// Header.js
import React, { useState, useEffect } from "react";
import logo from "../images/logo.gif";
import RotatingText from "./RotatingText";
import CustomDropdown from "./CustomDropdown";
import { languages } from "../utils/languages";
import "../css/header.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSun, faMoon } from "@fortawesome/free-solid-svg-icons";

const Header = ({ content, setTargetLanguage, targetLanguage }) => {
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
      <a
        href="https://chulps.github.io/react-gh-pages/"
        className="logo-container"
      >
        <RotatingText />
        <img className="logo" src={logo} alt="Chuck Howard" />
      </a>
      <div className="header-right">
        <CustomDropdown
          content={content}
          label={content.searchLanguage}
          description={content.searchLanguageDescription}
          options={languages.sort()}
          onChange={handleLanguageChange}
          defaultOption={navigator.language}
          targetLanguage={targetLanguage}
        />
        <button
          onClick={toggleTheme}
          className="theme-toggle tooltip bottom-left"
          tooltip={
            theme === "dark"
              ? `${content.switchToLightMode}`
              : `${content.switchToDarkMode}`
          }
          style={{
            background: theme === "dark" ? "" : "var(--white)",
            color: theme === "dark" ? "" : "var(--royal-200)",
          }}
        >
          {theme === "dark" ? (
            <FontAwesomeIcon icon={faSun} />
          ) : (
            <FontAwesomeIcon icon={faMoon} />
          )}
        </button>
      </div>
    </header>
  );
};

export default Header;
