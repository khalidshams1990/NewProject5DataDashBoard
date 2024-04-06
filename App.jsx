import { useState, useEffect } from 'react';
import './App.css';
import { Header } from './Header';
import { NavBar } from './NavBar';

const ACCESS_KEY = import.meta.env.VITE_APP_ACCESS_KEY;

function App() {
  const [weatherData, setWeatherData] = useState([]);
  const [currentWeather, setCurrentWeather] = useState(null);
  const [windData, setWindData] = useState(null);
  const [currentTemp, setCurrentTemp] = useState(null);
  const [currentSun, setCurrentSun] = useState(null);



  useEffect(() => {
    // Fetch daily forecast data
    const fetchForecastData = async () => {
      try {
        const response = await fetch(`https://api.weatherbit.io/v2.0/forecast/daily?city=NewYork,NY&units=I&key=${ACCESS_KEY}`);
        const data = await response.json();
        setWeatherData(data.data);
      } catch (error) {
        console.error("Error fetching forecast data:", error);
      }
    };

    // Fetch current weather data
    const fetchCurrentWeather = async () => {
      try {
        const response = await fetch(`https://api.weatherbit.io/v2.0/current?city=NewYork,NY&units=I&key=${ACCESS_KEY}&include=minutely`);
        const data = await response.json();
        const current = data.data[0];
        setCurrentWeather({
          city: current.city_name,
          state: current.state_code,
          country: current.country_code,
        });
        setWindData({
          speed: current.wind_spd,
          direction: current.wind_cdir,
        });
        setCurrentTemp({
          temp: current.temp,
          description: current.weather.description,
        });
        setCurrentSun({
          sunrise: current.sunrise,
          sunset: current.sunset,
          datetime: current.datetime,
        });
      } catch (error) {
        console.error("Error fetching current weather data:", error);
      }
    };

    fetchForecastData();
    fetchCurrentWeather();
  }, []);

  return (
    <div className="App">
      <div className="background-image">
        <div className="card-section">
          <Header />
          <NavBar />
        </div>
        <div className="summary-cards-container">
        {/* Current Weather Card */}
        {currentWeather && (
            <div className="summary-card">
              <h2>Current Weather in {currentWeather.city}</h2>
              <p>{currentWeather.state}, {currentWeather.country}</p>
            </div>
          )}
          {/* Wind Data Card */}
          {windData && (
            <div className="summary-card">
              <h2>Wind Conditions</h2>
              <p>Speed: {windData.speed} mph</p>
              <p>Direction: {windData.direction}</p>
            </div>
          )}
          {/* Current temp Card */}
        {currentTemp && (
            <div className="summary-card">
              <h2>Current Temperature is {currentTemp.temp}</h2>
              <p>{currentTemp.description}</p>
            </div>
          )}
           {/* Current sun Card */}
        {currentSun && (
            <div className="summary-card">
              <h2>DateTime: {currentSun.datetime} </h2>
              <h2>Sunrises at {currentSun.sunrise}</h2>
              <h2>Sunsets at {currentSun.sunset}</h2>
            </div>
          )}
          </div>
        <div className="weather-card">
          <ul>
            {weatherData.map((forecast, index) => (
              <li key={index}>
                <div>Date: {forecast.valid_date}</div>
                <div>High Temperature: {forecast.high_temp}°F</div>
                <div>Low Temperature: {forecast.low_temp}°F</div>
                <div>Probability of rain: {forecast.pop}%</div>
                <div>Weather: {forecast.weather.description}</div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default App;
