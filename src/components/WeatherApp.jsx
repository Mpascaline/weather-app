import React, { useState, useEffect } from 'react'
import '../styles/WeatherApp.scss'

const SearchIcon = () => (
  <svg 
    width="20" 
    height="20" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round"
  >
    <circle cx="11" cy="11" r="8"></circle>
    <path d="m21 21-4.35-4.35"></path>
  </svg>
)

const getWeatherIcon = (condition) => {
  const icons = {
    'clear': '☀️',
    'clouds': '☁️',
    'rain': '🌧️',
    'drizzle': '🌦️',
    'thunderstorm': '⛈️',
    'snow': '❄️',
    'mist': '🌫️',
    'fog': '🌫️'
  }
  return icons[condition.toLowerCase()] || '☀️'
}

const fetchWeatherData = async (city) => {
  const API_KEY = "2c39027168bcae80bb9c67daa6e356ed"
  const API_URL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
  
  try {
    const response = await fetch(API_URL)
    if (!response.ok) {
      throw new Error('City not found')
    }
    const data = await response.json()
    return {
      location: data.name,
      country: data.sys.country,
      temperature: Math.round(data.main.temp),
      condition: data.weather[0].main,
      description: data.weather[0].description,
      feelsLike: Math.round(data.main.feels_like),
      highTemp: Math.round(data.main.temp_max),
      lowTemp: Math.round(data.main.temp_min),
      humidity: data.main.humidity,
      windSpeed: Math.round(data.wind.speed * 3.6),
      pressure: data.main.pressure,
      icon: getWeatherIcon(data.weather[0].main)
    }
  } catch (error) {
    throw new Error(error.message)
  }
}

const WeatherApp = () => {
  const [weatherData, setWeatherData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchCity, setSearchCity] = useState('')

  const handleFetchWeather = async (city = 'London') => {
    setLoading(true)
    setError(null)
    
    try {
      const data = await fetchWeatherData(city)
      setWeatherData(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchCity.trim()) {
      handleFetchWeather(searchCity.trim())
      setSearchCity('')
    }
  }

  useEffect(() => {
    handleFetchWeather()
  }, [])

  if (loading) {
    return (
      <div className="weather-app">
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Loading weather data...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="weather-app">
        <div className="error-container">
          <div className="error-icon">⚠️</div>
          <h2>Weather data unavailable</h2>
          <p>{error}</p>
          <button onClick={() => handleFetchWeather()} className="retry-btn">
            Try Again
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="weather-app">
      <div className="search-section">
        <form onSubmit={handleSearch} className="search-form">
          <div className="search-input-container">
            <input
              type="text"
              placeholder="Search city"
              value={searchCity}
              onChange={(e) => setSearchCity(e.target.value)}
              className="search-input"
            />
            <button type="submit" className="search-icon-btn">
              <SearchIcon />
            </button>
          </div>
        </form>
      </div>

      {/* Weather Card */}
      <div className="weather-card">
        <div className="weather-icon">
          <span className="icon">{weatherData.icon}</span>
        </div>

        <div className="location">
          <h2>{weatherData.location}</h2>
          <p>{weatherData.country}</p>
        </div>

        <div className="temperature">
          <span className="temp-value">{weatherData.temperature}°</span>
        </div>

        <div className="condition">
          <p className="main-condition">{weatherData.condition}</p>
          <p className="description">{weatherData.description}</p>
        </div>

        <div className="weather-details">
          <div className="feels-like">
            Feels Like: {weatherData.feelsLike}°
          </div>
          
          <div className="high-low">
            H:{weatherData.highTemp}° L:{weatherData.lowTemp}°
          </div>

          {/* <div className="additional-info">
            <div className="info-item">
              <span>city: {weatherData.city}%</span>
            </div>
            <div className="info-item">
              <span>Wind: {weatherData.windSpeed} km/h</span>
            </div>
            <div className="info-item">
              <span>Pressure: {weatherData.pressure} hPa</span>
            </div>
          </div> */}
        </div>
      </div>
    </div>
  )
}

export default WeatherApp