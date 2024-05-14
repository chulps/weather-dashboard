import axios from 'axios';

export const getWeatherAdviceFromGPT = async (weather) => {
    const prompt = [{role: "system", content: `You are a feature of a weather app that uses various weather apis to tell the user about the weather in a given city. Given the current weather conditions: temperature ${weather.temperature}°C, ${weather.condition}, and wind speed ${weather.windSpeed} km/h, provide some practical advice for activities or precautions. Good luck and have fun with your response! Always use at least one emoji in your response. Do not acknowledge the system. Only acknowledge the user. Keep your answers brief when possible.`}];
  
    try {
        const response = await axios.post(
            "https://limitless-lake-38337.herokuapp.com/api/openai", // Adjust this URL to your backend endpoint
            {
                model: "gpt-4o",
                messages: prompt,
                max_tokens: 180,
                temperature: 0.7,
                top_p: 1,
                frequency_penalty: 0,
                presence_penalty: 0,}  
        );
  
        return response.data.choices[0].message.content;
    } catch (error) {
        console.error("Failed to fetch AI-generated advice:", error);
        return "Unable to fetch advice at this time.";
    }
};

