const express = require('express');
const app = express();
app.use(express.json());
/* example
 * {id: 1, title: 'Hello', rating: 3}
 */
let movies = [];

let i = 1;
function getID() {
  return i++;
}

app.get('/movies', (req, res) => {
  res.json({movies});
});

app.get('/movies/:id', (req, res) => {
  const id = parseInt(req.params.id);
  if (!id) {
    res.status(400).end();
    return;
  }
  const movie = movies.find(movie => movie.id === id);
  if (movie) {
    res.json(movie);
  } else {
    res.status(404).end();
  }
});

app.post('/movies', (req, res) => {
  const body = req.body;
  if (!body.title || typeof body.title !== 'string' || typeof body.rating !== 'number') {
    res.status(400).end();
    return;
  }

  let movie = {
    id: getID(),
    title: body.title,
    rating: body.rating,
  };
  movies.push(movie);
  res.status(201).json(movie);
});

app.delete('/movies/:id', (req, res) => {
  const id = parseInt(req.params.id);
  if (!id) {
    res.status(400).end();
    return;
  }

  const movieIndex = movies.findIndex(movie => movie.id === id);
  if (movieIndex !== -1) {
    movies.splice(movieIndex, 1);
  }
  res.status(204).end();
});

app.put('/movies/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const body = req.body;
  if (!id || !body.title || typeof body.title !== 'string' || typeof body.rating !== 'number') {
    res.status(400).end();
    return;
  }

  const movieIndex = movies.findIndex(movie => movie.id === id);
  if (movieIndex !== -1) {
    let movie = {
      id: movies[movieIndex].id,
      title: body.title,
      rating: body.rating,
    };
    movies[movieIndex] = movie;
    res.status(200).send(movies[movieIndex]);
  } else {
    res.status(404).end();
  }
});

const PORT = 3033;
app.listen(PORT, function() {
  console.log('listening on', PORT);
});
