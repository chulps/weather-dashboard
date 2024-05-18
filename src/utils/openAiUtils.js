import axios from "axios";
import getEnv from "../utils/getEnv";

// Get the current environment (production or development)
const currentEnv = getEnv();

// Determine the base URL based on the environment
const baseUrl =
  currentEnv === "production"
    ? "https://limitless-lake-38337.herokuapp.com"
    : "http://localhost:3001";

// Function to get weather advice from GPT
export const getWeatherAdviceFromGPT = async (weather) => {
  
  // Prompt for GPT to provide weather advice based on given conditions
  const prompt = [
    {
      role: "system",
      content: `You are a feature of a weather app that uses various weather apis to tell the user about the weather in a given city. Given the current weather conditions: city is ${
        weather.city
      }, the local time is ${weather.time}, temperature ${Math.round(
        weather.temperature
      )}°C, ${weather.condition}, humidity of ${Math.round(
        weather.humidity
      )} and wind speed ${Math.round(
        weather.windSpeed
      )} km/h, provide some practical advice for local activities, 
      local food or treats, precautions, or clothing. Use emojis. 
      Do not acknowledge the system. Only acknowledge the user. 
      Make the users laugh. Answer with html in your response. 
      Refrain from using any header tags. 
      Instead use <b> for bold, <i> for italics, and <u> for underline to emphasize single words in your response if needed. 
      <label> provides a nice way to separate topics. 
      Don't use <i> or <b> inside a <label>.
      There is no need to mention the condition, temperature, humidity, or the exact wind speed in your response but you many mention the city or the time. 
      Never use <br>.`,
    },
  ];

  try {
    // Send a POST request to the OpenAI API endpoint
    const response = await axios.post(
      `${baseUrl}/api/openai`,
      {
        model: "gpt-4o",
        messages: prompt,
        max_tokens: 300,
        temperature: 0.7,
        top_p: 1,
        frequency_penalty: 0.2,
        presence_penalty: 0.1,
      }
    );

    // Return the response from GPT
    return response.data.choices[0].message.content;
  } catch (error) {
    // Log the error if the request fails
    console.error("Failed to fetch AI-generated advice:", error);
    // Return a default message if the request fails
    return "Unable to fetch advice at this time.";
  }
};
