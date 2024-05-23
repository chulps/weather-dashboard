// src/utils/geoLocation.js
let geoLocationLatitude = null;
let geoLocationLongitude = null;

export const setGeoLocation = (latitude, longitude) => {
  geoLocationLatitude = latitude;
  geoLocationLongitude = longitude;
};

export const getGeoLocationLatitude = () => geoLocationLatitude;
export const getGeoLocationLongitude = () => geoLocationLongitude;