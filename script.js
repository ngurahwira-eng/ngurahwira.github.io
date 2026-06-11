// Replace with your OpenWeatherMap API key
const API_KEY = 'YOUR_API_KEY_HERE';

const $ = id => document.getElementById(id);
const cityInput = $('cityInput');
const searchBtn = $('searchBtn');
const loader = $('loader');
const result = $('result');
const cityEl = $('city');
const tempEl = $('temp');
const humidityEl = $('humidity');
const conditionEl = $('condition');
const errorEl = $('error');

function showLoader(show){
  loader.classList.toggle('hidden', !show);
}

function showResult(show){
  result.classList.toggle('hidden', !show);
}

async function fetchWeather(city){
  if(!API_KEY || API_KEY === 'YOUR_API_KEY_HERE'){
    throw new Error('No API key set. Edit script.js and add your OpenWeatherMap API key.');
  }

  const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&units=metric&appid=${API_KEY}`;
  const resp = await fetch(url);
  if(!resp.ok){
    const data = await resp.json().catch(()=> ({}));
    const msg = data.message || resp.statusText || 'Failed to fetch';
    throw new Error(msg);
  }
  return resp.json();
}

function render(data){
  const {name, main, weather} = data;
  cityEl.textContent = name || '—';
  tempEl.textContent = main && typeof main.temp === 'number' ? `${Math.round(main.temp)}°C` : '—°C';
  humidityEl.textContent = main && typeof main.humidity === 'number' ? `Humidity: ${main.humidity}%` : 'Humidity: —%';
  conditionEl.textContent = weather && weather[0] && weather[0].description ? capitalize(weather[0].description) : '—';
}

function capitalize(s){
  return s.replace(/(^|\s)\S/g, t => t.toUpperCase());
}

async function doSearch(){
  const city = cityInput.value.trim();
  errorEl.textContent = '';
  if(!city) return;
  showResult(false);
  showLoader(true);
  try{
    const data = await fetchWeather(city);
    render(data);
    showResult(true);
  }catch(err){
    errorEl.textContent = err.message || 'Unable to get weather';
  }finally{
    showLoader(false);
  }
}

searchBtn.addEventListener('click', doSearch);
cityInput.addEventListener('keydown', e => { if(e.key === 'Enter') doSearch(); });
