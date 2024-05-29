// RecentSearches.js
import React from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import TranslationWrapper from "./TranslationWrapper";

const RecentSearches = ({
  cachedCities,
  hiddenCities,
  handleCachedCity,
  handleDeleteCachedCity,
  content,
  targetLanguage,
}) => {
  return (
    <div className="recent-searches">
      <label>{content.recentSearches}</label>
      <div className="recent-cities-grid">
        {cachedCities.slice(2).map((city, index) => {
          if (hiddenCities.includes(city.results.city)) {
            return null;
          }

          const condition = city.results.condition || "";
          const temperature = city.results.temperature || "";
          const cityName = city.results.city || "";

          return (
            <div
              className="recent-city-card"
              onClick={() => handleCachedCity(cityName)}
              key={index}
            >
              <img
                src={city.results.icon}
                alt={`${condition} in ${cityName}`}
              />
              <div>
                <p className="recent-city-header">
                  <TranslationWrapper targetLanguage={targetLanguage}>
                    {cityName}
                  </TranslationWrapper>
                </p>
                <div className="recent-city-data">
                  <small className="font-family-data">
                    {Math.round(temperature)}°C
                  </small>
                  <small className="font-family-data">
                    <TranslationWrapper targetLanguage={targetLanguage}>
                      {condition.charAt(0).toUpperCase() +
                        condition.slice(1).toLowerCase()}
                    </TranslationWrapper>
                  </small>
                </div>
              </div>
              <span
                className="delete-recent-city-button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteCachedCity(cityName);
                }}
              >
                <small
                  tooltip="Remove this city from your recent searches"
                  className="delete-cached-city tooltip"
                >
                  <FontAwesomeIcon icon={faTrash} />
                </small>
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default RecentSearches;
