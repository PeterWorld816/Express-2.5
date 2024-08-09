const bodyParser = require('body-parser');
const express = require('express');
const app = express(); // Declare 'app' as a constant
const uuid = require('uuid'); // Declare 'uuid' as a constant
const path = require('path');

app.use(bodyParser.json());
app.use(express.static('public'));

let users = [  { id: 1,
  name: "Max Musterman",
  favouriteMovies: ["The Godfather"]    
},
{ id: 2,
  name: "Jane Doe",
  favouriteMovies: ["Pulp Fiction"]    
}];
let movies = [ {
  id: 1,
  title: "The Godfather",
  year: 1972,
  description: "The aging patriarch of an organized crime dynasty transfers control of his clandestine empire to his reluctant son.",
  genre: {
    name: "Crime",
    description: "Crime films center on the lives of criminals."
  },
  director: {
    name: "Francis Ford Coppola",
    bio: "Francis Ford Coppola is an American film director, producer, and screenwriter known for his epic film The Godfather and its sequels. He has won multiple Academy Awards.",
    birthday: "April 7, 1939"
  },
  imageURL: "https://m.media-amazon.com/images/M/MV5BNzk3YzkyMjYtZTYyOC00Y2ZkLWExMWItNWZjMzlhNWNjYzYxXkEyXkFqcGdeQXVyMTEwNDU1MzEy._V1_FMjpg_UX800_.jpg",
  featured: true
},
{
  id: 2,
  title: "Star Wars: Episode IV – A New Hope",
  year: 1977,
  description: "Luke Skywalker joins forces with a Jedi Knight, a cocky pilot, a Wookiee, and two droids to save the galaxy from the Empire's world-destroying battle station, while also attempting to rescue Princess Leia from the mysterious Darth Vader.",
  genre: {
    name: "Adventure",
    description: "Adventure films involve exploration or quests."
  },
  director: {
    name: "George Lucas",
    bio: "George Lucas is an American film director, producer, and screenwriter best known for creating the Star Wars and Indiana Jones franchises. He is a pioneer in modern filmmaking techniques.",
    birthday: "May 14, 1944"
  },
  imageURL: "https://m.media-amazon.com/images/M/MV5BM2MyNjYxNmUtYTAwNi00MTYxLWJmNWYtYzZlODY3ZTk3OTFlXkEyXkFqcGdeQXVyNzkwMjQ5NzM@._V1_.jpg",
  featured: true
},
{
  id: 3,
  title: "Pulp Fiction",
  year: 1994,
  description: "The lives of two mob hitmen, a boxer, a gangster's wife, and a pair of diner bandits intertwine in four tales of violence and redemption.",
  genre: {
    name: "Crime",
    description: "Crime films center on the lives of criminals."
  },
  director: {
    name: "Quentin Tarantino",
    bio: "Quentin Tarantino is an American filmmaker and screenwriter known for his stylized, non-linear storytelling and his love of film history. He has directed several critically acclaimed movies.",
    birthday: "March 27, 1963"
  },
  imageURL: "https://m.media-amazon.com/images/M/MV5BNGNhMDIzZTUtNTBlZi00MTRlLWFjM2ItYzViMjE3YzI5MjljXkEyXkFqcGdeQXVyNzkwMjQ5NzM@._V1_UY1200_CR97,0,630,1200_AL_.jpg",
  featured: false
}];

// READ all movies
app.get('/movies', (req, res) => {
  res.status(200).json(movies);
});

// READ movie by title
app.get('/movies/:title', (req, res) => {
  const { title } = req.params;
  const movie = movies.find(movie => movie.title === title);
  if (movie) {
    res.status(200).json(movie);
  } else {
    res.status(404).send('Movie not found');
  }
});

// READ genre description
app.get('/genres/:genre', (req, res) => {
  const { genre } = req.params;
  const genreMovies = movies.filter(movie => movie.genre === genre);
  if (genreMovies.length) {
    res.status(200).json({
      description: `Movies of genre ${genre}:`,
      movies: genreMovies
    });
  } else {
    res.status(404).send('Genre not found');
  }
});

// READ director bio (For simplicity, using a static response)
app.get('/directors/:director', (req, res) => {
  const { director } = req.params;
  // This data should ideally come from a database or another source
  const directorBio = {
    name: director,
    bio: "Bio of the director",
    birthYear: 1960,
    deathYear: null
  };
  res.status(200).json(directorBio);
});

// CREATE new user
app.post('/users', (req, res) => {
  const { username, email, password } = req.body;
  const newUser = { id: uuid.v4(), username, email, password, favorites: [] };
  users.push(newUser);
  res.status(201).send('User registered');
});

// UPDATE user info
app.put('/users/:userId', (req, res) => {
  const { userId } = req.params;
  const { username } = req.body;
  const user = users.find(user => user.id === userId);
  if (user) {
    user.username = username;
    res.status(200).send('User info updated');
  } else {
    res.status(404).send('User not found');
  }
});

// ADD movie to favorites
app.post('/users/:userId/favorites/:movieId', (req, res) => {
  const { userId, movieId } = req.params;
  const user = users.find(user => user.id === userId);
  const movie = movies.find(movie => movie.id === movieId);
  if (user && movie) {
    user.favorites.push(movieId);
    res.status(200).send('Movie added to favorites');
  } else {
    res.status(404).send('User or movie not found');
  }
});

// REMOVE movie from favorites
app.delete('/users/:userId/favorites/:movieId', (req, res) => {
  const { userId, movieId } = req.params;
  const user = users.find(user => user.id === userId);
  if (user) {
    user.favorites = user.favorites.filter(id => id !== movieId);
    res.status(200).send('Movie removed from favorites');
  } else {
    res.status(404).send('User not found');
  }
});

// DEREGISTER user
app.delete('/users/:userId', (req, res) => {
  const { userId } = req.params;
  users = users.filter(user => user.id !== userId);
  res.status(200).send('User deregistered');
});

app.listen(8080, () => console.log("Listening on port 8080"));

// Add some initial data for testing
movies.push(
  { id: uuid.v4(), title: "Inception", description: "A mind-bending thriller", genre: "Thriller", director: "Christopher Nolan", imageUrl: "http://image.url", featured: true },
  { id: uuid.v4(), title: "Interstellar", description: "A journey through space and time", genre: "Sci-Fi", director: "Christopher Nolan", imageUrl: "http://image.url", featured: false }
);