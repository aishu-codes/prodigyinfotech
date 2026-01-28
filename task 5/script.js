// script.js - Weather App using OpenWeatherMap API (fetch + simple UI updates)
//
// IMPORTANT:
// 1) Get a free API key from https://openweathermap.org/api
// 2) Replace 'YOUR_API_KEY_HERE' below with your API key.
// NOTE: For production, do NOT embed API keys in client-side code — use a server or proxy.

const API_KEY = 'YOUR_API_KEY_HERE'; // <- REPLACE this with your key

// DOM elements
const form = document.getElementById('search-form');
const cityInput = document.getElementById('city');
const messageEl = document.getElementById('message');
const weatherCard = document.getElementById('weather-card');
const cityNameEl = document.getElementById('city-name');
const temperatureEl = document.getElementById('temperature');
const conditionEl = document.getElementById('condition');
const iconEl = document.getElementById('weather-icon');
const feelsLikeEl = document.getElementById('feels-like');
const humidityEl = document.getElementById('humidity');
const windEl = document.getElementById('wind');

// Helper: show message (info or error)
function showMessage(text, isError = false) {
  messageEl.textContent = text;
  messageEl.classList.toggle('error', isError);
}

// Helper: clear weather display
function clearWeather() {
  weatherCard.classList.add('hidden');
  cityNameEl.textContent = '';
  temperatureEl.textContent = '--°C';
  conditionEl.textContent = '--';
  iconEl.src = '';
  iconEl.alt = '';
  feelsLikeEl.textContent = '';
  humidityEl.textContent = '';
  windEl.textContent = '';
}

// Fetch weather data for a city
async function fetchWeather(city) {
  if (!API_KEY || API_KEY === 'YOUR_API_KEY_HERE') {
    showMessage('Please set your OpenWeatherMap API key in script.js', true);
    return;
  }

  showMessage('Fetching weather...', false);
  clearWeather();

  const endpoint = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=metric`;

  try {
    const resp = await fetch(endpoint);
    if (!resp.ok) {
      // Try to parse error details
      const errBody = await resp.json().catch(()=>null);
      const errMsg = (errBody && errBody.message) ? errBody.message : `HTTP ${resp.status}`;
      showMessage(`Error: ${errMsg}`, true);
      return;
    }

    const data = await resp.json();

    // Safety checks
    if (!data || !data.main || !data.weather || !data.weather[0]) {
      showMessage('Unexpected response format from API', true);
      return;
    }

    // Populate UI
    const cityName = `${data.name}${data.sys && data.sys.country ? ', ' + data.sys.country : ''}`;
    const temp = Math.round(data.main.temp);
    const condition = data.weather[0].description || data.weather[0].main;
    const iconCode = data.weather[0].icon; // e.g. "04d"
    const feels = data.main.feels_like !== undefined ? Math.round(data.main.feels_like) : null;
    const humidity = data.main.humidity;
    const windSpeed = data.wind && data.wind.speed !== undefined ? data.wind.speed : null;

    cityNameEl.textContent = cityName;
    temperatureEl.textContent = `${temp}°C`;
    conditionEl.textContent = condition;
    iconEl.src = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
    iconEl.alt = condition;
    feelsLikeEl.textContent = feels !== null ? `Feels like: ${feels}°C` : '';
    humidityEl.textContent = humidity !== undefined ? `Humidity: ${humidity}%` : '';
    windEl.textContent = windSpeed !== null ? `Wind: ${windSpeed} m/s` : '';

    weatherCard.classList.remove('hidden');
    showMessage('', false);
  } catch (err) {
    console.error(err);
    showMessage('Network error. Please try again.', true);
  }
}

// Form submit handler
form.addEventListener('submit', (e) => {
  e.preventDefault();
  const city = cityInput.value.trim();
  if (!city) {
    showMessage('Please enter a city name', true);
    return;
  }
  fetchWeather(city);
});

// Optional: handle Enter in input (already triggers submit) and provide quick UX
cityInput.addEventListener('input', () => {
  // clear messages when user types
  if (messageEl.textContent) showMessage('', false);
});

// Example: Fetch a default city on page load (comment out if you don't want this)
document.addEventListener('DOMContentLoaded', () => {
  // Uncomment the line below to load a default city on open:
  // fetchWeather('London');
});