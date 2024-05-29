// SuggestionsList.js
import React from 'react';
import TranslationWrapper from "./TranslationWrapper";

const SuggestionsList = ({ suggestions, handleSuggestionClick, targetLanguage }) => {
  return (
    <ul className="suggestions">
      {suggestions.map((suggestion) => (
        <li key={suggestion.description} onClick={() => handleSuggestionClick(suggestion)}>
          <TranslationWrapper targetLanguage={targetLanguage}>
            {suggestion.description}
          </TranslationWrapper>
        </li>
      ))}
    </ul>
  );
};

export default SuggestionsList;
