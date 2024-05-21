// utils/openAiUtils.js
import axios from "axios";
import getEnv from "../utils/getEnv";

const currentEnv = getEnv();
const baseUrl =
  currentEnv === "production"
    ? "https://limitless-lake-38337.herokuapp.com"
    : "http://localhost:3001";

const cache = new Map();

export const getWeatherAdviceFromGPT = async (weather) => {
  const cacheKey = JSON.stringify(weather);
  if (cache.has(cacheKey)) {
    return cache.get(cacheKey);
  }

  const prompt = [
    {
      role: "system",
      content: `You are a weather advice generator for "AI Weather Dashboard".
      Based on the current weather in ${weather.city} at ${weather.time}: 
      Temperature: ${Math.round(weather.temperature)}°C, 
      Condition: ${weather.condition}, 
      Humidity: ${Math.round(weather.humidity)}%, 
      Wind Speed: ${Math.round(weather.windSpeed)} km/h.
      
      Consider the time of day before giving practical advice on local activities, food, precautions, or clothing using emojis.
      Make the users laugh. Use HTML without headers. Use <b> for bold, <i> for italics, and <u> for underline to emphasize certain words or phrases. 
      Use <label> to separate topics. No <b>, <i>, or <u> tags within a <label>. No <br> tags. Don't mention weather details in the advice, but it's ok to mention the city and the local time.
      Perhaps add a link to do a google search for some attraction or event in the city encased in an <a href="EXAMPLE" target="_blank" > tag.
      Keep sections concise for easy reading.`,
    },
  ];

  try {
    const response = await axios.post(`${baseUrl}/api/openai`, {
      model: "gpt-4o",
      messages: prompt,
      max_tokens: 300,
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
