import React, { useState, useEffect } from 'react';
import './App.css';
import { Header } from './Header';
import { NavBar } from './NavBar';
import { Bar, Line } from 'react-chartjs-2';
import 'chart.js/auto';
import { Routes, Route, Link } from 'react-router-dom';
import ForecastDetails from './ForecastDetails';
import Layout from './Layout'; // And this component


const ACCESS_KEY = import.meta.env.VITE_APP_ACCESS_KEY;

function App() {
  const [weatherData, setWeatherData] = useState([]);
  const [currentWeather, setCurrentWeather] = useState(null);
  const [windData, setWindData] = useState(null);
  const [currentTemp, setCurrentTemp] = useState(null);
  const [currentSun, setCurrentSun] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [precipitationFilter, setPrecipitationFilter] = useState(0);
  const [filteredWeatherData, setFilteredWeatherData] = useState([]);
  const [barChartData, setBarChartData] = useState({
    labels: [],
    datasets: [{ label: 'Temperature', data: [] }],
  });
 const [lineChartData, setLineChartData] = useState({
    labels: [],
    datasets: [{ label: 'Probability of Precipitation', data: [] }],
  });



  useEffect(() => {
    // Fetch daily forecast data
    const fetchForecastData = async () => {
      try {
        const response = await fetch(`https://api.weatherbit.io/v2.0/forecast/daily?city=NewYork,NY&units=I&days=7&key=${ACCESS_KEY}`);
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

  useEffect(() => {
    // Apply filters whenever weatherData, searchTerm, or precipitationFilter changes
    const filtered = weatherData
      .filter((item) => item.valid_date.includes(searchTerm))
      .filter((item) => item.pop >= precipitationFilter);

    setFilteredWeatherData(filtered);
  }, [weatherData, searchTerm, precipitationFilter]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleFilterChange = (e) => {
    setPrecipitationFilter(Number(e.target.value));
  };

  useEffect(() => {
    // Generate chart data after fetching the weather data
    const tempLabels = weatherData.map(item => item.valid_date);
    const tempData = weatherData.map(item => item.temp);
    const popData = weatherData.map(item => item.pop);

    setBarChartData({
      labels: tempLabels,
      datasets: [{ label: 'Temperature', data: tempData }]
    });

    setLineChartData({
      labels: tempLabels,
      datasets: [{ label: 'Probability of Precipitation', data: popData }]
    });
  }, [weatherData]);

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
              <h2>Current Temperature is {currentTemp.temp}°F</h2>
              <p>{currentTemp.description}</p>
            </div>
          )}
           {/* Current sun Card */}
        {currentSun && (
            <div className="summary-card">
              <h2>DateTime: {currentSun.datetime} </h2>
              <p>Sunrises at {currentSun.sunrise}</p>
              <p>Sunsets at {currentSun.sunset}</p>
            </div>
          )}
          </div>
          <div className="content-container">
        <div className="weather-card">
        <div className="search-filter-container">
          <input
            type="date"
            value={searchTerm}
            onChange={handleSearchChange}
            placeholder="Enter Date"
          />
          <label>
            Precipitation Filter:
            <input
              type="range"
              min="0"
              max="100"
              step="10"
              value={precipitationFilter}
              onChange={handleFilterChange}
            />
            {precipitationFilter}%
          </label>
        </div>
          <ul>
          {filteredWeatherData.map((forecast) => (
                  <li key={forecast.valid_date}>
                    <div>Date: {forecast.valid_date}</div>
                    <div>High Temperature: {forecast.high_temp}°F</div>
                    <div>Low Temperature: {forecast.low_temp}°F</div>
                    <div>Probability of rain: {forecast.pop}%</div>
                    <div>Weather: {forecast.weather.description}</div>
                    <Link to={`/forecast/${forecast.valid_date}`}>View Details</Link>
                  </li>
                ))}
              </ul>
            </div>
            <div className="chart-container">
              <Bar data={barChartData} />
              <Line data={lineChartData} />
            </div>
          </div>
        </div>
        {/* Define your routes outside the `background-image` if it's a layout component */}
        <Routes>
        <Route path="/forecast/:date" element={<ForecastDetails weatherData={weatherData} />} />
        </Routes>
      </div>

  );
}

export default App;
