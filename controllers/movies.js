const movieService = require('../services/movieServices');
const commentService = require('../services/commentServices');


// List Allmovies
module.exports.index = async (req, res) => {
  try {
    const page = parseInt(req.query.page, 10);
    const limit = parseInt(req.query.limit, 10);
    const paginatedMovies = await movieService.getMovies(page, limit);
    res.status(200).json(paginatedMovies);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};


// Search for movies
module.exports.searchMovies = async (req, res) => {
  const { q = '' } = req.query;
  const page = parseInt(req.query.page, 10);
  const limit = parseInt(req.query.limit, 10);

  if (q.trim() === '') {
    return res.status(400).json({ error: 'Search query cannot be empty or just spaces' });
  }

  try {
    const searchedMovies = await movieService.searchMovies(q, page, limit);
    res.status(200).json(searchedMovies);
  } catch (err) {
    console.log("Express Error");
    res.status(500).json({ message: 'Internal Server Error' });
  }
};


// Get a movie
module.exports.movieDetails = async (req, res) => {
  const { id } = req.params;

  if (!Number.isInteger(parseInt(id, 10)) || parseInt(id, 10) <= 0) {
    return res.status(400).json({ error: 'Invalid movie ID' });
  }

  try {
    const movie = await movieService.getMovieById(id);
    if (!movie) {
      return res.status(404).json({ message: 'Movie ID not found' });
    }
    res.status(200).json({ response: [movie] });

  } catch (error) {
    console.log(error)
    res.status(500).json({ message: 'Internal Server Error' });
  }
};


//  Get comments
module.exports.getComments = async (req, res) => {
  const page = parseInt(req.query.page, 10);
  const limit = parseInt(req.query.limit, 10);
  const { id } = req.params;

  if (!Number.isInteger(parseInt(id, 10)) || parseInt(id, 10) <= 0) {
    return res.status(400).json({ error: 'Invalid movie ID' });
  }

  try {
    const movie = await movieService.getMovieById(id);
    if (!movie) {
      return res.status(404).json({ message: 'Movie ID not found' });
    }
    const paginatedComments = await commentService.getCommentsByMovieId(id, page, limit);
    res.status(200).json(paginatedComments);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
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


  try {
    const comment = await commentService.postComment(id, content, author);
    res.status(201).json({ response: comment });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Internal Server Error' });

  }
};


// Fetch similar movies
module.exports.fetchSimilarMovies = async (req, res) => {
  const page = parseInt(req.query.page, 10);
  const limit = parseInt(req.query.limit, 10);
  const { id } = req.params;

  if (!Number.isInteger(parseInt(id, 10)) || parseInt(id, 10) <= 0) {
    return res.status(400).json({ error: 'Invalid movie ID' });
  }

  try {
    const movie = await movieService.getMovieById(id);
    if (!movie) {
      return res.status(404).json({ message: "Movie ID not found" });
    }
    const similarMovies = await movieService.getSimilarMovies(id, page, limit);
    res.status(200).json(similarMovies);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};