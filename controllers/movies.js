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
  try {
    const { q } = req.query;
    if (q) {
      const searchedMovies = await movieService.searchMovies(q);
      if (searchedMovies.length > 0) {
        res.status(200).json({ response: searchedMovies });
      } else {
        res.status(404).json({ message: 'movie not found' });
      }
    }
  } catch (err) {
    console.log("Express Error");
    res.status(500).json({ message: 'Internal Server Error' });
  }
};


// Get a movie
module.exports.movieDetails = async (req, res) => {
  try {
    const { id } = req.params;
    const movie = await movieService.getMovieById(id);
    if (movie) {
      res.status(200).json({ response: [movie] });
    } else {
      res.status(404).json({ message: 'movie not found' });
    }
  } catch (error) {
    console.log(error)
  }
};


//  Get comments
module.exports.getComments = async (req, res) => {
  try {
    const page = parseInt(req.query.page, 10);
    const limit = parseInt(req.query.limit, 10);
    const { id } = req.params;
    const start = (page - 1) * limit;
    const end = start + limit;
    const paginatedComments = await movieService.getCommentsByMovieId(id, page, limit);
    // console.log(paginatedComments);
    res.status(200).json(paginatedComments);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

// Post a comment
module.exports.postComment = async (req, res) => {
  try {
    const { id } = req.params;
    const { content, author } = req.body;
    if (!id || !content || !author) {
      return res.status(400).json({ message: 'Invalid Request' });
    }
    await movieService.addComment(id, content, author);
    res.status(201).json({ message: 'comment created successfully' });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Internal Server Error' });

  }
};


module.exports.fetchSimilarMovies = async (req, res) => {
  try {
    const page = parseInt(req.query.page, 10);
    const limit = parseInt(req.query.limit, 10);
    const { id } = req.params;
    const paginatedComments = await movieService.getSimilarMovies(id, page, limit);
    console.log('HELP');
    res.status(200).json(paginatedComments);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};