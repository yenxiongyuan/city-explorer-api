"use strict";
const axios = require("axios");

let  cache = {};

//TODO: 1. Need to create a key for the data I'm going to store
//TODO: 2. If the thing exist AND in a valid timeframe ... send that data
//TODO: 3. If the thing DOES NOT exist - call API and cache what is returned from my API

/*
cache = {
  key-movies:{
    data: from API,
    timeStamp: Date.now()
  }
}
*/

async function getMovies(request, response, next) {
  try {
    let searchQuery = request.query.searchQuery;

    // *** #1 CREATE MY KEY ***
    let key = `${searchQuery}Movies`;  // -->> key == cityMovies     cache[cityMovies] []- use varibles 

    //*** #2 IF IT EXISTS AND IT IS IN A VALID TIME - SEND THAT DATA  ***
    if(cache[key] && (Date.now() - cache[key].timeStamp) < 10000){
       console.log('Cache was hit, movie data is showing')
       response.status(200).send(cache[key].data)
    } else {

          console.log('Cache missed -- NO movies data');

          let url = `https://api.themoviedb.org/3/search/movie?api_key=${process.env.MOVIE_API_KEY}&query=${searchQuery}&language=en-US&page=1&include_adult=false`;
      
          let moviesFromAxios = await axios.get(url);
          let movieArray = moviesFromAxios.data.results;
          let movieResult = movieArray.map((movie) => new Movie(movie));

          // *** Cache the results from the API call

          cache[key] = {
            data: movieResult,
            timeStamp: Date.now()
          }
          response.status(200).send(movieResult);
    }


  } catch (error) {
    next(error);
  }
}

class Movie {
  constructor(movieObj) {
    this.movie = movieObj.title;
    this.description = movieObj.overview;
  }
}

module.exports = getMovies;
