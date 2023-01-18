"use strict";

console.log("This is the first server");

// **** REQUIRES ****
const express = require("express");
require("dotenv").config();
const cors = require("cors");

// *** FOR LAB DON'T FORGET TO REQUIRE YOUR STARTER JSON FILE ***
let data = require("./data/weather.json");

// **** Once express is in we need to use it - per express docs
// *** app === server
const app = express();

// **** MIDDLEWARE ****
// *** cors is middleware - security guard that allows us to share resources across the internet **
app.use(cors());

// *** DEFINE A PORT FOR MY SERVER TO RUN ON ***
const PORT = process.env.PORT || 3002;

// **** ENDPOINTS ****

// *** Base endpoint - proof of life
// ** 1st arg - endpoint in quotes
// ** 2nd arg - callback which will execute when someone hits that point

// *** Callback function - 2 parameters: request, response (req,res)

app.get("/weather", (request, response, next) => {
  try {
    let { searchQuery } = request.query;

    // let lat = request.query.lat;
    // let lon = request.query.lon;

    let dataToGroom = data.find(
      (city) =>
        city.city_name.toLocaleLowerCase() === searchQuery.toLocaleLowerCase()
    );

    // let dataToSend = new Forecast(dataToGroom);
    let dataToSend = dataToGroom.data.map((day) => new Forecast(day));

    response.status(200).send(dataToSend);
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
