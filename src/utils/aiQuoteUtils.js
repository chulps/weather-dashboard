import axios from "axios";

// Function to get weather advice from GPT
export const aiQuote = async (weather) => {
  // Prompt for GPT to provide weather advice based on given conditions
  const prompt = [
    {
      role: "system",
      content: `You are a weather quote generator. Provide a quote about the weather from any culture, language, writer, celebrity, character in a movie, poet, or song. You could also create your own as long as your credit yourself as the author. Provide the quote and author as a json object formatted like this {"quote": "The weather is wonderful today.", "author": "<NAME>"}. Only answer with the quote and author object.`,
    },
  ];

  try {
    // Send a POST request to the OpenAI API endpoint
    const response = await axios.post(
      "https://limitless-lake-38337.herokuapp.com/api/openai",
      {
        model: "gpt-4o",
        messages: prompt,
        max_tokens: 150,
        temperature: 0.9,
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
