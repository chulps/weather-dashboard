// utils/openAiUtils.js
import axios from "axios";
import getEnv from "../utils/getEnv";

const currentEnv = getEnv();
const baseUrl =
  currentEnv === "production"
    ? "https://limitless-lake-38337.herokuapp.com"
    : "http://localhost:3001";

const cache = new Map();
let lastRequestTime = 0;
const requestThrottleMs = 5000; // 5 seconds

export const getWeatherAdviceFromGPT = async (weather) => {
  const currentTime = Date.now();
  if (currentTime - lastRequestTime < requestThrottleMs) {
    return "Please wait a few seconds before making another request.";
  }

  const cacheKey = JSON.stringify(weather);
  if (cache.has(cacheKey)) {
    return cache.get(cacheKey);
  }

  lastRequestTime = currentTime;

  const prompt = [
    {
      role: "system",
      content: `
You are a JSON weather advice generator for an app called "AI Weather Dashboard".
Here is some weather data for ${weather.city}, 
This is the user's preferred language: ${navigator.language},
current local time: ${weather.time} in ${weather.city},
current local time in user's location: ${new Date().toLocaleTimeString()},
user's current latitude: ${weather.user_latitude},
user's current longitude: ${weather.user_longitude},
Temperature: ${Math.round(weather.temperature)}°C, 
Condition: ${weather.condition}, 
Humidity: ${Math.round(weather.humidity)}%, 
Wind Speed: ${Math.round(weather.windSpeed)} km/h.

Based on this data, give advice on local activities, places, food, precautions, or clothing at the current local time.
Don't recommend a place that is likely to be closed at the current local time.
Be specific.
Respond in the user's preferred language.
Keep responses 150-200 characters in length per topic. Use emojis.
You will recieve this prompt many times so the response needs to always be strictly formatted for consistency.
Your reply should be in a JSON array filled with objects following this exact format for each topic. Provide 1-3 links per topic. Only provide google search links.
Links will be prefixed with "https://www.google.com/search?q=" when the data is parsed.
Link text should be one or two words.
{"advice":[{"label": "Example Topic","p": "Two sentences minimum.","links":[{"text": "Example Text","href": "example+google+search"},{"text": "Example Text","href": "example+google+search"}]}]}`}];

  try {
    const response = await axios.post(`${baseUrl}/api/openai`, {
      model: "gpt-4o",
      messages: prompt,
      max_tokens: 500,
      temperature: 0.7,
      top_p: 1,
      frequency_penalty: 0.2,
      presence_penalty: 0.1,
      response_format: { type: "json_object" }
    });

    const advice = response.data.choices[0].message.content;
    cache.set(cacheKey, advice);
    return advice;
  } catch (error) {
    console.error("Failed to fetch AI-generated advice:", error);
    if (error.response && error.response.status === 400) {
      return "The request was invalid. Please check your input and try again.";
    } else if (error.response && error.response.status === 500) {
      return "We couldn't get advice because of a problem with the OpenAI API. Please try again later.";
    } else {
      return "Unable to fetch advice at this time. Please check your internet connection and try again.";
    }
  }
};

export default getWeatherAdviceFromGPT;
