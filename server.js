"use strict";

console.log("This is the first server");

// **** REQUIRES ****
const express = require("express");
require("dotenv").config();
const cors = require("cors");
const axios = require("axios");

// *** FOR LAB DON'T FORGET TO REQUIRE YOUR STARTER JSON FILE ***
let data = require("./data/weather.json");

// **** Once express is in we need to use it - per express docs
// *** app === server
const app = express();

// **** MIDDLEWARE ****
// *** cors is middleware - security guard that allows us to share resources across the internet ***
app.use(cors());

// *** DEFINE A PORT FOR MY SERVER TO RUN ON ***
const PORT = process.env.PORT || 3002;

// **** ENDPOINTS ****

// *** Base endpoint - proof of life
// ** 1st arg - endpoint in quotes
// ** 2nd arg - callback which will execute when someone hits that point

// *** Callback function - 2 parameters: request, response (req,res)

app.get('/weather', async (request, response, next) => {
  try {
    // let { searchQuery } = request.query;

    let lat = request.query.lat;
    let lon = request.query.lon;

    let url = `http://api.weatherbit.io/v2.0/forecast/daily?key=${process.env.REACT_APP_WEATHER_API_KEY}&lat=${lat}&lon=${lon}&days=3&units=I`;

     let weatherFromAxios = await axios.get(url);
    console.log(weatherFromAxios);
    let arrayDays = weatherFromAxios.data.data;
    let weatherData = arrayDays.map(day => new Forecast(day));
    // console.log(arrayDays);
    
    response.status(200).send(weatherData);
  } catch (error) {
    next(error);
  }
});

app.get("/movies", async (request, response, next) => {
  try {
    let searchQuery = request.query.searchQuery;
    let url = `https://api.themoviedb.org/3/search/movie?api_key=${process.env.MOVIE_API_KEY}&query=${searchQuery}&language=en-US&page=1&include_adult=false`;

    let moviesFromAxios = await axios.get(url);
    let movieArray = moviesFromAxios.data.results;
    let movieResult = movieArray.map((movie) => new Movie(movie));

    response.status(200).send(movieResult);
  } catch (error) {
    next(error);
  }
});

// **** CLASS TO GROOM BULKY DATA ****

class Forecast {
  constructor(cityObj) {
    this.description = cityObj.weather.description;
    this.date = cityObj.datetime;
  }
}

class Movie {
  constructor(movieObj) {
    this.movie = movieObj.title;
    this.description = movieObj.overview;
  }
}

// **** CATCH ALL ENDPOINT - NEEDS TO BE YOUR LAST DEFINED ENDPOINT ****
app.get("*", (request, response) => {
  response.status(404).send("This page does not exist");
});

// **** ERROR HANDLING - PLUG AND PLAY CODE FROM EXPRESS DOCS ****
app.use((error, request, response, next) => {
  response.status(500).send(error.message);
});

// ***** SERVER START ******
app.listen(PORT, () => console.log(`Using port: ${PORT}`));
