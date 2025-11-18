const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch'); // Make sure node-fetch v2 is installed

const app = express();
const PORT = 5000;

// Enable CORS (Cross-Origin Resource Sharing)
app.use(cors());
app.use(express.json()); // To parse incoming JSON data

// Root route to check if the server is working
app.get('/', (req, res) => {
  res.send('Backend is working!');
});

// Weather route that fetches weather for a given city
app.get('/weather', async (req, res) => {
  const city = req.query.city?.trim();  // Get city from query and trim any extra spaces
  console.log("Requested city:", city); // Log the requested city

  if (!city) return res.status(400).json({ error: "City is required" });

  const weatherApiKey = "7420c53504b4feb58441aef77a2cb465"; // Your OpenWeatherMap API key
  const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&units=metric&appid=${weatherApiKey}`;

  try {
    const weatherResponse = await fetch(weatherUrl);
    const weatherData = await weatherResponse.json();

    console.log("Weather data received:", weatherData); // Log the API response

    // Check if the API response was successful (status code 200)
    if (weatherData.cod !== 200) {
      console.log('Error from OpenWeatherMap:', weatherData.message);
      return res.status(404).json({ error: weatherData.message || "City not found" });
    }

    // Safely access the country information from sys
    const country = weatherData.sys ? weatherData.sys.country : 'Unknown'; // Default to 'Unknown' if country is missing

    // Construct the weather data response
    const weather = {
      city: weatherData.name,
      country: country, // Country information
      temperature: weatherData.main.temp,
      description: weatherData.weather[0].description,
      icon: `https://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png`,
    };

    // Return the formatted weather data as JSON
    res.json(weather);
  } catch (err) {
    console.error("Error fetching weather data:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// Start the server and listen on the specified port
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
