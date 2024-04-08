// ForecastDetails.jsx
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Header } from './Header';
import { NavBar } from './NavBar';

const ACCESS_KEY = import.meta.env.VITE_APP_ACCESS_KEY;


const ForecastDetails = () => {
  const { date } = useParams();
  const [detail, setDetail] = useState(null);

  useEffect(() => {
    // Assuming you have a function to fetch data by date
    const fetchDataForDate = async (date) => {
      // Fetch the data for the specified date and set it to state
      // For now, let's assume you're using the same URL structure to fetch individual date data.
      const response = await fetch(`https://api.weatherbit.io/v2.0/forecast/daily?city=NewYork,NY&units=I&days=7&key=${ACCESS_KEY}&date=${date}`);
      const data = await response.json();
      setDetail(data.data.find((d) => d.valid_date === date));
    };

    if (date) {
      fetchDataForDate(date);
    }
  }, [date]);

  if (!detail) {
    return <div>Loading or no forecast available for this date...</div>;
  }

  return (
      <div className="background-image">
        <div className="card-section">
          <Header />
          <NavBar />
        </div>
     <div className="detail-container">
      <div className="detail-card">
      <h1>Weather Details for {date}</h1>
      {/* Render the details of the weather for 'date' */}
      <div>High Temperature: {detail.high_temp}°F</div>
      <div>Low Temperature: {detail.low_temp}°F</div>
      <div>Probability of Precepitation: {detail.pop}%</div>
      <div>Wind Speed: {detail.wind_spd} MPH</div>
      <div>wind Direction: {detail.wind_cdir}</div>
      <div>Weather: {detail.weather.description}</div>
      <div>wind Direction: {detail.wind_cdir}</div>
    </div>
    </div>
    </div>
  );
};

export default ForecastDetails;
