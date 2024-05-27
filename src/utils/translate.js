import axios from 'axios';
import getEnv from './getEnv';

const currentEnv = getEnv();
const baseUrl = currentEnv === 'production'
  ? 'https://limitless-lake-38337.herokuapp.com'
  : 'http://localhost:3001';

export const translateText = async (text, targetLanguage) => {
  try {
    const response = await axios.post(`${baseUrl}/api/translate`, {
      text,
      targetLanguage,
    });
    return response.data.translatedText;
  } catch (error) {
    console.error("Error translating text:", error);
    return text; // Return the original text if translation fails
  }
};
