import axios from "axios";

// Function to get weather advice from GPT
export const getWeatherAdviceFromGPT = async (weather) => {
  // Prompt for GPT to provide weather advice based on given conditions
  const prompt = [
    {
      role: "system",
      content: `You are a feature of a weather app that uses various weather apis to tell the user about the weather in a given city. Given the current weather conditions: temperature ${weather.temperature}°C, ${weather.condition}, and wind speed ${weather.windSpeed} km/h, provide some practical advice for activities or precautions. Good luck and have fun with your response! Always use at least one emoji in your response. Do not acknowledge the system. Only acknowledge the user. Keep your answers brief when possible. Try to include something that makes the user laugh.`,
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
