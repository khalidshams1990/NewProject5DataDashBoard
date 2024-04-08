// main.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import App from './App';
import Layout from './Layout'; // Your layout component with navigation
import ForecastDetails from './ForecastDetails'; // The details component for each day

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<App />} />
        <Route path="forecast/:date" element={<ForecastDetails />} />
      </Route>
    </Routes>
  </BrowserRouter>
);

