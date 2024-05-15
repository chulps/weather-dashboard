# Weather Dashboard

## Overview
This Weather Dashboard provides real-time weather updates and forecasts for different locations. Utilizing data from OpenWeatherMap and WeatherAPI, it merges and displays temperature, humidity, wind speed, and general weather conditions.

## Features
- Real-time weather updates
- Weather forecasts including temperature, humidity, and wind details
- Supports multiple locations globally
- Desktop notifications for weather alerts (if implemented)

## Technologies Used
- React.js: For building the user interface
- Redux: For managing application state
- Axios: For API requests
- Node.js and Express: Backend server (if applicable)
- Heroku: Hosting the backend
- GitHub Pages: Hosting the frontend

## Getting Started

### Prerequisites
- Node.js
- npm (Node Package Manager)
- Git
- React

### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/chulps/weather-dashboard.git

   also clone the backend in a separate repository
   git clone https://github.com/chulps/portfolio-backend.git

### Navigate to the project directory:
bash
cd weather-dashboard
Install dependencies:
bash
npm install
Start the application:
bash
npm start

### Usage
Enter a city name in the search bar.
View current weather and forecast data displayed on the dashboard.

### API Configuration
The application requires setup for environment variables to manage API keys securely:

Create a .env file in the project root.
Add the following entries:
plaintext

REACT_APP_OPENWEATHER_API_KEY=your_openweathermap_api_key
https://home.openweathermap.org/users/sign_in

REACT_APP_WEATHER_API_KEY=your_weatherapi_com_key
https://www.weatherapi.com/

In the backend repo also create a .env file in the project root.

OPENAI_API_KEY=your_openai_api_key
https://openai.com/api/

OPENAI_API_URL=https://api.openai.com/v1/chat/completions

### To deploy this application on GitHub Pages:

Run:
bash
Copy code
npm run deploy
This builds the application and publishes it to the gh-pages branch of your repository.
Contributing
Contributions are welcome! Please read the contributing guide for details on our code of conduct and the process for submitting pull requests.

### License
This project is licensed under the MIT License - see the LICENSE file for details.

### Acknowledgments
Thanks to OpenWeatherMap and WeatherAPI and OpenAI for providing APIs.
Inspired by the coding challenges at Rehasaku.

### Contact
GitHub: @chulps
Project Links: https://github.com/chulps/weather-dashboard, https://github.com/chulps/portfolio-backend

