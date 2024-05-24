import axios from "axios";
import getEnv from "../utils/getEnv";

// Get the current environment (production or development)
const currentEnv = getEnv();

// Determine the base URL based on the environment
const baseUrl =
  currentEnv === "production"
    ? "https://limitless-lake-38337.herokuapp.com"
    : "http://localhost:3001";

// Function to get a weather quote from GPT
export const aiQuote = async (weather) => {
  // Prompt for GPT to provide weather advice based on given conditions
  const prompt = [
    {
      role: "system",
      content: `You are a weather quote generator for an app called "AI Weather Dashboard".
        This app provides weather data and uses Artificial Intelligence to make useful suggestions based on that data.
        Generate or create an inspirational quote about the weather.
        If you reference a real quote, verify the author's name and provide a reliable source link.
        If you cannot verify the author's name, cite "Generated by AI, prompted by C. Howard" as the author.
        Ensure quotes are funny, relevant to the weather, and 20% of the time, they should be created by AI.
        Provide the quote and author as a JSON object formatted like this:
        {
          "quote": "The weather is wonderful today.",
          "author": "<NAME>",
          "link": "https://www.google.com/search?q=AUTHOR+NAME"
        }
        Only offer google searches for the link
        If the quote is generated by AI, set the link to "https://chulps.github.io/react-gh-pages/".
        Only answer with the quote and author object.`,
    },
  ];

  try {
    // Send a POST request to the OpenAI API endpoint
    const response = await axios.post(`${baseUrl}/api/openai`, {
      model: "gpt-3.5-turbo",
      messages: prompt,
      max_tokens: 100,
      temperature: 0.9,
      top_p: 1,
      frequency_penalty: 0.2,
      presence_penalty: 0.1,
    });

    // Return the response from GPT
    return response.data.choices[0].message.content;
  } catch (error) {
    // Log the error if the request fails
    console.error("Failed to fetch AI-generated advice:", error);
    // Return a thoughtful error message if the request fails
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      if (error.response.status === 400) {
        return "Bad request. Please check your input and try again.";
      } else if (error.response.status === 500) {
        return "Couldn't get quote because of a problem with OpenAI API. Perhaps Chuck needs to top up his API credits? Please check back later.";
      } else {
        return `Error ${error.response.status}: ${error.response.data}`;
      }
    } else if (error.request) {
      // The request was made but no response was received
      return "No response received from the server. Please try again later.";
    } else {
      // Something happened in setting up the request that triggered an Error
      return "An error occurred while processing your request. Please try again later.";
    }
  }
};

export default aiQuote;
