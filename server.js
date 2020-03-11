const express = require('express');
const app = express();
const request = require('request');
const { promisify } = require('util');
const { apikey } = require('./keys');
const NodeCache = require('node-cache');
const cache = new NodeCache({ useClones: false });
const PORT = 3001;
const get = promisify(request.get);

const moviedb = 'https://api.themoviedb.org/3';

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", 'http://localhost:3000');
  next();
})

app.get('/popularMovies', async (req, res) => {

  // const { count, page } = req.query;

  try {
    let popularMovies = cache.get('popularMovies');

    if (!popularMovies) {
      console.log('making request to themoviedb\n', `${moviedb}/movie/popular?api_key=${apikey}&language=en-US&page=1`);


      const response = await get(`${moviedb}/movie/popular?api_key=${apikey}&language=en-US&page=1`);


      popularMovies = JSON.parse(response.body).results.sort((a, b) => b.popularity - a.popularity);
      cache.set('popularMovies', popularMovies, 10 * 60 * 1000); // 10 minutes
    } else {
      console.log('fetching from cache');
    }



    res.send(popularMovies);
  } catch (e) {

    res.send(e);
    throw e;
  }



});

app.get('/searchMovies', async (req, res) => {
  const { query } = req.query;

  try {
    const response = await get(`${moviedb}/search/movie?api_key=${apikey}&query=${query}&language=en-US&page=1&include_adult=false`);
    const results = JSON.parse(response.body).results;
    res.send(results);

  } catch (e) {
    res.send(e);
    throw e;
  }
});

app.get('/findMovie', async (req, res) => {
  const { query } = req.query;

  try {

    console.log(`${moviedb}/movie/${query}?api_key=${apikey}&language=en-US`);


    const [movieResponse, videoResponse] = await Promise.all([
      get(`${moviedb}/movie/${query}?api_key=${apikey}&language=en-US`),
      get(`${moviedb}/movie/${query}/videos?api_key=${apikey}&language=en-US`)
    ]);

    // const response = await get(`${moviedb}/movie/${query}?api_key=${apikey}&language=en-US`);
    // const videoResponse = await get(`${moviedb}/movie/${query}/videos?api_key=${apikey}&language=en-US`);


    const results = JSON.parse(movieResponse.body);
    results.video = JSON.parse(videoResponse.body)
      .results
      .filter(({ type, site }) => site === 'YouTube' && type === 'Trailer')
      .pop();



    res.send(results);


    //https://api.themoviedb.org/3/movie/454626/videos?api_key=e922de56b43e77f334779a67e764c22d&language=en-US
    //https://api.themoviedb.org/3/movie/419704/videos?api_key=e922de56b43e77f334779a67e764c22d&language=en-US
  } catch (e) {
    res.send(e);
    throw e;
  }
});

app.listen(PORT);
console.log(`started server on ${PORT}...`);



//https://api.themoviedb.org/3/movie/454626/images?api_key=e922de56b43e77f334779a67e764c22d&language=en-US

// https://api.themoviedb.org/3/movie/454626/videos?api_key=e922de56b43e77f334779a67e764c22d&language=en-US


419704