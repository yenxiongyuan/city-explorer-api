'use strict'
const axios = require("axios");


async function getWeather(request, response, next) {
  try {
    // let { searchQuery } = request.query;

    let lat = request.query.lat;
    let lon = request.query.lon;

    let url = `http://api.weatherbit.io/v2.0/forecast/daily?key=${process.env.REACT_APP_WEATHER_API_KEY}&lat=${lat}&lon=${lon}&days=3&units=I`;

    let weatherFromAxios = await axios.get(url);
    console.log(weatherFromAxios);
    let arrayDays = weatherFromAxios.data.data;
    let weatherData = arrayDays.map((day) => new Forecast(day));
    // console.log(arrayDays);

    response.status(200).send(weatherData);
  } catch (error) {
    next(error);
  }
}

class Forecast {
  constructor(cityObj) {
    this.description = cityObj.weather.description;
    this.date = cityObj.datetime;
  }
}

module.exports = getWeather;