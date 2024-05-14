// src/utils/cacheUtils.js

const WEATHER_CACHE_KEY = 'weatherData';
const CACHE_DURATION = 30 * 60 * 1000; // 30 minutes in milliseconds

// Save data to local storage
export const saveToCache = (data) => {
  const cacheEntry = {
    data,
    timestamp: new Date().getTime() // Current time in milliseconds
  };
  localStorage.setItem(WEATHER_CACHE_KEY, JSON.stringify(cacheEntry));
};

// Retrieve data from local storage
export const getFromCache = () => {
  const cacheEntry = localStorage.getItem(WEATHER_CACHE_KEY);
  if (!cacheEntry) return null;

  const { data, timestamp } = JSON.parse(cacheEntry);
  const now = new Date().getTime();

  // Check if the cache is still valid
  if (now - timestamp < CACHE_DURATION) {
    return data;
  } else {
    localStorage.removeItem(WEATHER_CACHE_KEY); // Clean up stale data
    return null;
  }
};
