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
      content: `You are a weather advice generator for "AI Weather Dashboard".
      Based on the current weather in ${weather.city} at ${weather.time}: 
      Temperature: ${Math.round(weather.temperature)}°C, 
      Condition: ${weather.condition}, 
      Humidity: ${Math.round(weather.humidity)}%, 
      Wind Speed: ${Math.round(weather.windSpeed)} km/h.
      
      Provide practical advice on local activities, food, precautions, or clothing using emojis.
      Make the users laugh. Use HTML without headers. Use <b> for bold, <i> for italics, and <u> for underline to emphasize certain words or phrases. 
      Use <label> to separate topics. No <br> tags. Don't mention weather details in the advice, but it's ok to mention the city and the local time.
      Keep sections concise for easy reading.`,
    },
  ];

  try {
    // Send a POST request to the OpenAI API endpoint
    const response = await axios.post(`${baseUrl}/api/openai`, {
      model: "gpt-4o",
      messages: prompt,
      max_tokens: 300,
      temperature: 0.7,
      top_p: 1,
      frequency_penalty: 0.2,
      presence_penalty: 0.1,
    });

    // Return the response from GPT
    return response.data.choices[0].message.content;
  } catch (error) {
    // Log the error if the request fails
    console.error("Failed to fetch AI-generated advice:", error);
    // Return a thoughtful error message based on the status code
    if (error.response && error.response.status === 400) {
      return "The request was invalid. Please check your input and try again.";
    } else if (error.response && error.response.status === 500) {
      return "We couldn't get advice because of a problem with the OpenAI API. Please try again later. Maybe chuck needs to add some credits to his API?";
    } else {
      return "Unable to fetch advice at this time. Please check your internet connection and try again.";
    }
  }
};

export default getWeatherAdviceFromGPT;
