const movieService = require('../services/movieServices');
const commentService = require('../services/commentServices');

// List Allmovies
module.exports.index = async (req, res) => {
  const page = parseInt(req.query.page, 10);
  const limit = parseInt(req.query.limit, 10);
  const paginatedMovies = await movieService.getMovies(page, limit);
  res.status(200).json(paginatedMovies);
};


// Search for movies
module.exports.searchMovies = async (req, res) => {
  const { q = '' } = req.query;
  const page = parseInt(req.query.page, 10);
  const limit = parseInt(req.query.limit, 10);

  if (q.trim() === '') {
    return res.status(400).json({ error: 'Search query cannot be empty or just spaces' });
  }

  const searchedMovies = await movieService.searchMovies(q, page, limit);
  res.status(200).json(searchedMovies);
};


// Get a movie
module.exports.movieDetails = async (req, res) => {
  const { id } = req.params;

  if (!Number.isInteger(parseInt(id, 10)) || parseInt(id, 10) <= 0) {
    return res.status(400).json({ error: 'Invalid movie ID' });
  }

  const movie = await movieService.getMovieById(id);
  if (!movie) {
    return res.status(404).json({ message: 'Movie ID not found' });
  }
  console.log(movie);
  
  res.status(200).json({ response: movie });
};


//  Get comments
module.exports.getComments = async (req, res) => {
  const page = parseInt(req.query.page, 10);
  const limit = parseInt(req.query.limit, 10);
  const { id } = req.params;

  if (!Number.isInteger(parseInt(id, 10)) || parseInt(id, 10) <= 0) {
    return res.status(400).json({ error: 'Invalid movie ID' });
  }

  const movie = await movieService.getMovieById(id);
  if (!movie) {
    return res.status(404).json({ message: 'Movie ID not found' });
  }

  const paginatedComments = await commentService.getCommentsByMovieId(id, page, limit);
  res.status(200).json(paginatedComments);
};


// Post a comment
module.exports.postComment = async (req, res) => {
  const { id } = req.params;
  const { content, author } = req.body;

  if (!Number.isInteger(parseInt(id, 10)) || parseInt(id, 10) <= 0) {
    return res.status(400).json({ error: 'Invalid movie ID' });
  } else if (!content) {
    return res.status(400).json({ error: 'Content cannot be empty' });
  } else if (!author) {
    return res.status(400).json({ error: 'Author name is required' });
  }

  const commentData = {
    author,
    content,
    created_at: new Date(),
    movie_id: parseInt(id),
  }
  const comment = await commentService.addComment(commentData);
  res.status(201).json({ response: comment });
};


// Fetch similar movies
module.exports.fetchSimilarMovies = async (req, res) => {
  const page = parseInt(req.query.page, 10);
  const limit = parseInt(req.query.limit, 10);
  const { id } = req.params;

  if (!Number.isInteger(parseInt(id, 10)) || parseInt(id, 10) <= 0) {
    return res.status(400).json({ error: 'Invalid movie ID' });
  }

  const movie = await movieService.getMovieById(id);
  if (!movie) {
    return res.status(404).json({ message: "Movie ID not found" });
  }
  const similarMovies = await movieService.getSimilarMovies(id, page, limit);
  res.status(200).json(similarMovies);
};