'use strict';

const axios = require('axios');
let cache = require('./cache.js');



function getWeather(latitude, longitude) {

  
  const lat = latitude;
  const lon = longitude;
  // console.log(log);
  console.log(lat);
  console.log(lon);

  const key = 'weather-' + lat + lon;
  const url = `http://api.weatherbit.io/v2.0/forecast/daily/?key=${process.env.WEATHER_API_KEY}&lang=en&lat=${lat}&lon=${lon}&days=5`;

  if (cache[key] && Date.now() - cache[key].timestamp < 10000) {
    console.log('Cache hit');
    
  } else {
    console.log('Cache miss');
    cache[key] = {};
    cache[key].timestamp = Date.now();
    cache[key].data = axios
      .get(url)
      .then((response) => parseWeather(response.data));
  }

  return cache[key].data;
}

function parseWeather(weatherData) {
  console.log(weatherData);
  try {
    const weatherSummaries = weatherData.data.map((day) => {
      return new Weather(day);
    });
    return Promise.resolve(weatherSummaries);
  } catch (e) {
    return Promise.reject(e);
  }
}

class Weather {
  constructor(day) {
    this.forecast = day.weather.description;
    this.time = day.datetime;
  }
}

module.exports = getWeather;