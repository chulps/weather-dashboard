// CitySearchInput.js
import React from 'react';
import TranslationWrapper from "./TranslationWrapper";

const CitySearchInput = ({ input, setInput, suggestions, handleSuggestionClick, handleInputChange, content, targetLanguage }) => {
  return (
    <div className="city-input-container tooltip top-right">
      <label htmlFor="city-input" style={{ display: "none" }}>
        <TranslationWrapper targetLanguage={targetLanguage}>
          City
        </TranslationWrapper>
      </label>
      <input
        tooltip={content.inputTooltip}
        className="city-input"
        type="text"
        name="city"
        placeholder={content.searchPlaceholder}
        value={input}
        onChange={handleInputChange}
        id="city-input"
      />
      {input.length > 0 && suggestions.length > 0 && (
        <ul className="suggestions">
          {suggestions.map((suggestion) => (
            <li key={suggestion.description} onClick={() => handleSuggestionClick(suggestion)}>
              <TranslationWrapper targetLanguage={targetLanguage}>
                {suggestion.description}
              </TranslationWrapper>
            </li>
          ))}
        </ul>
      )}
      {input && (
        <button
          className="clear-button secondary small"
          type="button"
          onClick={() => {
            setInput("");
          }}
        >
          <TranslationWrapper targetLanguage={targetLanguage}>
            Clear
          </TranslationWrapper>
        </button>
      )}
    </div>
  );
};

export default CitySearchInput;
