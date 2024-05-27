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
  targetLanguage
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState(defaultOption);
  const [searchTerm, setSearchTerm] = useState("");
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
      options.filter((option) => 
        option.label.toLowerCase().includes(value) || 
        option.keywords.some(keyword => keyword.toLowerCase().includes(value))
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
            {label && <label htmlFor="search-input">
<TranslationWrapper targetLanguage={targetLanguage}>{label}</TranslationWrapper>

            </label>}

            <input
              id="search-input"
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={handleSearchChange}
            />
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
                {option.label}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomDropdown;
