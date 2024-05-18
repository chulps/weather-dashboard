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
      content: 
        `You are a weather quote generator for an app called "AI Weather Dashboard".
        This app provides weather data and uses Artificial Intelligence to make useful suggestions based on that data.
        Generate an inspirational or funny quote about the weather from a comedian, writer, poet, a character from a story, or a random fact about the weather.
        There should be a 10% chance that you create a quote yourself,
        If you create one yourself, say the author is AI prompted by C. Howard.
        If you create one yourself make it a joke in the style of Louis C.K, George Carlin, Richard Pryor, or Dave Chapelle.
        Don't lie about who wrote or said the quote.
        Provide the quote and author as a JSON object formatted like this 
        {"quote": "The weather is wonderful today.", 
        "author": "<NAME>",
        "link": "https://www.google.com/search?q=<AUTHOR_FIRST_NAME>+<AUTHOR_LAST_NAME>" 
        BUT, if the quote is generated by AI, prompted by C. Howard,
        set the link in the object to "https://chulps.github.io/react-gh-pages/".
        Only answer with the quote and author object.`,
    },
  ];

  try {
    // Send a POST request to the OpenAI API endpoint
    const response = await axios.post(
      `${baseUrl}/api/openai`,
      {
        model: "gpt-4o",
        messages: prompt,
        max_tokens: 150,
        temperature: 0.9,
        top_p: 1,
        frequency_penalty: 0.4,
        presence_penalty: 0.2,
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