// ActionButtons.js
import React from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLocationDot, faShuffle, faSearch } from "@fortawesome/free-solid-svg-icons";
import TranslationWrapper from "./TranslationWrapper";

const ActionButtons = ({ handleRandomCity, handleLocation, handleFormSubmit, randomButtonDisabled, fetchingLocation, locationFound, input, content, targetLanguage }) => {
  return (
    <div className="button-wrapper">
      <div className="options-wrapper">
        <button
          className={`random-city-button tooltip bottom-right ${input === "" ? "hollow" : "hollow disabled"} ${randomButtonDisabled ? "disabled" : ""}`}
          tooltip={content.randomTooltip}
          type="button"
          onClick={handleRandomCity}
          disabled={randomButtonDisabled}
        >
          <FontAwesomeIcon className="fa-icon" icon={faShuffle} />
          <span>
            <TranslationWrapper targetLanguage={targetLanguage}>
              Random
            </TranslationWrapper>
          </span>
        </button>

        <button
          className={`hollow tooltip bottom-left ${fetchingLocation ? "disabled" : ""}`}
          tooltip="Get weather data for your current location."
          type="button"
          onClick={handleLocation}
          disabled={fetchingLocation}
        >
          <span>
            <FontAwesomeIcon className="fa-icon" icon={faLocationDot} />
          </span>
          <span>
            {fetchingLocation ? (
              <span className="blink">
                <TranslationWrapper targetLanguage={targetLanguage}>
                  Locating...
                </TranslationWrapper>
              </span>
            ) : locationFound ? (
              <span className="blink">
                <TranslationWrapper targetLanguage={targetLanguage}>
                  Found!
                </TranslationWrapper>
              </span>
            ) : (
              <TranslationWrapper targetLanguage={targetLanguage}>
                My Location
              </TranslationWrapper>
            )}
          </span>
        </button>
      </div>

      <button
        style={{ padding: "1em" }}
        className={`tooltip top-left ${input === "" ? "disabled" : ""}`}
        type="submit"
        tooltip={content.searchTooltip}
        onClick={handleFormSubmit}
      >
        <FontAwesomeIcon className="fa-icon" icon={faSearch} />
        <TranslationWrapper targetLanguage={targetLanguage}>
          Search
        </TranslationWrapper>
      </button>
    </div>
  );
};

export default ActionButtons;
