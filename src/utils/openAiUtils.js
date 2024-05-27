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
You are a weather advice generator for "AI Weather Dashboard".
Here is some weather data for ${weather.city}, 
user's preferred language: ${navigator.language},
current local time: ${weather.time},
user's current latitude: ${weather.user_latitude},
user's current longitude: ${weather.user_longitude},
Temperature: ${Math.round(weather.temperature)}°C, 
Condition: ${weather.condition}, 
Humidity: ${Math.round(weather.humidity)}%, 
Wind Speed: ${Math.round(weather.windSpeed)} km/h.

Consider this data before giving practical advice on local activities, food, precautions, or clothing using emojis.
If the user's latitude and longitude match the name of the city, suggest specific activities that are close to those coordinates.
If the user's latitude and longitude are unknown or do not match the name of the city, don't give advice. Talk about what people do during the local time in that city or other general information about what people do there instead of things to do and where to go.
If it's late at night suggest an indoor activity or nightlife activities instead of outdoor activities.
If the user's coordinates indicate that they are not in that city, tell the user about what life is like in that city and other general information about what people do there instead of things to do and where to go.
Make the users laugh. 
Respond in the user's preferred language.
Use HTML in this format for each topic. Provide multiple links. Always provide google search links.
<label>Example Topic</label>
<p>A sentence or two with helpful advice.</p>
<div>
<a href="https://www.google.com/search?q=example+google+search" target="_blank" rel="noreferrer">Example Link</a>
</div>`,
    },
  ];

  try {
    const response = await axios.post(`${baseUrl}/api/openai`, {
      model: "gpt-4o",
      messages: prompt,
      max_tokens: 400,
      temperature: 0.7,
      top_p: 1,
      frequency_penalty: 0.3,
      presence_penalty: 0.2,
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
