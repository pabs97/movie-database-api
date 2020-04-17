# movie-database-api
This is the back end component to movie-database-app
It is built using Express and caches GET requests from themoviedb using node-cache

### Setup
#### Installation
`npm i`

#### Server
`npm start`
By default it runs on port 3001

### Usage
You will need to register with themoviedb and get an api key, then add that key to keys.json

#### GET /popularMovies
returns the 20 most popular movies

#### GET /searchMovies?query=<search_query>
returns results for the given search query

#### GET /findMovie?query=<movie_id>
get the information of a specific movie


### TODO
- [ ] get information on actors
