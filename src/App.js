// src/App.js
import React, { useState, useEffect } from 'react';
import SearchBar from './components/SearchBar';
import WeatherCard from './components/WeatherCard';
import { fetchWeather } from './api/weatherAPI';
import { useDarkMode } from './hooks/useDarkMode';
import './styles/App.css';

const App = () => {
  const [weather, setWeather] = useState(null);
  const [error, setError] = useState('');
  const [isDarkMode, setIsDarkMode] = useDarkMode();
  const [currentLocation, setCurrentLocation] = useState(''); // Track the current location

  useEffect(() => {
    const fetchCurrentLocationWeather = async () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(async (position) => {
          try {
            const data = await fetchWeather(null, position.coords.latitude, position.coords.longitude);
            setWeather(data);
            setCurrentLocation(data.name); // Update current location
          } catch (err) {
            setError('Could not fetch weather data for your location. Please try again.');
          }
        });
      } else {
        setError('Geolocation is not supported by this browser.');
      }
    };

    fetchCurrentLocationWeather();
  }, []);

  const handleSearch = async (location) => {
    try {
      const data = await fetchWeather(location);
      setWeather(data);
      setError('');
      setCurrentLocation(data.name); // Update current location with searched location
    } catch (err) {
      setError('Could not fetch weather data. Please try again.');
    }
  };

  return (
    <div className={`app ${isDarkMode ? 'dark' : 'light'}`}>
      <button className="toggle-button btn btn-primary" onClick={() => setIsDarkMode(!isDarkMode)}>
        Toggle to {isDarkMode ? 'Light' : 'Dark'} Mode
      </button>
      <SearchBar onSearch={handleSearch} />
      {error && <p className="error text-danger">{error}</p>}
      {weather && <WeatherCard weather={weather} />}
    </div>
  );
};

export default App;
