"use strict";
const axios = require("axios");


async function getMovies(request, response, next) {
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
}

class Movie {
  constructor(movieObj) {
    this.movie = movieObj.title;
    this.description = movieObj.overview;
  }
}

module.exports = getMovies;


