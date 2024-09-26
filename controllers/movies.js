const MovieService = require('../movieServices');
const movieService = new MovieService();


// List movies
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
  const { page, limit } = req.query;
  const searchQuery = req.query.q || '';

  if (searchQuery === '') {
    return res.status(400).json({ error: 'Invalid search query' });
  }

  try {

    const searchedMovies = await movieService.searchMovies(searchQuery, page, limit);
    if (searchedMovies.response.length > 0) {
      res.status(200).json(searchedMovies);
    } else {
      res.status(404).json({ message: 'No movie match the search' });
    }
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
    const paginatedComments = await movieService.getCommentsByMovieId(id, page, limit);
    res.status(200).json(paginatedComments);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};


// Post a comment
module.exports.postComment = async (req, res) => {
  const { id }= req.params;
  const { content, author } = req.body;

  if (!Number.isInteger(parseInt(id, 10)) || parseInt(id, 10) <= 0) {
    return res.status(400).json({ error: 'Invalid movie ID' });
  } else if (!content) {
    return res.status(400).json({ error: 'Content cannot be empty' });
  } else if(!author) {
    return res.status(400).json({ error: 'Author name is required' });
  }


  try {
    const comment = await movieService.addComment(id, content, author);
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