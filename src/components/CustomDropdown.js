// CustomDropdown.js
import React, { useState, useEffect, useRef } from "react";
import "../css/custom-dropdown.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown, faChevronUp } from "@fortawesome/free-solid-svg-icons";
import TranslationWrapper from "./TranslationWrapper";

const CustomDropdown = ({
  options,
  onChange,
  defaultOption,
  description,
  label,
  targetLanguage,
  content
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState(defaultOption);
  const [searchTerm, setSearchTerm] = useState(null);
  const [filteredOptions, setFilteredOptions] = useState(options);
  const dropdownRef = useRef(null);

  const toggleDropdown = () => setIsOpen(!isOpen);

  const handleOptionClick = (option) => {
    setSelectedOption(option.value);
    onChange(option.value);
    setIsOpen(false);
  };

  const handleSearchChange = (event) => {
    const value = event.target.value.toLowerCase();
    setSearchTerm(value);
    setFilteredOptions(
      options.filter(
        (option) =>
          option.label.toLowerCase().includes(value) ||
          option.keywords.some((keyword) =>
            keyword.toLowerCase().includes(value)
          )
      )
    );
  };

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const selectedOptionLabel = options.find(
    (option) => option.value === selectedOption
  )?.label;

  return (
    <div className="custom-dropdown" ref={dropdownRef}>
      <div className="custom-dropdown-selected" onClick={toggleDropdown}>
        <span className="selected-label">{selectedOptionLabel}</span>
        <span className="icon">
          {isOpen ? (
            <FontAwesomeIcon icon={faChevronUp} />
          ) : (
            <FontAwesomeIcon icon={faChevronDown} />
          )}
        </span>
      </div>
      {isOpen && (
        <div className="custom-dropdown-options-container">
          <div className="custom-dropdown-search">
            <div className="menu-header">
              {label && (
                <label htmlFor="search-input">
                  <TranslationWrapper targetLanguage={targetLanguage}>
                    {label}
                  </TranslationWrapper>
                </label>
              )}

              {searchTerm ? (
                <small className="system-message info">
                  {content.searchBarTip}
                </small>
              ) : null}
            </div>

            <div className="language-search-input-container">
              {console.log("searchTerm" + searchTerm)}
              <input
                id="search-input"
                type="text"
                placeholder={content.searchPlaceholder}
                value={searchTerm}
                onChange={handleSearchChange}
                onKeyDown={(e) => {
                  if (e.shiftKey && e.key === "Backspace") {
                    setSearchTerm("");
                  }
                }}
              />
              {searchTerm !== "" && (
                <button
                  className="small secondary language-search-clear-button"
                  onClick={() => setSearchTerm("")}
                >
                  <TranslationWrapper targetLanguage={targetLanguage}>
                    Clear
                  </TranslationWrapper>
                </button>
              )}
            </div>

            <TranslationWrapper targetLanguage={targetLanguage}>
              {description && <p>{description}</p>}
            </TranslationWrapper>
            <hr />
          </div>
          <div className="custom-dropdown-options">
            {filteredOptions.map((option) => (
              <div
                key={option.value}
                className="custom-dropdown-option"
                onClick={() => handleOptionClick(option)}
              >
                <TranslationWrapper targetLanguage={targetLanguage}>
                  {option.label}
                </TranslationWrapper>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomDropdown;
